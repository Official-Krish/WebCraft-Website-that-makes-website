require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { getSystemPrompt } from './utils/Prompt';
import { ArtifactProcessor } from './utils/parser';
import { onDescription, onFileUpdate, onPromptEnd, onPromptStart, onShellCommand } from './utils/os';
import { authMiddleware } from './middleware';
import prisma from "@repo/db/client";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

app.use(cors({
    origin: ["https://webcraft.krishdev.xyz", "http://localhost:5174"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
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

        const response = await ai.models.generateContentStream({
            model: "gemini-2.5-pro",
            contents: {
                text: getSystemPrompt() + "\n\n" + allPrompts.map((p: any) => p.content).join("\n") + `\n\n${prompt}`
            },
        });

        let artifactProcessor = new ArtifactProcessor(
            "", 
            (filePath, fileContent) => onFileUpdate(filePath, fileContent, projectId, promptDb.id), 
            (shellCommand) => onShellCommand(shellCommand, projectId, promptDb.id),
            (description) => onDescription(description, projectId, promptDb.id),
        )

        onPromptStart();
        for await (const chunk of response) {
            const data = chunk.text;
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