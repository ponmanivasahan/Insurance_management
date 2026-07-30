"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjudicateClaim = exports.getAllClaims = exports.submitClaim = void 0;
const db_1 = __importDefault(require("../config/db"));
const submitClaim = async (req, res) => {
    try {
        const { policyId, claimAmount, claimReason } = req.body;
        if (!policyId || !claimAmount || !claimReason) {
            return res.status(400).json({ message: "Required fields missing." });
        }
        const claimNumber = `CLM-${Math.floor(100000 + Math.random() * 900000)}`;
        const claim = await db_1.default.claim.create({
            data: {
                policyId: Number(policyId),
                claimNumber,
                claimAmount: Number(claimAmount),
                claimReason,
                claimStatus: "Pending",
            },
        });
        return res.status(201).json({ message: "Claim submitted successfully", claim });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.submitClaim = submitClaim;
const getAllClaims = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const where = {};
        if (status) {
            where.claimStatus = status;
        }
        if (search) {
            where.OR = [
                { claimNumber: { contains: String(search) } },
                { claimReason: { contains: String(search) } },
            ];
        }
        const claims = await db_1.default.claim.findMany({
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
        const total = await db_1.default.claim.count({ where });
        return res.status(200).json({
            claims,
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
exports.getAllClaims = getAllClaims;
const adjudicateClaim = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body; // status: Approved or Rejected
        if (status !== "Approved" && status !== "Rejected") {
            return res.status(400).json({ message: "Adjudication status must be Approved or Rejected." });
        }
        const claim = await db_1.default.claim.findUnique({ where: { id: Number(id) } });
        if (!claim) {
            return res.status(404).json({ message: "Claim record not found." });
        }
        const updated = await db_1.default.claim.update({
            where: { id: Number(id) },
            data: {
                claimStatus: status,
                remarks: remarks || "",
                approvedDate: status === "Approved" ? new Date() : null,
            },
        });
        return res.status(200).json({ message: `Claim status changed to ${status}`, claim: updated });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.adjudicateClaim = adjudicateClaim;
