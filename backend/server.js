import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import helmet from "helmet";
import errorMiddleware from "./middleware/errorMiddleware.js";
import arcjetMiddleware from "./middleware/arcjetMiddleware.js";
import { PORT, NODE_ENV, FRONTEND_URLS } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminResourceRoutes from "./routes/adminResourceRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminAuthorRoutes from "./routes/adminAuthorRoutes.js";
import adminSubscriptionRoutes from "./routes/adminSubscriptionRoutes.js";
import adminManagementRoutes from "./routes/adminManagementRoutes.js";
import adminInstitutionRoutes from "./routes/adminInstitutionRoutes.js";
import adminUserSubscriptionRoutes from "./routes/adminUserSubscriptionRoutes.js";

// Import routes

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration with multiple origins
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
// app.use(arcjetMiddleware);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Digital Library API",
    environment: NODE_ENV,
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/admin/resources", adminResourceRoutes);
app.use("/api/v1/admin/categories", adminCategoryRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/admin/authors", adminAuthorRoutes);
app.use("/api/v1/admin/subscriptions", adminSubscriptionRoutes);
app.use("/api/v1/admin/admins", adminManagementRoutes);
app.use("/api/v1/admin/institutions", adminInstitutionRoutes);
app.use("/api/v1/admin/user-subscriptions", adminUserSubscriptionRoutes);
// Error handling
app.use(errorMiddleware);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

server.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});
