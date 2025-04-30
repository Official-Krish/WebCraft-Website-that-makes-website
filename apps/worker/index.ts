require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from './utils/Prompt';
import { ArtifactProcessor } from './utils/parser';
import { onFileUpdate, onPromptEnd, onPromptStart, onShellCommand } from './utils/os';
import { authMiddleware } from './middleware';
import prisma from "@repo/db/client";

const app = express();
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: process.env.WEBCRAFT_ORIGIN || "http://localhost:5173"
}));

app.options('*', cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        maxOutputTokens: 8000,
        temperature: 0.7,
    }, 
    systemInstruction: getSystemPrompt() 
});

app.post("/api/v1/AI/chat", authMiddleware, async (req, res) => {
    try {
        // Ensure the prompt is a string
        let userPrompt = req.body.prompt || ""; 
        const projectId = req.body.projectId || ""; 
        if (typeof userPrompt !== "string") {
            userPrompt = JSON.stringify(userPrompt, null, 2);
        }

        const project = await prisma.project.findUnique({
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

        // Generate content
        const response = await model.generateContentStream(
            allPrompts.map((prompt) => prompt.content).join("\n"),
        );

        let artifactProcessor = new ArtifactProcessor("", (filePath, fileContent) => onFileUpdate(filePath, fileContent, projectId, promptDb.id), (shellCommand) => onShellCommand(shellCommand, projectId, promptDb.id));

        onPromptStart();
        let responseText = "";
        for await (const chunk of response.stream) {
            const chunkText = chunk.text;
            responseText += chunkText();
            console.log(chunkText());
            artifactProcessor.append(chunkText());
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