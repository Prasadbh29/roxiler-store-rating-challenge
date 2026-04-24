import { Router } from "express";
import { ownerDashboard } from "../controllers/ownerController.js";
import { allowRoles, requireAuth } from "../middlewares/auth.js";

const router = Router();

router.use(requireAuth, allowRoles("OWNER"));
router.get("/owner/dashboard", ownerDashboard);

export default router;
