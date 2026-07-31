import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";

export const authorizeRoles = (...allowedRoles: Array<"Admin" | "Agent" | "Customer">) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required." });
        }

        if (!allowedRoles.includes(req.user.role as any)) {
            return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
        }

        next();
    };
};
