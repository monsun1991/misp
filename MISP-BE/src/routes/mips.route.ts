import { Router } from "express";
import { MipsController } from "../controllers/mips.controller";

const router = Router();

// Summary Dashboard
router.get("/summary", MipsController.getSummary);

// Materials Master
router.get("/materials", MipsController.getMaterials);
router.post("/materials", MipsController.createMaterial);
router.put("/materials/:id", MipsController.updateMaterial);
router.delete("/materials/:id", MipsController.deleteMaterial);

// Products Master & BOM
router.get("/products", MipsController.getProducts);
router.post("/products", MipsController.createProduct);
router.put("/products/:id", MipsController.updateProduct);
router.delete("/products/:id", MipsController.deleteProduct);

// Purchase Orders & Inbound
router.get("/purchase-orders", MipsController.getPurchaseOrders);
router.post("/purchase-orders", MipsController.createPurchaseOrder);
router.put("/purchase-orders/:id", MipsController.updatePurchaseOrder);
router.delete("/purchase-orders/:id", MipsController.deletePurchaseOrder);

// Kits & Issuance
router.get("/kits", MipsController.getKits);
router.post("/kits", MipsController.createKit);
router.put("/kits/:id", MipsController.updateKit);
router.delete("/kits/:id", MipsController.deleteKit);

// Users & Workforce (UBAC/RBAC)
router.get("/users", MipsController.getUsers);
router.post("/users", MipsController.createUser);
router.put("/users/:id", MipsController.updateUser);
router.delete("/users/:id", MipsController.deleteUser);

// Customer POs & Outward Dispatches
router.get("/customer-pos", MipsController.getCustomerPOs);
router.post("/customer-pos", MipsController.createCustomerPO);
router.put("/customer-pos/:id", MipsController.updateCustomerPO);
router.get("/outward-dispatches", MipsController.getOutwardDispatches);
router.post("/outward-dispatches", MipsController.createOutwardDispatch);

// Finished Goods Inventory & Ledger
router.get("/finished-goods", MipsController.getFinishedGoods);
router.post("/finished-goods", MipsController.createFinishedGood);
router.put("/finished-goods/:id", MipsController.updateFinishedGood);
router.get("/finished-goods-ledger", MipsController.getFinishedGoodsLedger);
router.post("/finished-goods-ledger", MipsController.createFinishedGoodsLedger);

// Stock Ledgers & Production Logs
router.get("/stock-ledgers", MipsController.getStockLedgers);
router.post("/stock-ledgers", MipsController.createStockLedger);
router.get("/production-logs", MipsController.getProductionLogs);
router.post("/production-logs", MipsController.createProductionLog);
router.put("/production-logs/:id", MipsController.updateProductionLog);
router.delete("/production-logs/:id", MipsController.deleteProductionLog);

// Dynamic Roles
router.get("/roles", MipsController.getRoles);
router.post("/roles", MipsController.createRole);
router.put("/roles/:id", MipsController.updateRole);
router.delete("/roles/:id", MipsController.deleteRole);

// Dynamic Departments
router.get("/departments", MipsController.getDepartments);
router.post("/departments", MipsController.createDepartment);
router.put("/departments/:id", MipsController.updateDepartment);
router.delete("/departments/:id", MipsController.deleteDepartment);

// Dynamic Plants
router.get("/plants", MipsController.getPlants);
router.post("/plants", MipsController.createPlant);
router.put("/plants/:id", MipsController.updatePlant);
router.delete("/plants/:id", MipsController.deletePlant);

// Customers Directory
router.get("/customers", MipsController.getCustomers);
router.post("/customers", MipsController.createCustomer);
router.put("/customers/:id", MipsController.updateCustomer);
router.delete("/customers/:id", MipsController.deleteCustomer);

// Suppliers Master
router.get("/suppliers", MipsController.getSuppliers);
router.post("/suppliers", MipsController.createSupplier);
router.put("/suppliers/:id", MipsController.updateSupplier);
router.delete("/suppliers/:id", MipsController.deleteSupplier);

// Warehouses Master
router.get("/warehouses", MipsController.getWarehouses);
router.post("/warehouses", MipsController.createWarehouse);
router.put("/warehouses/:id", MipsController.updateWarehouse);
router.delete("/warehouses/:id", MipsController.deleteWarehouse);

// GRN Entries
router.get("/grn-entries", MipsController.getGRNEntries);
router.post("/grn-entries", MipsController.createGRNEntry);

// Audit Logs
router.get("/audit-logs", MipsController.getAuditLogs);
router.post("/audit-logs", MipsController.createAuditLog);

export default router;
