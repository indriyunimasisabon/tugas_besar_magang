import express from "express";
import { syncDatabase } from "./models/index.js";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'))
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/', userRoutes)

const startServer = async () => {
    try {
        await syncDatabase();

        const port = process.env.PORT || 5001;

        app.listen(port, () => {
            console.log(`Example app listening on port http://localhost:${port}`);
        })
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
};
startServer();