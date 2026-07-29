const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const app = express();
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes")
const policyRoutes = require("./routes/policyRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes");
const claimRoutes = require("./routes/claimRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportRoutes");

app.use(cors());
app.use(express.json())
app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes)
app.use("/api/customers",customerRoutes)
app.use("/api/policies",policyRoutes)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);
app.get("/", (req, res) => {
    res.send("Insurance API Running");
});

module.exports = app;