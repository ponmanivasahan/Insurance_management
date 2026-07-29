const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createClaim,
    getAllClaims
} = require("../controllers/claimController");

router.post(
    "/",
    verifyToken,
    authorizeRoles("customer", "admin"),
    createClaim
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "agent"),
    getAllClaims
);

module.exports = router;