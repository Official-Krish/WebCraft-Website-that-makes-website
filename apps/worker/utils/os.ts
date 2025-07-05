require("dotenv").config();

import prisma from "@repo/db/client";

const BASE_WORKER_DIR = "/tmp/react-app";

if (!Bun.file(BASE_WORKER_DIR).exists()) {
    Bun.write(BASE_WORKER_DIR, "");
}

const ws = new WebSocket(process.env.WS_RELAYER_URL || "ws://localhost:9093");

export async function onFileUpdate(filePath: string, fileContent: string, projectId: string, promptId: string) {

    await prisma.action.create({
        data: {
            content: `Updated file ${filePath}`,
            projectId: projectId,
            promptId: promptId,
            type: "FILE"
        }
    })
    ws.send(JSON.stringify({
        event: "admin",
        data: {
            type: "update-file",
            content: fileContent,
            path: `${BASE_WORKER_DIR}/${filePath}`
        }
    }))
}

export async function onShellCommand(shellCommand: string, projectId: string, promptId: string) {
    const commands = shellCommand.split("&&");
    for (const command of commands) {
        ws.send(JSON.stringify({
            event: "admin",
            data: {
                type: "command",
                content: command
            }
        }))
        await prisma.action.create({
            data: {
                content: `Running command ${command}`,
                projectId,
                promptId,
                type: "COMMAND"
            }
        })
    }
}

export async function onDescription(description: string, projectId: string, promptId: string) {
    await prisma.action.create({
        data: {
            content: description,
            projectId,
            promptId,
            type: "MESSAGE"
        }
    })

}

export function onPromptStart() {
    ws.send(JSON.stringify({
        event: "admin",
        data: {
            type: "prompt-start"
        }
    }))
}

export function onPromptEnd() {
    ws.send(JSON.stringify({
        event: "admin",
        data: {
            type: "prompt-end"
        }
    }))
}