const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    customerReport,
    policyReport,
    claimReport,
    paymentReport
} = require("../controllers/reportController");

router.get(
    "/customers",
    verifyToken,
    authorizeRoles("admin"),
    customerReport
);

router.get(
    "/policies",
    verifyToken,
    authorizeRoles("admin"),
    policyReport
);

router.get(
    "/claims",
    verifyToken,
    authorizeRoles("admin"),
    claimReport
);

router.get(
    "/payments",
    verifyToken,
    authorizeRoles("admin"),
    paymentReport
);

module.exports = router;