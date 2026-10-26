import { Router } from "express";
import AuthRoutes from "./auth.route";
import DashboardRoutes from "./dashboard.route";
import MaterialRoutes from "./material.route";
import ProductRoutes from "./product.route";
import ProcurementRoutes from "./procurement.route";
import ProductionRoutes from "./production.route";
import OrderRoutes from "./order.route";
import AdminRoutes from "./admin.route";
import UserRoutes from "./user.route";
import MipsRoutes from "./mips.route";

const router = Router();

// Modular Enterprise Domain Routes
router.use("/auth", AuthRoutes);
router.use("/dashboard", DashboardRoutes);
router.use("/materials", MaterialRoutes);
router.use("/products", ProductRoutes);
router.use("/procurement", ProcurementRoutes);
router.use("/production", ProductionRoutes);
router.use("/orders", OrderRoutes);
router.use("/admin", AdminRoutes);
router.use("/users", UserRoutes);

// Compatibility Gateway for existing frontend services
router.use("/mips", MipsRoutes);

export default router;
