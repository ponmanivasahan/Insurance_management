"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPayments = exports.recordPayment = void 0;
const db_1 = __importDefault(require("../config/db"));
const recordPayment = async (req, res) => {
    try {
        const { policyId, amount, paymentMethod, transactionId, dueDate } = req.body;
        if (!policyId || !amount || !paymentMethod || !transactionId) {
            return res.status(400).json({ message: "Required fields missing." });
        }
        const payment = await db_1.default.premiumPayment.create({
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
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.recordPayment = recordPayment;
const getAllPayments = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const where = {};
        if (search) {
            where.OR = [
                { transactionId: { contains: String(search) } },
                { policy: { policyNumber: { contains: String(search) } } },
            ];
        }
        const payments = await db_1.default.premiumPayment.findMany({
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
        const total = await db_1.default.premiumPayment.count({ where });
        return res.status(200).json({
            payments,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getAllPayments = getAllPayments;
