import { Router } from "express";
import AuthRoutes from "./auth.route";
import DashboardRoutes from "./dashboard.route";
import MipsRoutes from "./mips.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/dashboard", DashboardRoutes);
router.use("/mips", MipsRoutes);

export default router;

