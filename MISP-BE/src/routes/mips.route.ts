import { Router, Request, Response } from "express";
import { MaterialController } from "../controllers/material.controller";
import { ProductController } from "../controllers/product.controller";
import { ProcurementController } from "../controllers/procurement.controller";
import { ProductionController } from "../controllers/production.controller";
import { OrderController } from "../controllers/order.controller";
import { AdminController } from "../controllers/admin.controller";
import { UserController } from "../controllers/user.controller";
import { catchAsync } from "../utils/error.util";
import { ApiResponse } from "../dto/response.dto";
import * as materialRepo from "../repositories/material.repository";
import * as productRepo from "../repositories/product.repository";
import * as procurementRepo from "../repositories/procurement.repository";
import * as productionRepo from "../repositories/production.repository";

const router = Router();

const matCtrl = new MaterialController();
const prodCtrl = new ProductController();
const procCtrl = new ProcurementController();
const prodLogCtrl = new ProductionController();
const orderCtrl = new OrderController();
const adminCtrl = new AdminController();
const userCtrl = new UserController();

// KPI Summary
router.get(
  "/summary",
  catchAsync(async (_req: Request, res: Response) => {
    const [materials, products, kits, pos] = await Promise.all([
      materialRepo.getAllMaterials(),
      productRepo.getAllProducts(),
      productionRepo.getAllKits(),
      procurementRepo.getAllPurchaseOrders(),
    ]);

    const activeKits = kits.filter((k) => k.status === "Issued").length;
    const pendingPOs = pos.filter((p) => p.status === "In Transit").length;
    const inventoryValuation = materials.reduce(
      (sum, m) => sum + Number(m.currentStock || 0) * Number(m.standardCost || 0),
      0
    );

    res.json(
      new ApiResponse(
        true,
        {
          totalMaterials: materials.length,
          totalProducts: products.length,
          activeKits,
          pendingPOs,
          inventoryValuation: Math.round(inventoryValuation),
        },
        "Summary fetched successfully"
      )
    );
  })
);

// Users
router.get("/users", catchAsync(async (_req: Request, res: Response) => res.json(await userCtrl.getUsers())));
router.post("/users", catchAsync(async (req: Request, res: Response) => res.status(201).json(await userCtrl.createUser(req.body))));
router.put("/users/:id", catchAsync(async (req: Request, res: Response) => res.json(await userCtrl.updateUser(req.params.id, req.body))));
router.delete("/users/:id", catchAsync(async (req: Request, res: Response) => res.json(await userCtrl.deleteUser(req.params.id))));

// Materials
router.get("/materials", catchAsync(async (_req: Request, res: Response) => res.json(await matCtrl.getMaterials())));
router.post("/materials", catchAsync(async (req: Request, res: Response) => res.status(201).json(await matCtrl.createMaterial(req.body))));
router.put("/materials/:id", catchAsync(async (req: Request, res: Response) => res.json(await matCtrl.updateMaterial(req.params.id, req.body))));
router.delete("/materials/:id", catchAsync(async (req: Request, res: Response) => res.json(await matCtrl.deleteMaterial(req.params.id))));

// Stock Ledgers
router.get("/stock-ledgers", catchAsync(async (_req: Request, res: Response) => res.json(await matCtrl.getStockLedgers())));
router.post("/stock-ledgers", catchAsync(async (req: Request, res: Response) => res.status(201).json(await matCtrl.createStockLedger(req.body))));

// Warehouses
router.get("/warehouses", catchAsync(async (_req: Request, res: Response) => res.json(await matCtrl.getWarehouses())));
router.post("/warehouses", catchAsync(async (req: Request, res: Response) => res.status(201).json(await matCtrl.createWarehouse(req.body))));
router.put("/warehouses/:id", catchAsync(async (req: Request, res: Response) => res.json(await matCtrl.updateWarehouse(req.params.id, req.body))));
router.delete("/warehouses/:id", catchAsync(async (req: Request, res: Response) => res.json(await matCtrl.deleteWarehouse(req.params.id))));

// Products
router.get("/products", catchAsync(async (_req: Request, res: Response) => res.json(await prodCtrl.getProducts())));
router.post("/products", catchAsync(async (req: Request, res: Response) => res.status(201).json(await prodCtrl.createProduct(req.body))));
router.put("/products/:id", catchAsync(async (req: Request, res: Response) => res.json(await prodCtrl.updateProduct(req.params.id, req.body))));
router.delete("/products/:id", catchAsync(async (req: Request, res: Response) => res.json(await prodCtrl.deleteProduct(req.params.id))));

// Purchase Orders
router.get("/purchase-orders", catchAsync(async (_req: Request, res: Response) => res.json(await procCtrl.getPurchaseOrders())));
router.post("/purchase-orders", catchAsync(async (req: Request, res: Response) => res.status(201).json(await procCtrl.createPurchaseOrder(req.body))));
router.put("/purchase-orders/:id", catchAsync(async (req: Request, res: Response) => res.json(await procCtrl.updatePurchaseOrder(req.params.id, req.body))));
router.delete("/purchase-orders/:id", catchAsync(async (req: Request, res: Response) => res.json(await procCtrl.deletePurchaseOrder(req.params.id))));

// Suppliers
router.get("/suppliers", catchAsync(async (_req: Request, res: Response) => res.json(await procCtrl.getSuppliers())));
router.post("/suppliers", catchAsync(async (req: Request, res: Response) => res.status(201).json(await procCtrl.createSupplier(req.body))));
router.put("/suppliers/:id", catchAsync(async (req: Request, res: Response) => res.json(await procCtrl.updateSupplier(req.params.id, req.body))));
router.delete("/suppliers/:id", catchAsync(async (req: Request, res: Response) => res.json(await procCtrl.deleteSupplier(req.params.id))));

// GRN Entries
router.get("/grn-entries", catchAsync(async (_req: Request, res: Response) => res.json(await procCtrl.getGRNEntries())));
router.post("/grn-entries", catchAsync(async (req: Request, res: Response) => res.status(201).json(await procCtrl.createGRNEntry(req.body))));

// Kits
router.get("/kits", catchAsync(async (_req: Request, res: Response) => res.json(await prodLogCtrl.getKits())));
router.post("/kits", catchAsync(async (req: Request, res: Response) => res.status(201).json(await prodLogCtrl.createKit(req.body))));
router.put("/kits/:id", catchAsync(async (req: Request, res: Response) => res.json(await prodLogCtrl.updateKit(req.params.id, req.body))));
router.delete("/kits/:id", catchAsync(async (req: Request, res: Response) => res.json(await prodLogCtrl.deleteKit(req.params.id))));

// Production Logs
router.get("/production-logs", catchAsync(async (_req: Request, res: Response) => res.json(await prodLogCtrl.getProductionLogs())));
router.post("/production-logs", catchAsync(async (req: Request, res: Response) => res.status(201).json(await prodLogCtrl.createProductionLog(req.body))));
router.put("/production-logs/:id", catchAsync(async (req: Request, res: Response) => res.json(await prodLogCtrl.updateProductionLog(req.params.id, req.body))));
router.delete("/production-logs/:id", catchAsync(async (req: Request, res: Response) => res.json(await prodLogCtrl.deleteProductionLog(req.params.id))));

// Finished Goods
router.get("/finished-goods", catchAsync(async (_req: Request, res: Response) => res.json(await prodLogCtrl.getFinishedGoods())));
router.post("/finished-goods", catchAsync(async (req: Request, res: Response) => res.status(201).json(await prodLogCtrl.createFinishedGood(req.body))));
router.put("/finished-goods/:id", catchAsync(async (req: Request, res: Response) => res.json(await prodLogCtrl.updateFinishedGood(req.params.id, req.body))));
router.delete("/finished-goods/:id", catchAsync(async (req: Request, res: Response) => res.json(await prodLogCtrl.deleteFinishedGood(req.params.id))));

// Finished Goods Ledger
router.get("/finished-goods-ledger", catchAsync(async (_req: Request, res: Response) => res.json(await prodLogCtrl.getFinishedGoodsLedger())));
router.post("/finished-goods-ledger", catchAsync(async (req: Request, res: Response) => res.status(201).json(await prodLogCtrl.createFinishedGoodsLedger(req.body))));

// Customer POs
router.get("/customer-pos", catchAsync(async (_req: Request, res: Response) => res.json(await orderCtrl.getCustomerPOs())));
router.post("/customer-pos", catchAsync(async (req: Request, res: Response) => res.status(201).json(await orderCtrl.createCustomerPO(req.body))));
router.put("/customer-pos/:id", catchAsync(async (req: Request, res: Response) => res.json(await orderCtrl.updateCustomerPO(req.params.id, req.body))));
router.delete("/customer-pos/:id", catchAsync(async (req: Request, res: Response) => res.json(await orderCtrl.deleteCustomerPO(req.params.id))));

// Customers
router.get("/customers", catchAsync(async (_req: Request, res: Response) => res.json(await orderCtrl.getCustomers())));
router.post("/customers", catchAsync(async (req: Request, res: Response) => res.status(201).json(await orderCtrl.createCustomer(req.body))));
router.put("/customers/:id", catchAsync(async (req: Request, res: Response) => res.json(await orderCtrl.updateCustomer(req.params.id, req.body))));
router.delete("/customers/:id", catchAsync(async (req: Request, res: Response) => res.json(await orderCtrl.deleteCustomer(req.params.id))));

// Outward Dispatches
router.get("/outward-dispatches", catchAsync(async (_req: Request, res: Response) => res.json(await orderCtrl.getOutwardDispatches())));
router.post("/outward-dispatches", catchAsync(async (req: Request, res: Response) => res.status(201).json(await orderCtrl.createOutwardDispatch(req.body))));

// Roles
router.get("/roles", catchAsync(async (_req: Request, res: Response) => res.json(await adminCtrl.getRoles())));
router.post("/roles", catchAsync(async (req: Request, res: Response) => res.status(201).json(await adminCtrl.createRole(req.body))));
router.put("/roles/:id", catchAsync(async (req: Request, res: Response) => res.json(await adminCtrl.updateRole(req.params.id, req.body))));
router.delete("/roles/:id", catchAsync(async (req: Request, res: Response) => res.json(await adminCtrl.deleteRole(req.params.id))));

// Departments
router.get("/departments", catchAsync(async (_req: Request, res: Response) => res.json(await adminCtrl.getDepartments())));
router.post("/departments", catchAsync(async (req: Request, res: Response) => res.status(201).json(await adminCtrl.createDepartment(req.body))));
router.put("/departments/:id", catchAsync(async (req: Request, res: Response) => res.json(await adminCtrl.updateDepartment(req.params.id, req.body))));
router.delete("/departments/:id", catchAsync(async (req: Request, res: Response) => res.json(await adminCtrl.deleteDepartment(req.params.id))));

// Plants
router.get("/plants", catchAsync(async (_req: Request, res: Response) => res.json(await adminCtrl.getPlants())));
router.post("/plants", catchAsync(async (req: Request, res: Response) => res.status(201).json(await adminCtrl.createPlant(req.body))));
router.put("/plants/:id", catchAsync(async (req: Request, res: Response) => res.json(await adminCtrl.updatePlant(req.params.id, req.body))));
router.delete("/plants/:id", catchAsync(async (req: Request, res: Response) => res.json(await adminCtrl.deletePlant(req.params.id))));

// Audit Logs
router.get("/audit-logs", catchAsync(async (_req: Request, res: Response) => res.json(await adminCtrl.getAuditLogs())));
router.post("/audit-logs", catchAsync(async (req: Request, res: Response) => res.status(201).json(await adminCtrl.createAuditLog(req.body))));

export default router;
