import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { MaterialEntity } from "../models/material.model";
import { ProductEntity } from "../models/product.model";
import { PurchaseOrderEntity } from "../models/purchase-order.model";
import { KitEntity } from "../models/kit.model";
import { StockLedgerEntity } from "../models/stock-ledger.model";
import { ProductionLogEntity } from "../models/production-log.model";
import { CustomerPOEntity } from "../models/customer-po.model";
import { OutwardDispatchEntity } from "../models/outward-dispatch.model";
import { FinishedGoodEntity } from "../models/finished-good.model";
import { RoleEntity } from "../models/role.model";
import { DepartmentEntity } from "../models/department.model";
import { PlantEntity } from "../models/plant.model";
import { CustomerEntity } from "../models/customer.model";
import { SupplierEntity } from "../models/supplier.model";
import { WarehouseEntity } from "../models/warehouse.model";
import { GRNEntryEntity } from "../models/grn-entry.model";
import { AuditLogEntity } from "../models/audit-log.model";
import { FinishedGoodsLedgerEntity } from "../models/finished-goods-ledger.model";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { formatUserProfile, computeUserPermissions } from "../utils/rbac.util";

export class MipsController {
  // Summary KPIs for Dashboard
  static async getSummary(_req: Request, res: Response) {
    try {
      const materialRepo = AppDataSource.getRepository(MaterialEntity);
      const productRepo = AppDataSource.getRepository(ProductEntity);
      const kitRepo = AppDataSource.getRepository(KitEntity);
      const poRepo = AppDataSource.getRepository(PurchaseOrderEntity);

      const [totalMaterials, totalProducts, activeKits, pendingPOs] = await Promise.all([
        materialRepo.count(),
        productRepo.count(),
        kitRepo.count({ where: { status: "Issued" } }),
        poRepo.count({ where: { status: "In Transit" } }),
      ]);

      const materials = await materialRepo.find();
      const inventoryValuation = materials.reduce(
        (sum, m) => sum + Number(m.currentStock || 0) * Number(m.standardCost || 0),
        0
      );

      res.status(200).json({
        success: true,
        data: {
          totalMaterials,
          totalProducts,
          activeKits,
          pendingPOs,
          inventoryValuation: Math.round(inventoryValuation),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Materials Master
  static async getMaterials(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(MaterialEntity);
      const materials = await repo.find({ order: { createdAt: "DESC" } });
      res.status(200).json({ success: true, data: materials });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createMaterial(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(MaterialEntity);
      const material = repo.create(req.body);
      const saved = await repo.save(material);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateMaterial(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(MaterialEntity);
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteMaterial(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(MaterialEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Material deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Products Master & BOM
  static async getProducts(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(ProductEntity);
      const products = await repo.find({ order: { createdAt: "DESC" } });
      res.status(200).json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(ProductEntity);
      const product = repo.create(req.body);
      const saved = await repo.save(product);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(ProductEntity);
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(ProductEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Purchase Orders & Inbound
  static async getPurchaseOrders(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(PurchaseOrderEntity);
      const pos = await repo.find({ order: { poDate: "DESC" } });
      res.status(200).json({ success: true, data: pos });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createPurchaseOrder(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(PurchaseOrderEntity);
      const po = repo.create(req.body);
      const saved = await repo.save(po);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updatePurchaseOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(PurchaseOrderEntity);
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deletePurchaseOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(PurchaseOrderEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Purchase Order deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Kits & Issuance
  static async getKits(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(KitEntity);
      const kits = await repo.find({ order: { createdAt: "DESC" } });
      res.status(200).json({ success: true, data: kits });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createKit(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(KitEntity);
      const kit = repo.create(req.body);
      const saved = await repo.save(kit);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateKit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(KitEntity);
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteKit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(KitEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Kit deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Employees & UBAC Users
  static async getUsers(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(User);
      const users = await repo.find({
        order: { createdAt: "DESC" },
      });
      const formatted = users.map(u => ({
        ...formatUserProfile(u),
        permissions: computeUserPermissions(u),
      }));
      res.status(200).json({ success: true, data: formatted });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(User);
      const {
        empCode,
        email,
        password,
        pin,
        fullName,
        phoneNumber,
        role,
        plant,
        warehouse,
        department,
        team,
        workstation,
        supervisor,
        status,
        skills,
        customPermissions,
        revokedPermissions,
        customPermissionsJson,
        revokedPermissionsJson,
      } = req.body;

      const existing = await repo.findOne({ where: { email } });
      if (existing) {
        res.status(400).json({ success: false, message: "Email already registered" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password || "Admin@123", 10);
      const user = repo.create({
        empCode: empCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        email,
        password: hashedPassword,
        pin: pin || "123456",
        fullName: fullName || email.split("@")[0],
        phoneNumber,
        role: role || "Worker",
        plant: plant || "Plant 1 - Pune",
        warehouse: warehouse || "Main Raw Material Store",
        department: department || "Final Assembly Line 1",
        team: team || "Line 1 Alpha",
        workstation,
        supervisor,
        status: status || "Active",
        skills,
        customPermissionsJson: customPermissionsJson || (customPermissions ? JSON.stringify(customPermissions) : undefined),
        revokedPermissionsJson: revokedPermissionsJson || (revokedPermissions ? JSON.stringify(revokedPermissions) : undefined),
      });

      const saved = await repo.save(user);
      res.status(201).json({
        success: true,
        data: {
          ...formatUserProfile(saved),
          permissions: computeUserPermissions(saved),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(User);
      const user = await repo.findOne({ where: { id } });
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      const updates: any = { ...req.body };
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
      if (updates.customPermissions && !updates.customPermissionsJson) {
        updates.customPermissionsJson = JSON.stringify(updates.customPermissions);
      }
      if (updates.revokedPermissions && !updates.revokedPermissionsJson) {
        updates.revokedPermissionsJson = JSON.stringify(updates.revokedPermissions);
      }

      Object.assign(user, updates);
      const saved = await repo.save(user);

      res.status(200).json({
        success: true,
        data: {
          ...formatUserProfile(saved),
          permissions: computeUserPermissions(saved),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(User);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Customer POs
  static async getCustomerPOs(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(CustomerPOEntity);
      const pos = await repo.find({ order: { poDate: "DESC" } });
      const mapped = pos.map((p) => {
        let items = [];
        try {
          if (p.itemsJson) items = JSON.parse(p.itemsJson);
        } catch (e) {}
        return {
          id: p.id,
          customerPoNumber: p.customerPoNumber,
          customerName: p.customerName,
          customerGst: p.customerGst,
          billingCity: p.billingCity,
          poDate: p.poDate,
          expectedDispatchDate: p.expectedDispatchDate,
          totalAmount: Number(p.totalAmount || 0),
          totalOrderedQty: p.totalOrderedQty,
          totalDispatchedQty: p.totalDispatchedQty,
          totalPendingQty: p.totalPendingQty,
          status: p.status,
          uploadedFileName: p.uploadedFileName,
          notes: p.notes,
          plant: p.plant,
          items,
        };
      });
      res.status(200).json({ success: true, data: mapped });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createCustomerPO(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(CustomerPOEntity);
      const body = req.body;
      const po = repo.create({
        customerPoNumber: body.customerPoNumber,
        customerName: body.customerName,
        customerGst: body.customerGst,
        billingCity: body.billingCity || "Pune",
        poDate: body.poDate,
        expectedDispatchDate: body.expectedDispatchDate,
        totalAmount: body.totalAmount || 0,
        totalOrderedQty: body.totalOrderedQty || 0,
        totalDispatchedQty: body.totalDispatchedQty || 0,
        totalPendingQty: body.totalPendingQty || body.totalOrderedQty || 0,
        status: body.status || "New Order",
        uploadedFileName: body.uploadedFileName,
        notes: body.notes,
        plant: body.plant || "Plant 1 - Pune",
        itemsJson: body.items ? JSON.stringify(body.items) : "[]",
      } as Partial<CustomerPOEntity>);
      const saved: any = await repo.save(po as any);
      let items = [];
      try {
        if (saved.itemsJson) items = JSON.parse(saved.itemsJson);
      } catch (e) {}
      res.status(201).json({ success: true, data: { ...saved, items } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateCustomerPO(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(CustomerPOEntity);
      const body = { ...req.body };
      if (body.items) {
        body.itemsJson = JSON.stringify(body.items);
        delete body.items;
      }
      await repo.update(id, body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Outward Dispatches
  static async getOutwardDispatches(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(OutwardDispatchEntity);
      const dispatches = await repo.find({ order: { dispatchDate: "DESC" } });
      const mapped = dispatches.map((d) => {
        let items = [];
        try {
          if (d.itemsJson) items = JSON.parse(d.itemsJson);
        } catch (e) {}
        return {
          id: d.id,
          dispatchNo: d.dispatchNo,
          customerPoId: d.customerPoId,
          customerPoNumber: d.customerPoNumber,
          customerName: d.customerName,
          dispatchDate: d.dispatchDate,
          transporter: d.transporter,
          vehicleNo: d.vehicleNumber,
          ewayBillNo: d.ewayBillNumber,
          totalUnits: d.totalDispatchedUnits,
          notes: d.notes,
          plant: d.plant,
          items,
        };
      });
      res.status(200).json({ success: true, data: mapped });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createOutwardDispatch(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(OutwardDispatchEntity);
      const body = req.body;
      const dispatch = repo.create({
        dispatchNo: body.dispatchNo,
        customerPoId: body.customerPoId,
        customerPoNumber: body.customerPoNumber,
        customerName: body.customerName,
        dispatchDate: body.dispatchDate,
        transporter: body.transporter,
        vehicleNumber: body.vehicleNumber || body.vehicleNo,
        ewayBillNumber: body.ewayBillNumber || body.ewayBillNo,
        totalDispatchedUnits: body.totalDispatchedUnits || body.totalUnits || 0,
        notes: body.notes,
        plant: body.plant || "Plant 1 - Pune",
        itemsJson: body.items ? JSON.stringify(body.items) : "[]",
      } as Partial<OutwardDispatchEntity>);
      const saved: any = await repo.save(dispatch as any);
      let items = [];
      try {
        if (saved.itemsJson) items = JSON.parse(saved.itemsJson);
      } catch (e) {}
      res.status(201).json({ success: true, data: { ...saved, items } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Finished Goods
  static async getFinishedGoods(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(FinishedGoodEntity);
      const goods = await repo.find({ order: { createdAt: "DESC" } });
      res.status(200).json({ success: true, data: goods });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createFinishedGood(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(FinishedGoodEntity);
      const good = repo.create(req.body);
      const saved = await repo.save(good);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateFinishedGood(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(FinishedGoodEntity);
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Stock Ledgers
  static async getStockLedgers(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(StockLedgerEntity);
      const ledgers = await repo.find({ order: { createdAt: "DESC" }, take: 100 });
      res.status(200).json({ success: true, data: ledgers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createStockLedger(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(StockLedgerEntity);
      const entry = repo.create(req.body);
      const saved = await repo.save(entry);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Production Logs
  static async getProductionLogs(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(ProductionLogEntity);
      const logs = await repo.find({ order: { createdAt: "DESC" } });
      res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createProductionLog(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(ProductionLogEntity);
      const log = repo.create(req.body);
      const saved = await repo.save(log);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateProductionLog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(ProductionLogEntity);
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteProductionLog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(ProductionLogEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Production log deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Dynamic Roles
  static async getRoles(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(RoleEntity);
      const roles = await repo.find({ order: { createdAt: "ASC" } });
      const mapped = roles.map((r) => {
        let permissions = [];
        try {
          if (r.permissionsJson) permissions = JSON.parse(r.permissionsJson);
        } catch (e) {}
        return {
          id: r.id,
          name: r.name,
          description: r.description || "",
          isSystem: r.isSystem,
          permissions,
        };
      });
      res.status(200).json({ success: true, data: mapped });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createRole(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(RoleEntity);
      const body = req.body;
      const role = repo.create({
        name: body.name,
        description: body.description,
        isSystem: body.isSystem || false,
        permissionsJson: body.permissions ? JSON.stringify(body.permissions) : "[]",
      } as Partial<RoleEntity>);
      const saved: any = await repo.save(role as any);
      let permissions = [];
      try {
        if (saved.permissionsJson) permissions = JSON.parse(saved.permissionsJson);
      } catch (e) {}
      res.status(201).json({ success: true, data: { ...saved, permissions } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(RoleEntity);
      const body = { ...req.body };
      if (body.permissions) {
        body.permissionsJson = JSON.stringify(body.permissions);
        delete body.permissions;
      }
      await repo.update(id, body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(RoleEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Role deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Dynamic Departments
  static async getDepartments(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(DepartmentEntity);
      const depts = await repo.find({ order: { createdAt: "ASC" } });
      const mapped = depts.map((d) => {
        let activeTeams = [];
        try {
          if (d.activeTeamsJson) activeTeams = JSON.parse(d.activeTeamsJson);
        } catch (e) {}
        return {
          id: d.id,
          name: d.name,
          plant: d.plant,
          manager: d.manager || "",
          description: d.description || "",
          activeTeams,
        };
      });
      res.status(200).json({ success: true, data: mapped });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createDepartment(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(DepartmentEntity);
      const body = req.body;
      const dept = repo.create({
        name: body.name,
        plant: body.plant,
        manager: body.manager,
        description: body.description,
        activeTeamsJson: body.activeTeams ? JSON.stringify(body.activeTeams) : "[]",
      } as Partial<DepartmentEntity>);
      const saved: any = await repo.save(dept as any);
      let activeTeams = [];
      try {
        if (saved.activeTeamsJson) activeTeams = JSON.parse(saved.activeTeamsJson);
      } catch (e) {}
      res.status(201).json({ success: true, data: { ...saved, activeTeams } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateDepartment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(DepartmentEntity);
      const body = { ...req.body };
      if (body.activeTeams) {
        body.activeTeamsJson = JSON.stringify(body.activeTeams);
        delete body.activeTeams;
      }
      await repo.update(id, body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteDepartment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(DepartmentEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Department deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Dynamic Plants
  static async getPlants(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(PlantEntity);
      const plants = await repo.find({ order: { createdAt: "ASC" } });
      res.status(200).json({ success: true, data: plants });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createPlant(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(PlantEntity);
      const plant = repo.create(req.body);
      const saved = await repo.save(plant);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updatePlant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(PlantEntity);
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deletePlant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(PlantEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Plant deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Customers Directory
  static async getCustomers(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(CustomerEntity);
      const customers = await repo.find({ order: { createdAt: "DESC" } });
      res.status(200).json({ success: true, data: customers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createCustomer(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(CustomerEntity);
      const customer = repo.create(req.body);
      const saved = await repo.save(customer);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(CustomerEntity);
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(CustomerEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Customer deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Suppliers Master
  static async getSuppliers(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(SupplierEntity);
      const suppliers = await repo.find({ order: { createdAt: "DESC" } });
      res.status(200).json({ success: true, data: suppliers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createSupplier(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(SupplierEntity);
      const supplier = repo.create(req.body);
      const saved = await repo.save(supplier);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateSupplier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(SupplierEntity);
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteSupplier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(SupplierEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Supplier deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Warehouses Master
  static async getWarehouses(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(WarehouseEntity);
      const warehouses = await repo.find({ order: { createdAt: "DESC" } });
      res.status(200).json({ success: true, data: warehouses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createWarehouse(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(WarehouseEntity);
      const warehouse = repo.create(req.body);
      const saved = await repo.save(warehouse);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateWarehouse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(WarehouseEntity);
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteWarehouse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(WarehouseEntity);
      await repo.delete(id);
      res.status(200).json({ success: true, message: "Warehouse deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GRN Entries
  static async getGRNEntries(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(GRNEntryEntity);
      const entries = await repo.find({ order: { receivedDate: "DESC" } });
      const mapped = entries.map((g) => {
        let items = [];
        try {
          if (g.itemsJson) items = JSON.parse(g.itemsJson);
        } catch (e) {}
        return {
          id: g.id,
          grnNumber: g.grnNumber,
          poId: g.poId,
          poNumber: g.poNumber,
          supplierName: g.supplierName,
          vehicleNumber: g.vehicleNumber,
          challanNumber: g.challanNumber,
          receivedDate: g.receivedDate,
          receivedBy: g.receivedBy,
          remarks: g.remarks,
          plant: g.plant,
          items,
        };
      });
      res.status(200).json({ success: true, data: mapped });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createGRNEntry(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(GRNEntryEntity);
      const body = req.body;
      const entry = repo.create({
        grnNumber: body.grnNumber,
        poId: body.poId,
        poNumber: body.poNumber,
        supplierName: body.supplierName,
        vehicleNumber: body.vehicleNumber,
        challanNumber: body.challanNumber,
        receivedDate: body.receivedDate,
        receivedBy: body.receivedBy,
        remarks: body.remarks,
        plant: body.plant || "Plant 1 - Pune",
        itemsJson: body.items ? JSON.stringify(body.items) : "[]",
      } as Partial<GRNEntryEntity>);
      const saved: any = await repo.save(entry as any);
      let items = [];
      try {
        if (saved.itemsJson) items = JSON.parse(saved.itemsJson);
      } catch (e) {}
      res.status(201).json({ success: true, data: { ...saved, items } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Audit Logs
  static async getAuditLogs(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(AuditLogEntity);
      const logs = await repo.find({ order: { createdAt: "DESC" }, take: 150 });
      res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createAuditLog(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(AuditLogEntity);
      const log = repo.create(req.body);
      const saved = await repo.save(log);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Finished Goods Ledger
  static async getFinishedGoodsLedger(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(FinishedGoodsLedgerEntity);
      const ledger = await repo.find({ order: { createdAt: "DESC" }, take: 100 });
      res.status(200).json({ success: true, data: ledger });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createFinishedGoodsLedger(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(FinishedGoodsLedgerEntity);
      const entry = repo.create(req.body);
      const saved = await repo.save(entry);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
