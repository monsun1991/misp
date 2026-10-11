import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { MaterialEntity } from "../models/material.model";
import { ProductEntity } from "../models/product.model";
import { PurchaseOrderEntity } from "../models/purchase-order.model";
import { KitEntity } from "../models/kit.model";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";

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

  // Employees & UBAC Users
  static async getUsers(_req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(User);
      const users = await repo.find({
        order: { createdAt: "DESC" },
      });
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(User);
      const {
        empCode,
        email,
        password,
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

      const hashedPassword = await bcrypt.hash(password || "Mips@2026", 10);
      const user = repo.create({
        empCode: empCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        email,
        password: hashedPassword,
        fullName,
        phoneNumber: phoneNumber || "",
        role: role || "Worker",
        plant: plant || "Plant 1 - Pune",
        warehouse: warehouse || "Main Raw Material Store",
        department: department || "Final Assembly Line 1",
        team: team || "Line 1 Alpha",
        workstation: workstation || "General Floor",
        supervisor: supervisor || "Supervisor",
        status: status || "Active",
        skills: typeof skills === "string" ? skills : (skills || []).join(", "),
        customPermissionsJson: Array.isArray(customPermissions)
          ? JSON.stringify(customPermissions)
          : customPermissionsJson || null,
        revokedPermissionsJson: Array.isArray(revokedPermissions)
          ? JSON.stringify(revokedPermissions)
          : revokedPermissionsJson || null,
      });
      const saved = await repo.save(user);
      res.status(201).json({
        success: true,
        data: saved,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(User);
      const { id } = req.params;
      const updateData = { ...req.body };
      if (Array.isArray(updateData.customPermissions)) {
        updateData.customPermissionsJson = JSON.stringify(updateData.customPermissions);
        delete updateData.customPermissions;
      }
      if (Array.isArray(updateData.revokedPermissions)) {
        updateData.revokedPermissionsJson = JSON.stringify(updateData.revokedPermissions);
        delete updateData.revokedPermissions;
      }
      await repo.update(id, updateData);
      const updated = await repo.findOne({ where: { id } });
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(User);
      const { id } = req.params;
      await repo.delete(id);
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
