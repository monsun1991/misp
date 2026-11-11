import { Router } from "express";
import AuthRoutes from "./auth.route";
import DashboardRoutes from "./dashboard.route";
import MipsRoutes from "./mips.route";
import { authorizeUser } from "../middlewares/auth.middleware";
import { enforceWritePermissions } from "../middlewares/permission.middleware";

const router = Router();

// Login is public; everything else requires a valid session
router.use("/auth", AuthRoutes);
router.use("/dashboard", DashboardRoutes);

// Data API used by the frontend: signed-in users can read, writes are checked against role permissions
router.use("/mips", authorizeUser(), enforceWritePermissions, MipsRoutes);

export default router;
