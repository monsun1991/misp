import { Router, Request, Response } from "express";
import { ProductionController } from "../controllers/production.controller";
import { catchAsync } from "../utils/error.util";

const router = Router();
const controller = new ProductionController();

// Kits
router.get(
  "/kits",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getKits();
    res.json(response);
  })
);

router.post(
  "/kits",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createKit(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/kits/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateKit(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/kits/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteKit(req.params.id);
    res.json(response);
  })
);

// Production Logs
router.get(
  "/production-logs",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getProductionLogs();
    res.json(response);
  })
);

router.post(
  "/production-logs",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createProductionLog(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/production-logs/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateProductionLog(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/production-logs/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteProductionLog(req.params.id);
    res.json(response);
  })
);

// Finished Goods
router.get(
  "/finished-goods",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getFinishedGoods();
    res.json(response);
  })
);

router.post(
  "/finished-goods",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createFinishedGood(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/finished-goods/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateFinishedGood(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/finished-goods/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteFinishedGood(req.params.id);
    res.json(response);
  })
);

// Finished Goods Ledger
router.get(
  "/finished-goods-ledger",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getFinishedGoodsLedger();
    res.json(response);
  })
);

router.post(
  "/finished-goods-ledger",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createFinishedGoodsLedger(req.body);
    res.status(201).json(response);
  })
);

export default router;

