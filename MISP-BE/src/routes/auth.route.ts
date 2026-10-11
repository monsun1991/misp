import express, { Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";
import { catchAsync } from "../utils/error.util";
import { authorizeUser } from "../middlewares/auth.middleware";
import { bodyValidator } from "../middlewares/body-validator.middleware";
import { loginValidator } from "../validations/auth.validation";

const router = express.Router();

// Login
router.post(
  "/login",
  bodyValidator(loginValidator),
  catchAsync(async (req: Request, res: Response) => {
    let loginPayload = req.body;

    // Support Basic Auth header fallback if needed
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Basic ")) {
      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
      const [email, password] = credentials.split(":");
      if (!loginPayload.email || !loginPayload.password) {
        loginPayload = { ...loginPayload, email, password };
      }
    }

    const controller = new AuthController(req);
    const response = await controller.login(loginPayload);
    res.json(response);
  })
);

// Get Profile
router.get(
  "/profile",
  authorizeUser([]),
  catchAsync(async (req: Request, res: Response) => {
    const controller = new AuthController(req);
    const response = await controller.getProfile();
    res.json(response);
  })
);

export default router;
