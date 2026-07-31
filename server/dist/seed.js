"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Start seeding...");
    // Clean existing records
    await prisma.activityLog.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.claim.deleteMany({});
    await prisma.premiumPayment.deleteMany({});
    await prisma.policy.deleteMany({});
    await prisma.policyType.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.systemSetting.deleteMany({});
    // Hash passwords
    const adminPassword = await bcryptjs_1.default.hash("admin123", 10);
    const agentPassword = await bcryptjs_1.default.hash("agent123", 10);
    const customerPassword = await bcryptjs_1.default.hash("customer123", 10);
    // Create default Users
    const admin = await prisma.user.create({
        data: {
            name: "Marcus Vance",
            email: "admin@insureflow.com",
            password: adminPassword,
            role: "Admin",
            status: "Active",
        },
    });
    const agent = await prisma.user.create({
        data: {
            name: "Sarah Jenkins",
            email: "agent@insureflow.com",
            password: agentPassword,
            role: "Agent",
            status: "Active",
        },
    });
    const customerUser = await prisma.user.create({
        data: {
            name: "Amir Al-Otaibi",
            email: "customer@gmail.com",
            password: customerPassword,
            role: "Customer",
            status: "Active",
        },
    });
    console.log("Users seeded successfully.");
    // Create Customer profile
    const customer = await prisma.customer.create({
        data: {
            userId: customerUser.id,
            firstName: "Amir",
            lastName: "Al-Otaibi",
            gender: "Male",
            dateOfBirth: new Date("1992-05-10"),
            phone: "+91 9876543210",
            email: "customer@gmail.com",
            address: "456 Main Rd, Tech Hub",
            city: "Gujarat",
            state: "Gujarat",
            country: "India",
            postalCode: "380001",
            occupation: "Developer",
            nomineeName: "Fatima Al-Otaibi",
            nomineeRelation: "Spouse",
            aadhaarNumber: "1234-5678-9012",
            panNumber: "ABCDE1234F",
        },
    });
    console.log("Customer profile seeded.");
    // Create Policy Types
    const autoType = await prisma.policyType.create({
        data: {
            policyName: "Auto Premium Coverage",
            description: "Full liability auto collision damage pool policy",
            coverage: "Comprehensive collision, fire, theft, third-party",
            premiumBase: 124,
            duration: 12,
        },
    });
    const lifeType = await prisma.policyType.create({
        data: {
            policyName: "Term Life Protection",
            description: "Term life coverage with flat rate benefits",
            coverage: "Accidental benefits, death claims, critical health bonus",
            premiumBase: 340,
            duration: 120,
        },
    });
    const healthType = await prisma.policyType.create({
        data: {
            policyName: "Health Premium Care",
            description: "Hospitalization medical bills reimbursement pool",
            coverage: "OPD coverage, critical care bills, surgery buffer",
            premiumBase: 210,
            duration: 24,
        },
    });
    console.log("Policy Types seeded.");
    // Create Customer Policy
    const policy = await prisma.policy.create({
        data: {
            customerId: customer.id,
            policyTypeId: autoType.id,
            policyNumber: "POL-9824-A",
            premiumAmount: 124,
            coverageAmount: 250000,
            startDate: new Date("2024-01-12"),
            endDate: new Date("2025-01-12"),
            paymentFrequency: "Monthly",
            status: "Active",
        },
    });
    console.log("Policy seeded.");
    // Record Premium Payment
    await prisma.premiumPayment.create({
        data: {
            policyId: policy.id,
            amount: 124,
            paymentMethod: "UPI",
            transactionId: "TXN-9824-A-1",
            paymentStatus: "Paid",
            paymentDate: new Date("2024-01-12"),
            dueDate: new Date("2024-02-12"),
        },
    });
    console.log("Premium Payment seeded.");
    // Create Claims
    await prisma.claim.create({
        data: {
            policyId: policy.id,
            claimNumber: "CLM-9824-A-1",
            claimAmount: 18450,
            claimReason: "Auto collision damage on front bumper",
            claimStatus: "Pending",
            submissionDate: new Date(),
        },
    });
    console.log("Claims seeded.");
    // Create System Settings
    await prisma.systemSetting.createMany({
        data: [
            { settingKey: "company_name", settingValue: "InsureFlow Platform Inc." },
            { settingKey: "ops_email", settingValue: "ops@insureflow-platform.com" },
            { settingKey: "mfa_enforced", settingValue: "true" },
            { settingKey: "underwriting_buffer", settingValue: "15" },
        ],
    });
    console.log("System Settings seeded.");
    console.log("Seeding finished successfully.");
}
main()
    .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
