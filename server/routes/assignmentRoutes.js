const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    assignPolicy,
    getAssignedPolicies
} = require("../controllers/assignmentController");

router.post(
    "/",
    verifyToken,
    authorizeRoles("admin", "agent"),
    assignPolicy
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "agent"),
    getAssignedPolicies
);

module.exports = router;