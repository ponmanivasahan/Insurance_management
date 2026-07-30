import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import prisma from "../config/db";

export const logActivity = (activityDescription: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        // Run controller logic first
        res.on("finish", async () => {
            try {
                if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
                    await prisma.activityLog.create({
                        data: {
                            userId: req.user.userId,
                            activity: activityDescription,
                            ipAddress: req.ip || "127.0.0.1",
                            device: req.headers["user-agent"] || "Unknown Device",
                        },
                    });
                }
            } catch (err) {
                console.error("Failed to write activity log:", err);
            }
        });
        next();
    };
};
