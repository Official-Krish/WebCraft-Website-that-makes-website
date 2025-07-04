require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { getSystemPrompt } from './utils/Prompt';
import { ArtifactProcessor } from './utils/parser';
import { onDescription, onFileUpdate, onPromptEnd, onPromptStart, onShellCommand } from './utils/os';
import { authMiddleware } from './middleware';
import prisma from "@repo/db/client";
import OpenAI from "openai";

const app = express();
app.use(express.json());

app.use(cors({
    origin: ["https://webcraft.krishdev.xyz", "http://localhost:5174"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
  
app.set('trust proxy', 1);

app.options('*', cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: process.env.OPENAI_API_BASE_URL || "",
});


app.post("/api/v1/AI/chat", authMiddleware, async (req, res) => {
    try {
        // Ensure the prompt is a string
        let userPrompt = req.body.prompt || ""; 
        const projectId = req.body.projectId || ""; 
        if (typeof userPrompt !== "string") {
            userPrompt = JSON.stringify(userPrompt, null, 2);
        }

        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
            },
        });
        if (!project) {
            res.status(404).json({ error: "Project not found" });
            return;
        }

        // Combine user prompt with system prompt
        // const prompt = `${userPrompt}`.trim();

        const prompt = userPrompt;

        const promptDb = await prisma.prompt.create({
            data: {
                content: prompt,
                projectId: projectId,
                type: "USER",
            }
        })

        const allPrompts = await prisma.prompt.findMany({
            where: {
                projectId: projectId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        let responseText = "";

        const stream = await openai.chat.completions.create({
            model: "shivaay",
            messages: [
                { role: "system", content: getSystemPrompt() },
                {role: "system", content: "If user doesnt specify file format in which they wants code, then always return code in typescript format (tsx or ts), for example: build a todo website, then give the code in typescript not in javascript. If user explicitly asks for javascript, then only return code in javascript format (js or jsx)."},
                { role: "user", content: allPrompts.map(p => p.content).join("\n") + `\n\n${prompt}` },
            ],
            stream: true,
            max_tokens: 10000,
        });

        let artifactProcessor = new ArtifactProcessor(
            "", 
            (filePath, fileContent) => onFileUpdate(filePath, fileContent, projectId, promptDb.id), 
            (shellCommand) => onShellCommand(shellCommand, projectId, promptDb.id),
            (description) => onDescription(description, projectId, promptDb.id),
        )

        onPromptStart();
        for await (const chunk of stream) {
            const data = chunk.choices[0].delta.content;
            if (!data) continue; 
            responseText += data;
            artifactProcessor.append(data);
            artifactProcessor.parse();
        }
        onPromptEnd();

        // Send the response back to the client
        res.status(200).json({ message: responseText });
    } catch (error) {
        console.error("Error in /chat route:", error);

        // Respond with a meaningful error message
        res.status(500).json({ error: "An error occurred while generating content." });
    }
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});