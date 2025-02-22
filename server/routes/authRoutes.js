import express from "express";
import { AddUser, LoginUser, Logout, refreshToken } from "../controllers/authControllers.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", AddUser);
router.post("/login", LoginUser);
router.post("/logout", Logout);
router.post('/refresh-token', refreshToken);

router.get("/profile", authenticateUser, (req, res) => {
    res.json({ message: "Selamat datang di profil!", user: req.user });
});

export default router;