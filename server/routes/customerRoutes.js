const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
    addCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} = require("../controllers/customerController");
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin", "agent"),
    addCustomer
);
router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "agent"),
    getAllCustomers
);
router.get(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "agent"),
    getCustomerById
);
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "agent"),
    updateCustomer
);
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    deleteCustomer
);

module.exports = router;