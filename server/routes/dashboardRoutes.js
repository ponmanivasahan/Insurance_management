const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { getDashboard } = require("../controllers/dashboardController");

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    getDashboard
);

module.exports = router;