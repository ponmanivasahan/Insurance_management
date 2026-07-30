import { Router } from "express";
import { getSettings, updateSetting } from "../controllers/settingController";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { logActivity } from "../middleware/loggerMiddleware";

const router = Router();

router.use(verifyToken);

router.get("/", getSettings);
router.post("/", authorizeRoles("Admin"), logActivity("Modified System Setting"), updateSetting);

export default router;
