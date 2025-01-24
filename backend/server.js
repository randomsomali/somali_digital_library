const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const helmet = require("helmet");

require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const resourceRoutes = require("./routes/resourceRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const categoryRoutes = require("./routes/categoryRoutes"); // Import category routes

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3333;
const allowedOrigins = [process.env.FRONTEND_URL_1, process.env.FRONTEND_URL_2];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Routes
app.use("/admins", adminRoutes);
app.use("/users", userRoutes);
app.use("/resources", resourceRoutes);
app.use("/downloads", downloadRoutes);
app.use("/categories", categoryRoutes); // Use category routes

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
