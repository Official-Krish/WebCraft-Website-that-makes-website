require("dotenv").config();
import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/db";
import jwt from "jsonwebtoken";
import { LoginSchema, SignupSchema } from "../types/userSchema";
import axios from "axios";

const userRouter: Router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

userRouter.post("/signup", async ( req,res ) => {
    const parsedData = SignupSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    const { email, password, name } = parsedData.data;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ 
        data: { 
            email,
            password: hashedPassword,
            name: name
        }
    });

    const token = jwt.sign({ userId: user.id, name: name }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie('token', token);
    res.status(200).json({ message: "User created successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})


userRouter.post("/login", async ( req,res ) => {
    const parsedData = LoginSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    const { email, password } = parsedData.data;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await prisma.user.findUnique({ where: {
            email : email
        } 
    });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie('token', token);
    res.status(200).json({ message: "User logged in successfully", token });
})


export default userRouter;
