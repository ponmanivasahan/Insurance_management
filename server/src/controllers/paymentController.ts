import { Request, Response } from "express";
import prisma from "../config/db";

export const recordPayment = async (req: Request, res: Response) => {
    try {
        const { policyId, amount, paymentMethod, transactionId, dueDate } = req.body;
        if (!policyId || !amount || !paymentMethod || !transactionId) {
            return res.status(400).json({ message: "Required fields missing." });
        }

        const payment = await prisma.premiumPayment.create({
            data: {
                policyId: Number(policyId),
                amount: Number(amount),
                paymentMethod,
                transactionId,
                paymentStatus: "Paid",
                dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next month default
            },
        });

        return res.status(201).json({ message: "Premium payment recorded successfully", payment });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const where: any = {};
        if (search) {
            where.OR = [
                { transactionId: { contains: String(search) } },
                { policy: { policyNumber: { contains: String(search) } } },
            ];
        }

        const payments = await prisma.premiumPayment.findMany({
            where,
            include: {
                policy: {
                    include: { customer: true },
                },
            },
            skip,
            take: limitNumber,
            orderBy: { id: "desc" },
        });

        const total = await prisma.premiumPayment.count({ where });

        return res.status(200).json({
            payments,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
