import { AppDataSource } from "../config/data-source";
import { MaterialEntity } from "../models/material.model";
import { ProductEntity } from "../models/product.model";
import { PurchaseOrderEntity } from "../models/purchase-order.model";
import { User } from "../models/user.model";
import { UserRole } from "../enums";
import bcrypt from "bcrypt";

export const seedMipsInitialData = async (): Promise<void> => {
  const materialRepo = AppDataSource.getRepository(MaterialEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);
  const poRepo = AppDataSource.getRepository(PurchaseOrderEntity);
  const userRepo = AppDataSource.getRepository(User);

  try {
    const userCount = await userRepo.count();

    const existingAdmin = await userRepo.findOne({ where: { email: "admin@gmail.com" } });
    if (existingAdmin && existingAdmin.fullName && existingAdmin.fullName.toLowerCase().includes("rely")) {
      existingAdmin.fullName = "System Super Admin";
      existingAdmin.empCode = "EMP-0001";
      await userRepo.save(existingAdmin);
      console.log("✅ Updated admin user name in MySQL users table");
    }

    if (userCount === 0) {
      console.log("🌱 Seeding MIPS RBAC & UBAC Users...");
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      const defaultUsers = [
        {
          email: "admin@gmail.com",
          password: hashedPassword,
          fullName: "System Super Admin",
          phoneNumber: "9876543210",
          role: UserRole.SUPERADMIN,
          plant: "All Plants (Global)",
          warehouse: "All Warehouses",
          department: "Executive Management",
          team: "Central Operations",
        },
        {
          email: "store.manager@mips.internal",
          password: hashedPassword,
          fullName: "Ramesh Sharma",
          phoneNumber: "9876543211",
          role: UserRole.STORE_MANAGER,
          plant: "Plant 1 - Pune",
          warehouse: "Main Raw Material Store",
          department: "Raw Material Stores & Logistics",
          team: "Store Keepers",
        },
        {
          email: "purchase.manager@mips.internal",
          password: hashedPassword,
          fullName: "Vikram Malhotra",
          phoneNumber: "9876543212",
          role: UserRole.PURCHASE_MANAGER,
          plant: "Plant 1 - Pune",
          warehouse: "Main Raw Material Store",
          department: "Raw Material Stores & Logistics",
          team: "Sourcing & Logistics",
        },
        {
          email: "production.manager@mips.internal",
          password: hashedPassword,
          fullName: "Anand Deshmukh",
          phoneNumber: "9876543213",
          role: UserRole.PRODUCTION_MANAGER,
          plant: "Plant 1 - Pune",
          warehouse: "Assembly Line 1 Buffer",
          department: "Final Assembly Line 1",
          team: "Shop Floor Management",
        },
        {
          email: "supervisor.patil@mips.internal",
          password: hashedPassword,
          fullName: "Suresh Patil",
          phoneNumber: "9876543214",
          role: UserRole.SUPERVISOR,
          plant: "Plant 1 - Pune",
          warehouse: "Assembly Line 1 Buffer",
          department: "Final Assembly Line 1",
          team: "Line 1 Alpha",
          assignedWorkersJson: JSON.stringify(["Ravi Kumar", "Amit Sharma"]),
        },
        {
          email: "worker.ravi@mips.internal",
          password: hashedPassword,
          fullName: "Ravi Kumar",
          phoneNumber: "9876543215",
          role: UserRole.WORKER,
          plant: "Plant 1 - Pune",
          warehouse: "Assembly Line 1 Buffer",
          department: "Final Assembly Line 1",
          team: "Line 1 Alpha",
        },
      ];

      for (const u of defaultUsers) {
        await userRepo.save(userRepo.create(u as any));
      }
      console.log("✅ Seeded initial RBAC/UBAC users");
    }

    const materialCount = await materialRepo.count();
    if (materialCount === 0) {
      console.log("🌱 Seeding MIPS Materials Master...");
      const initialMaterials = [
        {
          code: "PCB-12W-FR4",
          name: "12W LED Star PCB (Lumileds Chipset)",
          category: "Electronics",
          subCategory: "Circuit Boards",
          uom: "Pcs",
          supplier: "Lumileds India Components",
          warehouse: "Main Raw Material Store",
          location: "Rack E-01",
          currentStock: 3450,
          stockWithEmployees: 180,
          minStock: 2000,
          maxStock: 12000,
          reorderLevel: 3000,
          safetyStock: 1500,
          leadTimeDays: 14,
          standardCost: 42.50,
          status: "Active",
        },
        {
          code: "DRV-12W-IC",
          name: "12W Constant Current Isolated Driver (HPF)",
          category: "Electronics",
          subCategory: "Power Supplies",
          uom: "Pcs",
          supplier: "Delta Electronics India",
          warehouse: "Main Raw Material Store",
          location: "Rack E-04",
          currentStock: 2150,
          stockWithEmployees: 120,
          minStock: 1500,
          maxStock: 8000,
          reorderLevel: 2500,
          safetyStock: 1200,
          leadTimeDays: 10,
          standardCost: 58.00,
          status: "Active",
        },
        {
          code: "HSG-12W-ALU",
          name: "12W Aluminium Die-Cast Bulb Housing Shell",
          category: "Mechanical",
          subCategory: "Enclosures",
          uom: "Pcs",
          supplier: "Sunlit Precision Die-Cast",
          warehouse: "Main Raw Material Store",
          location: "Rack M-12",
          currentStock: 9400,
          stockWithEmployees: 250,
          minStock: 2500,
          maxStock: 10000,
          reorderLevel: 4000,
          safetyStock: 2000,
          leadTimeDays: 7,
          standardCost: 34.00,
          status: "Active",
        },
      ];

      for (const m of initialMaterials) {
        await materialRepo.save(materialRepo.create(m as any));
      }
      console.log("✅ Seeded initial LED Materials");
    }

    const productCount = await productRepo.count();
    if (productCount === 0) {
      console.log("🌱 Seeding MIPS Products & Bill of Materials...");
      const initialProducts = [
        {
          code: "EFL-BLB-12W",
          name: "Eiffel 12W Prime Eco LED Bulb (B22)",
          category: "LED Bulbs",
          wattage: "12W",
          unit: "Unit",
          standardCost: 161.05,
          status: "Active",
          bomJson: JSON.stringify([
            { materialCode: "PCB-12W-FR4", materialName: "12W LED Star PCB", qtyPerUnit: 1, uom: "Pcs" },
            { materialCode: "DRV-12W-IC", materialName: "12W Constant Current Isolated Driver", qtyPerUnit: 1, uom: "Pcs" },
            { materialCode: "HSG-12W-ALU", materialName: "12W Aluminium Housing Shell", qtyPerUnit: 1, uom: "Pcs" },
          ]),
        },
      ];

      for (const p of initialProducts) {
        await productRepo.save(productRepo.create(p as any));
      }
      console.log("✅ Seeded initial Products & BOMs");
    }

    const poCount = await poRepo.count();
    if (poCount === 0) {
      console.log("🌱 Seeding MIPS Purchase Orders...");
      const initialPOs = [
        {
          poNumber: "PO-2026-089",
          supplier: "Lumileds India Components",
          poDate: "2026-09-28",
          materialCode: "PCB-12W-FR4",
          materialName: "12W LED Star PCB (Lumileds Chipset)",
          orderedQty: 5000,
          receivedQty: 0,
          pendingQty: 5000,
          unitRate: 42.50,
          expectedDeliveryDate: "2026-10-06",
          status: "In Transit",
          transporter: "V-Trans Express (AWB: VT-892110)",
          trackingNo: "VT-892110",
          dispatchDate: "2026-10-01",
        },
      ];

      for (const po of initialPOs) {
        await poRepo.save(poRepo.create(po as any));
      }
      console.log("✅ Seeded initial Purchase Orders");
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

