import express from "express";
import { RegisterUser } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", RegisterUser);

export default router;