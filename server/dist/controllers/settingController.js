"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSetting = exports.getSettings = void 0;
const db_1 = __importDefault(require("../config/db"));
const getSettings = async (req, res) => {
    try {
        const settings = await db_1.default.systemSetting.findMany();
        return res.status(200).json(settings);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getSettings = getSettings;
const updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key) {
            return res.status(400).json({ message: "Setting key required." });
        }
        const setting = await db_1.default.systemSetting.upsert({
            where: { settingKey: key },
            update: { settingValue: String(value) },
            create: { settingKey: key, settingValue: String(value) },
        });
        return res.status(200).json({ message: "Setting updated successfully", setting });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateSetting = updateSetting;
