"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Routes imports
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const policyRoutes_1 = __importDefault(require("./routes/policyRoutes"));
const claimRoutes_1 = __importDefault(require("./routes/claimRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const settingRoutes_1 = __importDefault(require("./routes/settingRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const app = (0, express_1.default)();
// Security and utility middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// API endpoint mappings
app.use("/api/auth", authRoutes_1.default);
app.use("/api/customers", customerRoutes_1.default);
app.use("/api/policies", policyRoutes_1.default);
app.use("/api/claims", claimRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.use("/api/settings", settingRoutes_1.default);
app.use("/api/reports", reportRoutes_1.default);
app.get("/", (req, res) => {
    res.status(200).json({ message: "Insurance Management Enterprise API is active." });
});
// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Centralized Server Exception." });
});
exports.default = app;
