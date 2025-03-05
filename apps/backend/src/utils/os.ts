const BASE_WORKER_DIR = "/tmp/Pixlr-worker";

const ws = new WebSocket(process.env.WS_RELAYER_URL || "ws://localhost:9093");

export async function onPromptStart() {
    ws.send(JSON.stringify({
        event:"admin",
        data:{
            type:"prompt_start"
        }
    }))
}

export async function onPromptEnd() {
    ws.send(JSON.stringify({
        event:"admin",
        data:{
            type:"prompt_end"
        }
    }))
}

export async function onFileUpdate(filePath: string, fileContent: string) {
    ws.send(JSON.stringify({
        event: "admin",
        data: {
            type: "update-file",
            content: fileContent,
            path: `${BASE_WORKER_DIR}/${filePath}`
        }
    }))
}

export async function onShellCommand(shellCommand: string) {
    const commands = shellCommand.split("&&");
    for (const command of commands) {
        console.log(`Running command: ${command}`);
        console.log(BASE_WORKER_DIR);

        ws.send(JSON.stringify({
            event: "admin",
            data: {
                type: "command",
                content: command
            }
        }))
    }
}