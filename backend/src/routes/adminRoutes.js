import { Router } from "express";
import {
  createStore,
  createUser,
  getStats,
  getStores,
  getUserDetails,
  getUsers,
} from "../controllers/adminController.js";
import { allowRoles, requireAuth } from "../middlewares/auth.js";

const router = Router();

router.use(requireAuth, allowRoles("ADMIN"));
router.get("/dashboard/stats", getStats);
router.post("/users", createUser);
router.post("/stores", createStore);
router.get("/users", getUsers);
router.get("/stores", getStores);
router.get("/users/:id", getUserDetails);

export default router;
