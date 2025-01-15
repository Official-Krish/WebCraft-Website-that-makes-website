import { Router } from "express";
import { BASE_PROMPT, getSystemPrompt } from "../utils/prompts";
import { basePrompt as reactBasePrompt } from "../defaults/react-base";
import { basePrompt as nodeBasePrompt } from "../defaults/node-base";
import { GoogleGenerativeAI } from "@google/generative-ai";

const aiRouter = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

aiRouter.post("/template", async (req, res) => {
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
    answer = answer.trim();

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

aiRouter.post("/chat", async (req, res) => {
    const userPrompt = req.body.prompt || ""; // Ensure prompt is not undefined
    const prompt = `${userPrompt} ${getSystemPrompt()}`.trim();
    console.log(prompt)
    const response = await model.generateContent(prompt);
    console.log(response.response.text)

    res.status(200).json({ message: response.response.text });
});

export default aiRouter;
