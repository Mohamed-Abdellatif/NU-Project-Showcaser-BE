import express from "express";
import { completeProfile, login, register, updateProfile } from "../controllers/userController";
import { ensureAuthenticated } from "../middlewares/authGuard";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/complete-profile", ensureAuthenticated, completeProfile);
router.put("/update-profile", ensureAuthenticated, updateProfile);

export default router;
