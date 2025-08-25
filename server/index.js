// server/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import connectToMongo from "./db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

const port = process.env.PORT || 5000;
const app = express();

// Enhanced CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.CLIENT_URL || 'https://budgetmanagementsystem.vercel.app',
        'https://budgetmanagementsystem-git-main-your-username.vercel.app', // Replace with your actual git branch URL
        /^https:\/\/budgetmanagementsystem-.*\.vercel\.app$/
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectToMongo();

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/otp", otpRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "IITI Budget Management API is running!", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// For Vercel serverless deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
