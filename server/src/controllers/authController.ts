import { Request, Response } from "express";
import prisma from "../config/db";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const hashedPassword = await hashPassword(password);
        const userRole = role === "Admin" ? "Admin" : role === "Agent" ? "Agent" : "Customer";
        
        const user = await prisma.user.create({
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
    } catch (error: any) {
        return res.status(500).json({ message: error.message || "Registration failed." });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        if (user.status === "Suspended") {
            return res.status(403).json({ message: "Your account is suspended. Contact administration." });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message || "Login failed." });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required." });
        }

        const decoded = verifyRefreshToken(refreshToken);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user || user.status === "Suspended") {
            return res.status(403).json({ message: "User suspended or not found." });
        }

        const newAccessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
        const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token." });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User with this email not found." });
        }

        // Standard mock password recovery token flow
        return res.status(200).json({
            message: "Password recovery link dispatched successfully to " + email,
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
