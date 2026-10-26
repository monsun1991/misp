import { Router, Request, Response } from "express";
import { ProductController } from "../controllers/product.controller";
import { catchAsync } from "../utils/error.util";

const router = Router();
const controller = new ProductController();

router.get(
  "/",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getProducts();
    res.json(response);
  })
);

router.post(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createProduct(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateProduct(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteProduct(req.params.id);
    res.json(response);
  })
);

export default router;
