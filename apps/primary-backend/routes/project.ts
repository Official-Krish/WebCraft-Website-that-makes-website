import { Router } from "express";
import { authMiddleware } from "../utils/middleware";
import prisma from "@repo/db/client";

const projectRouter: Router = Router();

projectRouter.post("/create", authMiddleware, async (req, res) => {
    const { prompt } = req.body;
    const userId  = req.userId!; 
    if (!prompt || prompt.length === 0) {
        res.status(400).json({ error: "Prompt is required" });
        return;
    }
    try {
        const description = prompt.split("\n").slice(0, 3).join("\n");
        const project = await await prisma.project.create({
            data: {
                description,
                userId
            }
        })
        res.status(200).json({ projectId: project.id });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

projectRouter.get("/projects", authMiddleware, async (req, res) => {
    const userId  = req.userId!;
    try {
        const projects = await prisma.project.findMany({
            where: {
                userId
            }
        })
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

projectRouter.get("/:projectId", authMiddleware, async (req, res) => {
    const projectId = req.params.projectId;
    if (!projectId) {
        res.status(400).json({ error: "Project ID is required" });
        return;
    }
    try {
        const project = await prisma.prompt.findMany({
            where: {
                projectId: projectId
            },
            include: {
                actions: true
            }
        })
        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

projectRouter.delete("/:projectId", authMiddleware, async (req, res) => {
    const projectId = req.params.projectId;
    if (!projectId) {
        res.status(400).json({ error: "Project ID is required" });
        return;
    }
    try {
        await prisma.project.delete({
            where: {
                id: projectId
            }
        });
        await prisma.prompt.deleteMany({
            where: {
                projectId: projectId
            }
        });
        await prisma.action.deleteMany({
            where: {
                projectId: projectId
            }
        });
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default projectRouter;