"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const policyController_1 = require("../controllers/policyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const loggerMiddleware_1 = require("../middleware/loggerMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.verifyToken);
// Categories
router.post("/types", (0, roleMiddleware_1.authorizeRoles)("Admin"), (0, loggerMiddleware_1.logActivity)("Created Policy Category"), policyController_1.createPolicyType);
router.get("/types", policyController_1.getPolicyTypes);
// Customer Policies
router.post("/", (0, roleMiddleware_1.authorizeRoles)("Admin", "Agent"), (0, loggerMiddleware_1.logActivity)("Purchased Customer Policy"), policyController_1.createPolicy);
router.get("/", (0, roleMiddleware_1.authorizeRoles)("Admin", "Agent", "Customer"), policyController_1.getAllPolicies);
router.put("/:id/renew", (0, roleMiddleware_1.authorizeRoles)("Admin", "Agent", "Customer"), (0, loggerMiddleware_1.logActivity)("Renewed Customer Policy"), policyController_1.renewPolicy);
router.put("/:id/cancel", (0, roleMiddleware_1.authorizeRoles)("Admin", "Agent", "Customer"), (0, loggerMiddleware_1.logActivity)("Cancelled Customer Policy"), policyController_1.cancelPolicy);
exports.default = router;
