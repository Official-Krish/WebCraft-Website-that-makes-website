import { InstancesClient } from "@google-cloud/compute";
import express from "express";
import { InstanceGroupManagersClient } from "@google-cloud/compute";
import { authMiddleware } from "./middeware";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["https://webcraft.krishdev.xyz", "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const projectId = process.env.PROJECT_ID;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const zone = "asia-south2-a";
const igmClient = new InstanceGroupManagersClient();
const instanceGroupManager = "vscode-instance-group";
const instanceClient = new InstancesClient();

type Machine = {
    ip: string;
    isUsed: boolean;
    instanceName: string;
    assignedProjectId?: string;
}

const machines: Machine[] = [];

async function refreshInstances(){
    const [vms] = await instanceClient.list({
        project: projectId,
        zone,
    });

    const metaDataPromises = vms.map(async (vm) => {
        const [data] = await instanceClient.get({
            instance: vm.name,
            project: projectId,
            zone,
        });
        const ip = data.networkInterfaces?.[0]?.accessConfigs?.[0]?.natIP;

        return {
            ip: ip!,
            isUsed: false,
            instanceName: vm.name!,
        };
    });
    const updatedMachines = await Promise.all(metaDataPromises);
    machines.length = 0; // Clear the existing machines array
    machines.push(...updatedMachines);
}

refreshInstances();

setInterval(() => {
    refreshInstances();
}, 10 * 1000);

app.get("/:projectId", authMiddleware, async (req, res) => {
    const idleMachine = machines.find(x => !x.isUsed);

    if (!idleMachine) {
        // No idle machine, scale up the group by 1
        const [currentGroup] = await igmClient.get({
            project: projectId,
            zone,
            instanceGroupManager,
        });

        const currentSize = currentGroup.targetSize || 0;

        await igmClient.resize({
            project: projectId,
            zone,
            instanceGroupManager,
            size: currentSize + 1,
        });

        res.status(202).send("Scaling up. Try again in a few seconds.");
        return;
    }

    idleMachine.isUsed = true;

    res.send({
        ip: idleMachine.ip,
        instanceName: idleMachine.instanceName,
    });
});


app.post("/destroy", authMiddleware, async (req, res) => {
    const instanceName: string = req.body.instanceName;

    if (!req.body?.instanceName) {
        res.status(400).json({ error: "instanceName is required" });
        return;
    }

    await instanceClient.delete({
        project: projectId,
        zone,
        instance: instanceName
    });
    // Optional scale down: get current size and reduce by 1
    const [currentGroup] = await igmClient.get({
        project: projectId,
        zone,
        instanceGroupManager,
    });

    const currentSize = currentGroup.targetSize || 1;

    await igmClient.resize({
        project: projectId,
        zone,
        instanceGroupManager,
        size: Math.max(0, currentSize - 1),
    });

    res.send({ message: `Instance ${instanceName} is being deleted and group resized.` });
});


app.listen(9000, () => {
    console.log("Server is running on port 9000");
});