import { Router } from "express";
import { submitClaim, getAllClaims, adjudicateClaim } from "../controllers/claimController";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { logActivity } from "../middleware/loggerMiddleware";

const router = Router();

router.use(verifyToken);

router.post("/", authorizeRoles("Admin", "Agent", "Customer"), logActivity("Submitted Claim Request"), submitClaim);
router.get("/", authorizeRoles("Admin", "Agent", "Customer"), getAllClaims);
router.put("/:id/adjudicate", authorizeRoles("Admin", "Agent"), logActivity("Processed Claim Adjudication"), adjudicateClaim);

export default router;
