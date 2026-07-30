import { Router } from "express";
import { createPolicyType, getPolicyTypes, createPolicy, getAllPolicies, renewPolicy, cancelPolicy } from "../controllers/policyController";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { logActivity } from "../middleware/loggerMiddleware";

const router = Router();

router.use(verifyToken);

// Categories
router.post("/types", authorizeRoles("Admin"), logActivity("Created Policy Category"), createPolicyType);
router.get("/types", getPolicyTypes);

// Customer Policies
router.post("/", authorizeRoles("Admin", "Agent"), logActivity("Purchased Customer Policy"), createPolicy);
router.get("/", authorizeRoles("Admin", "Agent", "Customer"), getAllPolicies);
router.put("/:id/renew", authorizeRoles("Admin", "Agent", "Customer"), logActivity("Renewed Customer Policy"), renewPolicy);
router.put("/:id/cancel", authorizeRoles("Admin", "Agent", "Customer"), logActivity("Cancelled Customer Policy"), cancelPolicy);

export default router;
