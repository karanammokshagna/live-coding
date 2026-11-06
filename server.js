import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);

app.use((err, req, res, next) => {
  if (err instanceof Error) {
    const status = err.name === "MulterError" ? 400 : 400;
    return res.status(status).json({ message: err.message });
  }
  next();
});

const port = process.env.PORT || 5000;
await connectDB();
app.listen(port, () => console.log(`API running at http://localhost:${port}`));
