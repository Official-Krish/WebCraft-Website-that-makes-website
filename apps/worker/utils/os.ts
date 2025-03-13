const BASE_WORKER_DIR = "/tmp/Pixlr-worker";

if (!Bun.file(BASE_WORKER_DIR).exists()) {
    Bun.write(BASE_WORKER_DIR, "");
}

const ws = new WebSocket(process.env.WS_RELAYER_URL || "ws://localhost:9093");

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
    //npm run build && npm run start
    const commands = shellCommand.split("&&");
    for (const command of commands) {
        console.log(`Running command: ${command}`);
        console.log(BASE_WORKER_DIR);
        // const result = Bun.spawnSync({cmd: command.split(" "), cwd: BASE_WORKER_DIR});

        ws.send(JSON.stringify({
            event: "admin",
            data: {
                type: "command",
                content: command
            }
        }))
    }
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