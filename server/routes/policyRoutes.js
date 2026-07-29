const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { addPolicy } = require("../controllers/policyController");

router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    addPolicy
);

module.exports = router;