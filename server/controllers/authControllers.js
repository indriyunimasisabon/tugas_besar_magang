import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const RegisterUser = async (req, res) => {
    const { name, email, password, } = req.body;


    if (!name || !email || !password) {
        return res.status(400).json({ message: "Semua field harus diisi" });
    }

    try {
        // Cek apakah email sudah digunakan
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }

        // Buat user baru (hashing dilakukan otomatis di model)
        const user = await User.create({
            name,
            email,
            password,
        });

        return res.status(201).json({ message: "Registrasi berhasil", userId: user.id });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors.map((err) => err.message),
            });
        }
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};