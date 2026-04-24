import { Router } from "express";
import { createRating, listStoresForUser, updateRating } from "../controllers/userController.js";
import { allowRoles, requireAuth } from "../middlewares/auth.js";

const router = Router();

router.use(requireAuth, allowRoles("USER"));
router.get("/stores", listStoresForUser);
router.post("/ratings", createRating);
router.put("/ratings/:id", updateRating);

export default router;
