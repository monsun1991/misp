import { Router, Request, Response } from "express";
import { MaterialController } from "../controllers/material.controller";
import { catchAsync } from "../utils/error.util";

const router = Router();
const controller = new MaterialController();

// Materials
router.get(
  "/",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getMaterials();
    res.json(response);
  })
);

router.post(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createMaterial(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateMaterial(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteMaterial(req.params.id);
    res.json(response);
  })
);

// Stock Ledgers
router.get(
  "/stock-ledgers",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getStockLedgers();
    res.json(response);
  })
);

router.post(
  "/stock-ledgers",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createStockLedger(req.body);
    res.status(201).json(response);
  })
);

// Warehouses
router.get(
  "/warehouses",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getWarehouses();
    res.json(response);
  })
);

router.post(
  "/warehouses",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createWarehouse(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/warehouses/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateWarehouse(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/warehouses/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteWarehouse(req.params.id);
    res.json(response);
  })
);

export default router;
