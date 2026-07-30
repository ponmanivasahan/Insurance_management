"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.refresh = exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../config/db"));
const auth_1 = require("../utils/auth");
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }
        const existingUser = await db_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const userRole = role === "Admin" ? "Admin" : role === "Agent" ? "Agent" : "Customer";
        const user = await db_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: userRole,
            },
        });
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Registration failed." });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }
        if (user.status === "Suspended") {
            return res.status(403).json({ message: "Your account is suspended. Contact administration." });
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password." });
        }
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, auth_1.generateAccessToken)(payload);
        const refreshToken = (0, auth_1.generateRefreshToken)(payload);
        return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Login failed." });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required." });
        }
        const decoded = (0, auth_1.verifyRefreshToken)(refreshToken);
        const user = await db_1.default.user.findUnique({ where: { id: decoded.userId } });
        if (!user || user.status === "Suspended") {
            return res.status(403).json({ message: "User suspended or not found." });
        }
        const newAccessToken = (0, auth_1.generateAccessToken)({ userId: user.id, email: user.email, role: user.role });
        const newRefreshToken = (0, auth_1.generateRefreshToken)({ userId: user.id, email: user.email, role: user.role });
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token." });
    }
};
exports.refresh = refresh;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User with this email not found." });
        }
        // Standard mock password recovery token flow
        return res.status(200).json({
            message: "Password recovery link dispatched successfully to " + email,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.forgotPassword = forgotPassword;
