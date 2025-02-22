import express from "express";
import { getAllUser, getUserById, updateProfile, deleteUser } from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/users', getAllUser);
router.get('/user/:id', getUserById);
router.put('/profile/:id', authenticateUser, updateProfile);
router.delete('/deleteUser/:id', authenticateUser, deleteUser);

export default router;