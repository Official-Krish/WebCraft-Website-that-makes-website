import { Router } from "express";
import { BASE_PROMPT, getSystemPrompt } from "../utils/prompts";
import { basePrompt as reactBasePrompt } from "../defaults/react-base";
import { basePrompt as nodeBasePrompt } from "../defaults/node-base";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authMiddleware } from "../utils/middleware";

const aiRouter: Router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        maxOutputTokens: 8000,
        temperature: 0.7,
    }, 
    systemInstruction: getSystemPrompt() 
});

aiRouter.post("/template", authMiddleware, async (req, res) => {
    const prompt = req.body.prompt + "Return either react or node based on what do you think this project should be. Only return a single word response, either react or node. Do not return anything else.";
    
    // const response = await anthropic.messages.create({
    //     messages: [{
    //         role: 'user', content: prompt
    //     }],
    //     max_tokens: 200,
    //     model: "claude-3-5-sonnet-20241022",
    //     system: "Return either react or node based on what do you think this project should be. Only return a single word response, either react or node. Do not return anything else."
    // });
    const result = await model.generateContent(prompt);
    
    let answer = result.response.text();
    answer = answer.trim().toLowerCase();

    if (answer === "react") {
        res.status(200).json({ 
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        });
        return;
    } else if (answer === "node") {
        res.status(200).json({ 
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        });
        return;
    } else {
        console.log("here");
        res.status(400).json({ message: "Invalid response" });
        return;
    }
});

export default aiRouter;
