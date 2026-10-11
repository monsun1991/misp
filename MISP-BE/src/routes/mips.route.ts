import { Router } from "express";
import { MipsController } from "../controllers/mips.controller";

const router = Router();

router.get("/summary", MipsController.getSummary);
router.get("/materials", MipsController.getMaterials);
router.post("/materials", MipsController.createMaterial);
router.get("/products", MipsController.getProducts);
router.post("/products", MipsController.createProduct);
router.get("/purchase-orders", MipsController.getPurchaseOrders);
router.post("/purchase-orders", MipsController.createPurchaseOrder);
router.get("/kits", MipsController.getKits);
router.post("/kits", MipsController.createKit);
router.get("/users", MipsController.getUsers);
router.post("/users", MipsController.createUser);
router.put("/users/:id", MipsController.updateUser);
router.delete("/users/:id", MipsController.deleteUser);

export default router;
