import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import runRoutes from "./routes/runRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import inviteCodeRoutes from "./routes/inviteCodeRoutes.js";
import recoveryRoutes from "./routes/recoveryRoutes.js";

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/runs", runRoutes);
app.use("/api/register", registrationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invite", inviteCodeRoutes);
app.use("/api/ai/recovery", recoveryRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});


// Test Route
app.get("/", (req, res) => {
  res.send("IXG Run Club Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
