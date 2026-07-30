import { Router } from "express";
import { addCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } from "../controllers/customerController";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { logActivity } from "../middleware/loggerMiddleware";

const router = Router();

router.use(verifyToken);

router.post("/", authorizeRoles("Admin", "Agent"), logActivity("Created Customer Profile"), addCustomer);
router.get("/", authorizeRoles("Admin", "Agent"), getAllCustomers);
router.get("/:id", authorizeRoles("Admin", "Agent", "Customer"), getCustomerById);
router.put("/:id", authorizeRoles("Admin", "Agent", "Customer"), logActivity("Updated Customer Profile"), updateCustomer);
router.delete("/:id", authorizeRoles("Admin"), logActivity("Deleted Customer Profile"), deleteCustomer);

export default router;
