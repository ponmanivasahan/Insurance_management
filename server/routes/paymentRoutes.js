const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    addPayment,
    getPayments
} = require("../controllers/paymentController");

router.post(
    "/",
    verifyToken,
    authorizeRoles("customer", "admin"),
    addPayment
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "agent"),
    getPayments
);

module.exports = router;