import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define configuration schema
const configSchema = z.object({
  CAT_API_KEY: z.string().min(1, "CAT_API_KEY is required"),
  PORT: z.string().transform(val => parseInt(val, 10)).default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Parse and validate configuration
const parseConfig = () => {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    console.error("Configuration error:", error);
    process.exit(1);
  }
};

// Export configuration
export const config = parseConfig();

// Export server info
export const SERVER_INFO = {
  name: "TheCatAPI-MCP-Server",
  version: "1.0.0",
};