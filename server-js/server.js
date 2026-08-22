import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/userRoutes.js";
import projectRouter from "./src/routes/projectRoutes.js";
import commentRouter from "./src/routes/comment.routes.js";
import adminRouter from "./src/routes/authAdmin.js";
import contactRouter from "./src/routes/contactRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

// Disable Mongoose command buffering to prevent 10s hang on disconnected DB
mongoose.set("bufferCommands", false);

/* -------------------- Startup Guards -------------------- */
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is not set. Server cannot start securely.");
  process.exit(1);
}

/* -------------------- DB Connection -------------------- */
const connectDB = async () => {
  const dbUrl = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/devmorph";
  try {
    await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 2000 });
    console.log("MongoDB connected successfully to:", dbUrl);
  } catch (err) {
    console.warn("Local MongoDB not available. Starting In-Memory MongoDB Server...");
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      await mongoose.connect(memUri);
      console.log("✅ In-Memory MongoDB ready at:", memUri);
    } catch (memErr) {
      console.error("❌ Failed to start in-memory MongoDB:", memErr.message);
    }
  }
};

/* -------------------- Middleware -------------------- */
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  process.env.TRUSTED_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Database connection readiness middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api') && req.path !== '/api/health') {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database is connecting. Please try again in a few seconds."
      });
    }
  }
  next();
});

/* -------------------- API Routes -------------------- */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is Live!",
    dbConnected: mongoose.connection.readyState === 1
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/comment", commentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/contact", contactRouter);

/* -------------------- Start Server after DB connect -------------------- */
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Backend Express server running on port ${port}`);
  });
});
