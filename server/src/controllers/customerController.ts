import { Request, Response } from "express";
import prisma from "../config/db";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const addCustomer = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            userId,
            firstName,
            lastName,
            gender,
            dateOfBirth,
            phone,
            email,
            address,
            city,
            state,
            country,
            postalCode,
            occupation,
            nomineeName,
            nomineeRelation,
            aadhaarNumber,
            panNumber,
        } = req.body;

        if (!userId || !firstName || !lastName || !email || !aadhaarNumber || !panNumber) {
            return res.status(400).json({ message: "Required profile fields missing." });
        }

        const existingCustomer = await prisma.customer.findFirst({
            where: {
                OR: [
                    { email },
                    { aadhaarNumber },
                    { panNumber },
                    { userId },
                ],
            },
        });

        if (existingCustomer) {
            return res.status(400).json({ message: "Customer email, Aadhaar, PAN, or User mapping already exists." });
        }

        const customer = await prisma.customer.create({
            data: {
                userId: Number(userId),
                firstName,
                lastName,
                gender,
                dateOfBirth: new Date(dateOfBirth),
                phone,
                email,
                address,
                city,
                state,
                country,
                postalCode,
                occupation,
                nomineeName,
                nomineeRelation,
                aadhaarNumber,
                panNumber,
            },
        });

        return res.status(201).json({ message: "Customer profile created successfully", customer });
    } catch (error: any) {
        return res.status(500).json({ message: error.message || "Failed to create profile." });
    }
};

export const getAllCustomers = async (req: Request, res: Response) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const where: any = {};
        if (search) {
            where.OR = [
                { firstName: { contains: String(search) } },
                { lastName: { contains: String(search) } },
                { email: { contains: String(search) } },
            ];
        }

        const customers = await prisma.customer.findMany({
            where,
            include: { user: true },
            skip,
            take: limitNumber,
            orderBy: { id: "desc" },
        });

        const total = await prisma.customer.count({ where });

        return res.status(200).json({
            customers,
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

export const getCustomerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const customer = await prisma.customer.findUnique({
            where: { id: Number(id) },
            include: { user: true, policies: true },
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer profile not found." });
        }

        return res.status(200).json(customer);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }

        const customer = await prisma.customer.update({
            where: { id: Number(id) },
            data,
        });

        return res.status(200).json({ message: "Customer details updated successfully", customer });
    } catch (error: any) {
        return res.status(500).json({ message: error.message || "Failed to update profile." });
    }
};

export const deleteCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.customer.delete({ where: { id: Number(id) } });
        return res.status(200).json({ message: "Customer profile deleted successfully." });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
