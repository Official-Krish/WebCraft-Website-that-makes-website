import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from './utils/Prompt';
import { ArtifactProcessor } from './utils/parser';
import { onFileUpdate, onPromptEnd, onPromptStart, onShellCommand } from './utils/os';

const app = express();
app.use(express.json());
app.use(cors());;


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        maxOutputTokens: 8000,
        temperature: 0.7,
    }, 
    systemInstruction: getSystemPrompt() 
});

app.post("/api/v1/AI/chat", async (req, res) => {
    try {
        // Ensure the prompt is a string
        let userPrompt = req.body.prompt || ""; 
        if (typeof userPrompt !== "string") {
            userPrompt = JSON.stringify(userPrompt, null, 2);
        }

        // Combine user prompt with system prompt
        // const prompt = `${userPrompt}`.trim();

        const prompt = userPrompt;

        // Generate content
        const response = await model.generateContentStream(`${prompt} give me proper code`);

        let artifactProcessor = new ArtifactProcessor("", (filePath, fileContent) => onFileUpdate(filePath, fileContent), (shellCommand) => onShellCommand(shellCommand));

        onPromptStart();
        for await (const chunk of response.stream) {
            const chunkText = chunk.text;
            console.log(chunkText());
            artifactProcessor.append(chunkText());
            artifactProcessor.parse();
        }
        onPromptEnd();

        // Send the response back to the client
        res.status(200).json({ message: "Content generated successfully." });
    } catch (error) {
        console.error("Error in /chat route:", error);

        // Respond with a meaningful error message
        res.status(500).json({ error: "An error occurred while generating content." });
    }
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});