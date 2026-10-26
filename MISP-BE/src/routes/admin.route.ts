import { Router, Request, Response } from "express";
import { AdminController } from "../controllers/admin.controller";
import { catchAsync } from "../utils/error.util";

const router = Router();
const controller = new AdminController();

// Roles
router.get(
  "/roles",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getRoles();
    res.json(response);
  })
);

router.post(
  "/roles",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createRole(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/roles/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateRole(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/roles/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteRole(req.params.id);
    res.json(response);
  })
);

// Departments
router.get(
  "/departments",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getDepartments();
    res.json(response);
  })
);

router.post(
  "/departments",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createDepartment(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/departments/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateDepartment(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/departments/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteDepartment(req.params.id);
    res.json(response);
  })
);

// Plants
router.get(
  "/plants",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getPlants();
    res.json(response);
  })
);

router.post(
  "/plants",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createPlant(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/plants/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updatePlant(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/plants/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deletePlant(req.params.id);
    res.json(response);
  })
);

// Audit Logs
router.get(
  "/audit-logs",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getAuditLogs();
    res.json(response);
  })
);

router.post(
  "/audit-logs",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createAuditLog(req.body);
    res.status(201).json(response);
  })
);

export default router;
