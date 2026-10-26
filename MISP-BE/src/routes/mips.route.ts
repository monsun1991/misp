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

// Customer POs & Outward Dispatches
router.get("/customer-pos", MipsController.getCustomerPOs);
router.post("/customer-pos", MipsController.createCustomerPO);
router.get("/outward-dispatches", MipsController.getOutwardDispatches);
router.post("/outward-dispatches", MipsController.createOutwardDispatch);

// Finished Goods Inventory
router.get("/finished-goods", MipsController.getFinishedGoods);
router.post("/finished-goods", MipsController.createFinishedGood);

// Stock Ledgers & Production Logs
router.get("/stock-ledgers", MipsController.getStockLedgers);
router.post("/stock-ledgers", MipsController.createStockLedger);
router.get("/production-logs", MipsController.getProductionLogs);
router.post("/production-logs", MipsController.createProductionLog);

export default router;
