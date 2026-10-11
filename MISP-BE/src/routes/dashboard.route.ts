import express, { Request, Response } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { catchAsync } from "../utils/error.util";
import { authorizeUser } from "../middlewares/auth.middleware";

const router = express.Router();

// Get Overview Dashboard
router.get(
  "/overview",
  authorizeUser([]),
  catchAsync(async (req: Request, res: Response) => {
    const controller = new DashboardController(req);
    const response = await controller.getOverviewData();
    res.json(response);
  })
);

export default router;
