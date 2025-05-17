"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_INFO = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load environment variables
dotenv_1.default.config();
// Define configuration schema
const configSchema = zod_1.z.object({
    CAT_API_KEY: zod_1.z.string().min(1, "CAT_API_KEY is required"),
    PORT: zod_1.z.string().transform(val => parseInt(val, 10)).default("3000"),
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
});
// Parse and validate configuration
const parseConfig = () => {
    try {
        return configSchema.parse(process.env);
    }
    catch (error) {
        console.error("Configuration error:", error);
        process.exit(1);
    }
};
// Export configuration
exports.config = parseConfig();
// Export server info
exports.SERVER_INFO = {
    name: "TheCatAPI-MCP-Server",
    version: "1.0.0",
};
