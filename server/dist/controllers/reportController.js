"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialReport = exports.getDashboardSummary = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDashboardSummary = async (req, res) => {
    try {
        const totalCustomers = await db_1.default.customer.count();
        const totalPolicies = await db_1.default.policy.count();
        const activePolicies = await db_1.default.policy.count({ where: { status: "Active" } });
        const expiredPolicies = await db_1.default.policy.count({ where: { status: "Expired" } });
        const pendingClaims = await db_1.default.claim.count({ where: { claimStatus: "Pending" } });
        const approvedClaims = await db_1.default.claim.count({ where: { claimStatus: "Approved" } });
        const rejectedClaims = await db_1.default.claim.count({ where: { claimStatus: "Rejected" } });
        const totalPremium = await db_1.default.premiumPayment.aggregate({
            _sum: { amount: true },
            where: { paymentStatus: "Paid" },
        });
        // Recent activity
        const recentActivities = await db_1.default.activityLog.findMany({
            take: 5,
            orderBy: { id: "desc" },
            include: { user: { select: { name: true, email: true } } },
        });
        // Recent payments
        const recentPayments = await db_1.default.premiumPayment.findMany({
            take: 5,
            orderBy: { id: "desc" },
            include: { policy: { include: { customer: true } } },
        });
        return res.status(200).json({
            metrics: {
                totalCustomers,
                totalPolicies,
                activePolicies,
                expiredPolicies,
                pendingClaims,
                approvedClaims,
                rejectedClaims,
                premiumCollection: totalPremium._sum.amount || 0,
            },
            recentActivities,
            recentPayments,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getDashboardSummary = getDashboardSummary;
const getFinancialReport = async (req, res) => {
    try {
        const payments = await db_1.default.premiumPayment.findMany({
            where: { paymentStatus: "Paid" },
            select: { amount: true, paymentDate: true },
        });
        return res.status(200).json({
            payments,
            description: "Premium receipts data collection",
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getFinancialReport = getFinancialReport;
