import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import executeRoutes from "./routes/executeRoutes.js"
import executionRoutes from "./routes/executionRoutes.js";

dotenv.config();

const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/codes", codeRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/execution", executionRoutes);
app.get("/api/health", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();