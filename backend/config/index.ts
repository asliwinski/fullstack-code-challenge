import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { NODE_ENV } = process.env;
export const { MONGODB_URI } = process.env;
