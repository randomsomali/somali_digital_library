import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: `.env`,
});

export const {
  PORT,
  NODE_ENV = "development",
  FRONTEND_URLS = "http://localhost:3000,http://localhost:5173,https://somalilibrary.vercel.app",
  // Database
  MYSQL_HOST = "localhost",
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT = 3306,

  // JWT
  JWT_SECRET,
  JWT_EXPIRES_IN,

  // Security
  ARCJET_KEY,
  ARCJET_ENV = "development",
  // Cloudinary
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;
