import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        email: string;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    // Debug logs
    console.log("Received token:", token);


    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ["RS256"]
    });

    console.log("Decoded token:", decoded);

    // Extract user ID from the decoded token
    const userId = (decoded as any).payload.sub;

    if (!userId) {
      console.error("No user ID in token payload");
      res.status(403).json({ message: "Invalid token payload" });
      return;
    }


    // Attach the user ID and email to the request
    req.userId = userId;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        message: "Invalid token",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
      return;
    }
    res.status(500).json({
      message: "Error processing authentication",
      details:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
    return;
  }
}