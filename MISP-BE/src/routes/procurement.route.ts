import { Router, Request, Response } from "express";
import { ProcurementController } from "../controllers/procurement.controller";
import { catchAsync } from "../utils/error.util";

const router = Router();
const controller = new ProcurementController();

// Purchase Orders
router.get(
  "/purchase-orders",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getPurchaseOrders();
    res.json(response);
  })
);

router.post(
  "/purchase-orders",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createPurchaseOrder(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/purchase-orders/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updatePurchaseOrder(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/purchase-orders/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deletePurchaseOrder(req.params.id);
    res.json(response);
  })
);

// Suppliers
router.get(
  "/suppliers",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getSuppliers();
    res.json(response);
  })
);

router.post(
  "/suppliers",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createSupplier(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/suppliers/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateSupplier(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/suppliers/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteSupplier(req.params.id);
    res.json(response);
  })
);

// GRN Entries
router.get(
  "/grn-entries",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getGRNEntries();
    res.json(response);
  })
);

router.post(
  "/grn-entries",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createGRNEntry(req.body);
    res.status(201).json(response);
  })
);

export default router;

