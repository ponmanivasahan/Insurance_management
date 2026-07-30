import { Router } from "express";
import { recordPayment, getAllPayments } from "../controllers/paymentController";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { logActivity } from "../middleware/loggerMiddleware";

const router = Router();

router.use(verifyToken);

router.post("/", authorizeRoles("Admin", "Agent", "Customer"), logActivity("Submitted Premium Payment"), recordPayment);
router.get("/", authorizeRoles("Admin", "Agent", "Customer"), getAllPayments);

export default router;
