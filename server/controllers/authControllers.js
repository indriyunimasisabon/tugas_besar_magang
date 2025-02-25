import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";

export const AddUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Semua field harus diisi" });
    }
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
        return res.status(400).json({ msg: "Email sudah digunakan" });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ msg: "Password harus minimal 6 karakter, mengandung huruf dan angka" });
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            role: role !== undefined ? role : 0
        });
        return res.status(201).json({
            msg: "Registrasi berhasil",
            userId: user.id
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                msg: "Validation error",
                errors: error.errors.map((err) => err.msg),
            });
        }
        return res.status(500).json({ msg: "Terjadi kesalahan", error: error.msg });
    }
});

export const LoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Semua field harus diisi" });
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        return res.status(401).json({ msg: "Email atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ msg: "Email atau password salah" });
    }

    const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
    });


    return res.status(200).json({
        msg: "Login berhasil",
        accessToken,
        user: { id: user.id, name: user.name, email: user.emai, role: user.role }
    });

});

export const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ msg: "Unauthorized" });

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: "Forbidden" });

        const newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES });

        res.json({ accessToken: newAccessToken });
    });
};

export const Logout = (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ msg: "Logout successful" });
};

