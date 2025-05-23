import type { ServerWebSocket } from "bun";
import type { MessagePayload } from "./types";

const SUBSCRIPTIONS: ServerWebSocket<unknown>[] = []

let bufferedMessages: any[] = []

Bun.serve({
    fetch(req, server) {
      // upgrade the request to a WebSocket
      if (server.upgrade(req)) {
        return; // do not return a Response
      }
      return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        message(ws, message) {
            const { event, data }: MessagePayload = JSON.parse(message.toString().trim());
            if (event === "subscribe") {
                SUBSCRIPTIONS.push(ws);
                if (bufferedMessages.length) {
                    SUBSCRIPTIONS.forEach(ws => ws.send(JSON.stringify(bufferedMessages.shift())));
                    bufferedMessages = [];
                }
            } else if (event === "admin") {
                if (!SUBSCRIPTIONS.length) {
                    bufferedMessages.push(data);
                } else {
                    SUBSCRIPTIONS.forEach(ws => ws.send(JSON.stringify(data)));
                }
            }
        },
        open(ws) {
            console.log("open");
        },
        close(ws) {
            console.log("close");
        },
        
    },
    port: 9093
  });