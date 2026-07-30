import { Router } from "express";
import { getDashboardSummary, getFinancialReport } from "../controllers/reportController";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

router.use(verifyToken);

router.get("/summary", authorizeRoles("Admin", "Agent"), getDashboardSummary);
router.get("/financial", authorizeRoles("Admin"), getFinancialReport);

export default router;
