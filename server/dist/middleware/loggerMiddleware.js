"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
const db_1 = __importDefault(require("../config/db"));
const logActivity = (activityDescription) => {
    return async (req, res, next) => {
        // Run controller logic first
        res.on("finish", async () => {
            try {
                if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
                    await db_1.default.activityLog.create({
                        data: {
                            userId: req.user.userId,
                            activity: activityDescription,
                            ipAddress: req.ip || "127.0.0.1",
                            device: req.headers["user-agent"] || "Unknown Device",
                        },
                    });
                }
            }
            catch (err) {
                console.error("Failed to write activity log:", err);
            }
        });
        next();
    };
};
exports.logActivity = logActivity;
