import { Request, Response } from "express";
import prisma from "../config/db";

export const submitClaim = async (req: Request, res: Response) => {
    try {
        const { policyId, claimAmount, claimReason } = req.body;
        if (!policyId || !claimAmount || !claimReason) {
            return res.status(400).json({ message: "Required fields missing." });
        }

        const claimNumber = `CLM-${Math.floor(100000 + Math.random() * 900000)}`;

        const claim = await prisma.claim.create({
            data: {
                policyId: Number(policyId),
                claimNumber,
                claimAmount: Number(claimAmount),
                claimReason,
                claimStatus: "Pending",
            },
        });

        return res.status(201).json({ message: "Claim submitted successfully", claim });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllClaims = async (req: Request, res: Response) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const where: any = {};
        if (status) {
            where.claimStatus = status as any;
        }
        if (search) {
            where.OR = [
                { claimNumber: { contains: String(search) } },
                { claimReason: { contains: String(search) } },
            ];
        }

        const claims = await prisma.claim.findMany({
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

        const total = await prisma.claim.count({ where });

        return res.status(200).json({
            claims,
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

export const adjudicateClaim = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body; // status: Approved or Rejected

        if (status !== "Approved" && status !== "Rejected") {
            return res.status(400).json({ message: "Adjudication status must be Approved or Rejected." });
        }

        const claim = await prisma.claim.findUnique({ where: { id: Number(id) } });
        if (!claim) {
            return res.status(404).json({ message: "Claim record not found." });
        }

        const updated = await prisma.claim.update({
            where: { id: Number(id) },
            data: {
                claimStatus: status,
                remarks: remarks || "",
                approvedDate: status === "Approved" ? new Date() : null,
            },
        });

        return res.status(200).json({ message: `Claim status changed to ${status}`, claim: updated });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
