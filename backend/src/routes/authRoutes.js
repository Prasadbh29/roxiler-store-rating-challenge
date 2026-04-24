import { Router } from "express";
import { changePassword, login, register } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/change-password", requireAuth, changePassword);

export default router;
