import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).json({ message: "Akses ditolak, token tidak tersedia" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Format token salah" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token tidak valid" });
    }
};

export const authenticateUser = async(req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET); // Verifikasi token

        // Cari user di database berdasarkan ID dari token
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user; // Simpan data user ke req.user
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
    }
};