import { Router } from "express";
import Anthropic  from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources";
import { BASE_PROMPT, getSystemPrompt } from "../utils/prompts";
import { basePrompt as reactBasePrompt } from "../defaults/react-base";
import { basePrompt as nodeBasePrompt } from "../defaults/node-base";

const aiRouter = Router();

const anthropic = new Anthropic();

aiRouter.post("/template", async (req, res) => {
    const prompt = req.body.prompt;
    const response = await anthropic.messages.create({
        messages: [{
            role: 'user', content: prompt
        }],
        max_tokens: 200,
        model: "claude-3-5-sonnet-20241022",
        system: "Return either react or node based on what do you think this project should be. Only return a single word response, either react or node. Do not return anything else."
    });
    
    const answer = (response.content[0] as TextBlock).text;

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
        res.status(400).json({ message: "Invalid response" });
        return;
    }
});

aiRouter.post("/chat", async (req, res) => {
    const prompt = req.body.prompt;
    const response = await anthropic.messages.create({
        messages: prompt,
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8000,
        system: getSystemPrompt()
    })

    res.status(200).json({ message: (response.content[0] as TextBlock).text });
});

export default aiRouter;
