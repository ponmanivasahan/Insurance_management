"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelPolicy = exports.renewPolicy = exports.getAllPolicies = exports.createPolicy = exports.getPolicyTypes = exports.createPolicyType = void 0;
const db_1 = __importDefault(require("../config/db"));
// Policy Types
const createPolicyType = async (req, res) => {
    try {
        const { policyName, description, coverage, premiumBase, duration } = req.body;
        if (!policyName || !premiumBase || !duration) {
            return res.status(400).json({ message: "Required fields missing." });
        }
        const policyType = await db_1.default.policyType.create({
            data: {
                policyName,
                description,
                coverage,
                premiumBase: Number(premiumBase),
                duration: Number(duration),
            },
        });
        return res.status(201).json({ message: "Policy category created successfully", policyType });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createPolicyType = createPolicyType;
const getPolicyTypes = async (req, res) => {
    try {
        const policyTypes = await db_1.default.policyType.findMany({
            where: { status: "Active" },
        });
        return res.status(200).json(policyTypes);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getPolicyTypes = getPolicyTypes;
// Customer Policies
const createPolicy = async (req, res) => {
    try {
        const { customerId, policyTypeId, premiumAmount, coverageAmount, startDate, paymentFrequency } = req.body;
        if (!customerId || !policyTypeId || !premiumAmount || !coverageAmount) {
            return res.status(400).json({ message: "Required policy creation arguments missing." });
        }
        // Get duration from policy type
        const policyType = await db_1.default.policyType.findUnique({ where: { id: Number(policyTypeId) } });
        if (!policyType) {
            return res.status(404).json({ message: "Selected policy category not found." });
        }
        const start = startDate ? new Date(startDate) : new Date();
        const end = new Date(start);
        end.setMonth(end.getMonth() + policyType.duration);
        const policyNumber = `POL-${Math.floor(100000 + Math.random() * 900000)}`;
        const policy = await db_1.default.policy.create({
            data: {
                customerId: Number(customerId),
                policyTypeId: Number(policyTypeId),
                policyNumber,
                premiumAmount: Number(premiumAmount),
                coverageAmount: Number(coverageAmount),
                startDate: start,
                endDate: end,
                paymentFrequency,
                status: "Active",
            },
        });
        return res.status(201).json({ message: "Customer policy created successfully", policy });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createPolicy = createPolicy;
const getAllPolicies = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const where = {};
        if (status) {
            where.status = String(status);
        }
        if (search) {
            where.OR = [
                { policyNumber: { contains: String(search) } },
                { customer: { firstName: { contains: String(search) } } },
                { customer: { lastName: { contains: String(search) } } },
            ];
        }
        const policies = await db_1.default.policy.findMany({
            where,
            include: { customer: true, policyType: true },
            skip,
            take: limitNumber,
            orderBy: { id: "desc" },
        });
        const total = await db_1.default.policy.count({ where });
        return res.status(200).json({
            policies,
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
exports.getAllPolicies = getAllPolicies;
const renewPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await db_1.default.policy.findUnique({
            where: { id: Number(id) },
            include: { policyType: true },
        });
        if (!policy) {
            return res.status(404).json({ message: "Policy record not found." });
        }
        const currentEnd = new Date(policy.endDate);
        const newEnd = new Date(currentEnd);
        newEnd.setMonth(newEnd.getMonth() + policy.policyType.duration);
        const updated = await db_1.default.policy.update({
            where: { id: Number(id) },
            data: {
                endDate: newEnd,
                status: "Active",
            },
        });
        return res.status(200).json({ message: "Policy renewed successfully.", policy: updated });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.renewPolicy = renewPolicy;
const cancelPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await db_1.default.policy.update({
            where: { id: Number(id) },
            data: { status: "Cancelled" },
        });
        return res.status(200).json({ message: "Policy cancelled successfully.", policy: updated });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.cancelPolicy = cancelPolicy;
