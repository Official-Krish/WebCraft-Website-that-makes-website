process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import express from 'express';
import cors from 'cors';
import prisma from "@repo/db/client"
import { KubeConfig } from "@kubernetes/client-node";
import * as k8s from "@kubernetes/client-node";
import { Writable } from 'stream';
import { DOMAIN } from './config';
import { authMiddleware } from './middlware';
import { addNewPod, getAllPods, removePod } from './redis';

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["https://webcraft.krishdev.xyz" , "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
  
app.set('trust proxy', 1);


const kc = new KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const currentContext = kc.getCurrentContext();
const cluster = kc.getCluster(currentContext); 
const networkingApi = kc.makeApiClient(k8s.NetworkingV1Api);

async function listPods() {
    const res =  await k8sApi.listNamespacedPod({ namespace: "user-apps" });
    return res.items.filter(pod => pod.status?.phase === "Running" || pod.status?.phase === "Pending").filter(pod => pod.metadata?.name).map(pod => pod.metadata?.name);
}

export async function createIngressForProject(projectId: string) {
    const ingressManifest = {
        metadata: {
            name: `ingress-${projectId}`,
            namespace: "user-apps",
            annotations: {
                "kubernetes.io/ingress.class": "nginx", 
                "cert-manager.io/cluster-issuer": "letsencrypt-prod", 
            },
        },
        spec: {
            rules: [
                {
                    host: `session-${projectId}.${DOMAIN}`,
                    http: {
                        paths: [
                            {
                                path: "/",
                                pathType: "Prefix",
                                backend: {
                                    service: {
                                        name: `session-${projectId}`,
                                        port: {
                                            number: 8080,
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    host: `preview-${projectId}.${DOMAIN}`,
                    http: {
                        paths: [
                            {
                                path: "/",
                                pathType: "Prefix",
                                backend: {
                                    service: {
                                        name: `preview-${projectId}`,
                                        port: {
                                            number: 8080,
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    host: `worker-${projectId}.${DOMAIN}`,
                    http: {
                        paths: [
                            {
                                path: "/",
                                pathType: "Prefix",
                                backend: {
                                    service: {
                                        name: `worker-${projectId}`,
                                        port: {
                                            number: 8080,
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
            tls: [
                {
                    hosts: [
                        `session-${projectId}.${DOMAIN}`,
                        `preview-${projectId}.${DOMAIN}`,
                        `worker-${projectId}.${DOMAIN}`,
                    ],
                    secretName: `cert-${projectId}`,
                },
            ],
        },
    };
    try {
        await networkingApi.createNamespacedIngress({ namespace: "user-apps", body: ingressManifest});
        console.log(`Ingress created for project ${projectId}`);
    } catch (error) {
        console.error("Error creating ingress:", error);
    }
}

async function createPod(name: string) {
    await k8sApi.createNamespacedPod( { namespace: "user-apps", body: {
        metadata: {
            name: name,
            labels: {
                app: name
            }
        },
        spec: {
            containers: [{
                name: "code-server",
                image: "krishanand01/webcraft-code-server:v2",
                ports: [{
                    containerPort: 8080
                }, {
                    containerPort: 8081
                }],
            }, {
                name: "ws-relayer",
                image: "krishanand01/webcraft-relayer-ws:v2",
                ports: [{
                    containerPort: 9093
                }],
            }, {
                name: "worker",
                image: "krishanand01/webcraft-worker:v2",
                ports: [{
                    containerPort: 4000
                }],
                env: [{
                    name: "WS_RELAYER_URL",
                    value: "ws://localhost:9093"
                }, {
                    name: "GEMINI_API_KEY",
                    valueFrom: {
                        secretKeyRef: {
                            name: "worker-secret",
                            key: "GEMINI_API_KEY"
                        }
                    }
                }, {
                    name: "DATABASE_URL",
                    valueFrom: {
                        secretKeyRef: {
                            name: "worker-secret",
                            key: "DATABASE_URL"
                        }
                    },  
                }, {
                    name: "JWT_SECRET",
                    valueFrom: {
                        secretKeyRef: {
                            name: "worker-secret",
                            key: "JWT_SECRET"
                        }
                    }
                }]
            }]
        }
    }});

    await k8sApi.createNamespacedService( { namespace: "user-apps", body: {
        metadata: {
            name: `session-${name}`,
        },
        spec: {
            selector: {
                app: name
            },
            ports: [{
                port: 8080,
                targetPort: 8080,
                protocol: "TCP",
                name: "session"
            }]
        }
    }})

    await k8sApi.createNamespacedService( { namespace: "user-apps", body: {
        metadata: {
            name: `preview-${name}`,
        },
        spec: {
            selector: {
                app: name
            },
            ports: [{
                port: 8080,
                targetPort: 8081,
                protocol: "TCP",
                name: "preview"
            }]
        }
    }})

    await k8sApi.createNamespacedService( { namespace: "user-apps", body: {
        metadata: {
            name: `worker-${name}`,
        },
        spec: {
            selector: {
                app: name
            },
            ports: [{
                port: 8080,
                targetPort: 4000,
                protocol: "TCP",
                name: "worker"
            }]
        }
    }})
}

async function checkPodIsReady(name: string) {
    let attempts = 0;
    while(true){
        const pod = await k8sApi.readNamespacedPod( { namespace: "user-apps", name });
        if (pod.status?.phase === "Running") {
            return;
        }
        if(attempts > 20) {
            throw new Error("Pod is not ready");
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;
    }
}

async function assignPodToProject(projectId: string) {
    const pods = await listPods();
    console.log("pods",pods);
    const podExits = pods.find(pod => pod === projectId);
    if (!podExits) {
        console.log("Pod does not exist creating pod");
        await createPod(projectId);
        console.log("Pod created");
    }
    await checkPodIsReady(projectId);
    console.log("Pod is ready");
    const exec = new k8s.Exec(kc);
    let stdout = "";
    let stderr = "";

    exec.exec("user-apps",projectId, "code-server", ["/bin/sh", "-c", "mv /tmp/react-app/* /app"],
        new Writable({
            write: (chunk: Buffer, encoding: BufferEncoding, callback: () => void) => {
                stdout += chunk;
                callback();
            }
        }),
        new Writable({
            write: (chunk: Buffer, encoding: BufferEncoding, callback: () => void) => {
                stderr += chunk;
                callback();
            }
        }), 
        null,
        false, 
        (status) => {
            console.log(status);
            console.log(stdout);
            console.log(stderr);
        }
    )
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Pod is ready finally");
    console.log(stdout);
    console.log(stderr);
    createIngressForProject(projectId);
    await new Promise(resolve => setTimeout(resolve, 10000));
}

app.use(express.json());

app.get("/worker/:projectId", authMiddleware, async (req, res) => {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        },
    });

    if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
    }

    await assignPodToProject(projectId);
    addNewPod(projectId);

    res.status(200).json({
        sessionUrl: `https://session-${projectId}.${DOMAIN}`,
        previewUrl: `https://preview-${projectId}.${DOMAIN}`,
        workerUrl: `https://worker-${projectId}.${DOMAIN}`,
    })
});


setInterval(async () => {
    try {
        const pods = await getAllPods();
        if (pods.length === 0) {
            console.log('No pods to clean up');
            return;
        }
        const now = Date.now();
        for (const pod of pods) {  
            if (!pod.startTime || isNaN(Number(pod.startTime))) {
                console.warn(`Invalid startTime for pod: ${JSON.stringify(pod)}`);
                continue;
            }
            const age = now - parseInt(pod.startTime!);
            if (age > 1000 * 60 * 10) {  
                await k8sApi.deleteNamespacedPod({ name: pod.projectId, namespace: "user-apps" });
                await k8sApi.deleteNamespacedService({ name: `session-${pod.projectId}`, namespace: "user-apps" });
                await k8sApi.deleteNamespacedService({ name: `preview-${pod.projectId}`, namespace: "user-apps" });
                await k8sApi.deleteNamespacedService({ name: `worker-${pod.projectId}`, namespace: "user-apps" });
                await networkingApi.deleteNamespacedIngress({name: `ingress-${pod.projectId}`, namespace: "user-apps"});
                await removePod(pod.projectId);
            }
        }
    } catch (error) {
        console.error('Error in pod cleanup interval:', error);
    }
}, 1000 * 60 * 10);  

app.listen(9000, () => {
    console.log('K8s Orchestrator is running on port 9000');
});