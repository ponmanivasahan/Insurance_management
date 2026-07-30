import { Request, Response } from "express";
import prisma from "../config/db";

export const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        const totalCustomers = await prisma.customer.count();
        const totalPolicies = await prisma.policy.count();
        
        const activePolicies = await prisma.policy.count({ where: { status: "Active" } });
        const expiredPolicies = await prisma.policy.count({ where: { status: "Expired" } });

        const pendingClaims = await prisma.claim.count({ where: { claimStatus: "Pending" } });
        const approvedClaims = await prisma.claim.count({ where: { claimStatus: "Approved" } });
        const rejectedClaims = await prisma.claim.count({ where: { claimStatus: "Rejected" } });

        const totalPremium = await prisma.premiumPayment.aggregate({
            _sum: { amount: true },
            where: { paymentStatus: "Paid" },
        });

        // Recent activity
        const recentActivities = await prisma.activityLog.findMany({
            take: 5,
            orderBy: { id: "desc" },
            include: { user: { select: { name: true, email: true } } },
        });

        // Recent payments
        const recentPayments = await prisma.premiumPayment.findMany({
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
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getFinancialReport = async (req: Request, res: Response) => {
    try {
        const payments = await prisma.premiumPayment.findMany({
            where: { paymentStatus: "Paid" },
            select: { amount: true, paymentDate: true },
        });

        return res.status(200).json({
            payments,
            description: "Premium receipts data collection",
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
