import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}.local`
});

export const {
  PORT = 3333,
  NODE_ENV = 'development',
  FRONTEND_URLS = 'http://localhost:3000,http://localhost:5173',
  // Database
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT = 3306,
  
  // JWT
  JWT_SECRET,
  JWT_EXPIRES_IN = '7d',
  
  // Security
  ARCJET_KEY,
  ARCJET_ENV = 'development',
  
  // Server
  SERVER_URL = 'http://localhost:3333',
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env; 