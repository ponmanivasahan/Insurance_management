import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Routes imports
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import policyRoutes from "./routes/policyRoutes";
import claimRoutes from "./routes/claimRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import settingRoutes from "./routes/settingRoutes";
import reportRoutes from "./routes/reportRoutes";

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API endpoint mappings
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Insurance Management Enterprise API is active." });
});

// Centralized error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Centralized Server Exception." });
});

export default app;
