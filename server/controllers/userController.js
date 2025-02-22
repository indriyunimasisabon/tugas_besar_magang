import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import asyncHandler from "../middleware/asyncHandler.js";

export const getAllUser = asyncHandler(async (req, res) => {

    const [listuser, totaluser] = await Promise.all([
        User.findAll({
            attributes: ["id", "name", "email", "role", "phone", "address", "departement"],
        }),
        User.count(),
    ]);

    if (!listuser) {
        return res.status(404).json({
            status: "error",
            msg: "Users not found",
        });
    }

    res.status(200).json({
        status: "success",
        msg: "User data retrieved successfully",
        totaluser: totaluser,
        data: listuser,
    });
});

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByPk(id, {
        attributes: ["id", "name", "email", "role", "phone", "address", "departement"]
    });

    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json({
        status: "success",
        msg: "User data retrieved successfully",
        data: user
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const loggedInUser = req.user;

    const user = await User.findByPk(userId);

    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    const { name, email, phone, address, departement, password } = req.body;
    let hashedPassword = user.password;

    if (password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ msg: "Password harus minimal 6 karakter, mengandung huruf dan angka" });
        }
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
    }

    if (req.body.role !== undefined && loggedInUser.role !== 1) {
        return res.status(403).json({ msg: "You are not allowed to change role" });
    }

    await user.update(req.body);

    res.status(200).json({
        msg: "Profile updated successfully",
        data: user
    });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const loggedInUser = req.user;

    const user = await User.findByPk(id);

    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    if (loggedInUser.role !== 1) {
        return res.status(403).json({ msg: "You are not allowed to delete user" });
    }

    await user.destroy();

    res.status(200).json({ msg: "User deleted successfully" });
});