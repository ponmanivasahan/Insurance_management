import { Request, Response } from "express";
import prisma from "../config/db";

export const getSettings = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.systemSetting.findMany();
        return res.status(200).json(settings);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateSetting = async (req: Request, res: Response) => {
    try {
        const { key, value } = req.body;
        if (!key) {
            return res.status(400).json({ message: "Setting key required." });
        }

        const setting = await prisma.systemSetting.upsert({
            where: { settingKey: key },
            update: { settingValue: String(value) },
            create: { settingKey: key, settingValue: String(value) },
        });

        return res.status(200).json({ message: "Setting updated successfully", setting });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
