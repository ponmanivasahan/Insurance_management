"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.getAllCustomers = exports.addCustomer = void 0;
const db_1 = __importDefault(require("../config/db"));
const addCustomer = async (req, res) => {
    try {
        const { userId, firstName, lastName, gender, dateOfBirth, phone, email, address, city, state, country, postalCode, occupation, nomineeName, nomineeRelation, aadhaarNumber, panNumber, } = req.body;
        if (!userId || !firstName || !lastName || !email || !aadhaarNumber || !panNumber) {
            return res.status(400).json({ message: "Required profile fields missing." });
        }
        const existingCustomer = await db_1.default.customer.findFirst({
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
        const customer = await db_1.default.customer.create({
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
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to create profile." });
    }
};
exports.addCustomer = addCustomer;
const getAllCustomers = async (req, res) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: String(search) } },
                { lastName: { contains: String(search) } },
                { email: { contains: String(search) } },
            ];
        }
        const customers = await db_1.default.customer.findMany({
            where,
            include: { user: true },
            skip,
            take: limitNumber,
            orderBy: { id: "desc" },
        });
        const total = await db_1.default.customer.count({ where });
        return res.status(200).json({
            customers,
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
exports.getAllCustomers = getAllCustomers;
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await db_1.default.customer.findUnique({
            where: { id: Number(id) },
            include: { user: true, policies: true },
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer profile not found." });
        }
        return res.status(200).json(customer);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getCustomerById = getCustomerById;
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        const customer = await db_1.default.customer.update({
            where: { id: Number(id) },
            data,
        });
        return res.status(200).json({ message: "Customer details updated successfully", customer });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Failed to update profile." });
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.default.customer.delete({ where: { id: Number(id) } });
        return res.status(200).json({ message: "Customer profile deleted successfully." });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.deleteCustomer = deleteCustomer;
