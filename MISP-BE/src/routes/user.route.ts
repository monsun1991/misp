import { Router, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { catchAsync } from "../utils/error.util";

const router = Router();
const controller = new UserController();

router.get(
  "/",
  catchAsync(async (_req: Request, res: Response) => {
    const response = await controller.getUsers();
    res.json(response);
  })
);

router.get(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.getUserById(req.params.id);
    res.json(response);
  })
);

router.post(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.createUser(req.body);
    res.status(201).json(response);
  })
);

router.put(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.updateUser(req.params.id, req.body);
    res.json(response);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const response = await controller.deleteUser(req.params.id);
    res.json(response);
  })
);

export default router;

