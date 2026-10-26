import { Router, Request, Response } from "express";
import { OrderController } from "../controllers/order.controller";
import { catchAsync } from "../utils/error.util";

const router = Router();
const controller = new OrderController();

// Customer POs
router.get(
  "/customer-pos",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getCustomerPOs();
    res.json(response);
  })
);

router.post(
  "/customer-pos",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createCustomerPO(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/customer-pos/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateCustomerPO(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/customer-pos/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteCustomerPO(req.params.id);
    res.json(response);
  })
);

// Customers
router.get(
  "/customers",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getCustomers();
    res.json(response);
  })
);

router.post(
  "/customers",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createCustomer(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/customers/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateCustomer(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/customers/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteCustomer(req.params.id);
    res.json(response);
  })
);

// Outward Dispatches
router.get(
  "/outward-dispatches",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getOutwardDispatches();
    res.json(response);
  })
);

router.post(
  "/outward-dispatches",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createOutwardDispatch(req.body);
    res.status(201).json(response);
  })
);

export default router;

