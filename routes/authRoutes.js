import express from "express";
import { loginUser, registerUser, updateUserProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/updateProfile", protect, updateUserProfile)

export default router;