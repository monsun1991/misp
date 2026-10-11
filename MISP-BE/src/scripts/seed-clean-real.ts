import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { MaterialEntity } from '../models/material.model';
import { ProductEntity } from '../models/product.model';
import { PurchaseOrderEntity } from '../models/purchase-order.model';
import { KitEntity } from '../models/kit.model';
import { ProductionLogEntity } from '../models/production-log.model';
import { StockLedgerEntity } from '../models/stock-ledger.model';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function runSeed() {
  console.log('🔄 Connecting to MySQL Database...');
  await AppDataSource.initialize();
  console.log('✅ Connected to MySQL!');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  console.log('🧹 Clearing old mock & placeholder records...');
  // Temporarily disable foreign key checks for clean truncation
  await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
  await queryRunner.query('TRUNCATE TABLE stock_ledger;');
  await queryRunner.query('TRUNCATE TABLE production_logs;');
  await queryRunner.query('TRUNCATE TABLE kits;');
  await queryRunner.query('TRUNCATE TABLE purchase_orders;');
  await queryRunner.query('TRUNCATE TABLE products;');
  await queryRunner.query('TRUNCATE TABLE materials;');
  await queryRunner.query('TRUNCATE TABLE users;');
  await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('✅ All old tables truncated cleanly.');

  // 1. REAL USERS & WORKFORCE
  console.log('🌱 Seeding authentic Eiffel Workforce & UBAC Users...');
  const userRepo = AppDataSource.getRepository(User);
  const defaultPassword = await bcrypt.hash('Admin@123', 10);

  const realUsers = [
    {
      id: uuidv4(),
      empCode: 'EMP-0001',
      fullName: 'System Super Admin',
      email: 'admin@gmail.com',
      password: defaultPassword,
      phoneNumber: '+91 98220 11001',
      role: 'SuperAdmin',
      plant: 'All Plants (Global)',
      warehouse: 'All Warehouses',
      department: 'Executive Management',
      team: 'Operations Leadership',
      workstation: 'HQ Office',
      supervisor: 'Board of Directors',
      status: 'Active',
      skills: 'ERP Governance, Plant Operations, System Security, UBAC Scoping'
    },
    {
      id: uuidv4(),
      empCode: 'EMP-1001',
      fullName: 'Anand Deshmukh',
      email: 'anand.deshmukh@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11002',
      role: 'Plant Manager',
      plant: 'Plant 1 - Pune',
      warehouse: 'Main Raw Material Store',
      department: 'Executive Management',
      team: 'Plant 1 Leadership',
      workstation: 'Manager Cabin - Pune',
      supervisor: 'System Super Admin',
      status: 'Active',
      skills: 'Lean Manufacturing, OEE Optimization, Plant Sizing, Six Sigma'
    },
    {
      id: uuidv4(),
      empCode: 'EMP-1002',
      fullName: 'Dr. Vikram Malhotra',
      email: 'vikram.malhotra@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11003',
      role: 'Quality Inspector',
      plant: 'Plant 1 - Pune',
      warehouse: 'QA Hold & Quarantine Staging',
      department: 'Quality Assurance & Testing',
      team: 'Reliability Engineering',
      workstation: 'Photometric Darkroom & Sphere Lab',
      supervisor: 'Anand Deshmukh',
      status: 'Active',
      skills: 'Integrating Sphere, Spectroradiometer, Hi-Pot Surge, CCT Chromaticity Binning'
    },
    {
      id: uuidv4(),
      empCode: 'EMP-1003',
      fullName: 'Ramesh Sharma',
      email: 'ramesh.sharma@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11004',
      role: 'Store Manager',
      plant: 'Plant 1 - Pune',
      warehouse: 'Main Raw Material Store',
      department: 'Raw Material Stores & Logistics',
      team: 'Inbound Logistics',
      workstation: 'Inbound Dock 1 - Pune',
      supervisor: 'Anand Deshmukh',
      status: 'Active',
      skills: 'Stock Ledger Reconciliations, GRN Validation, FIFO Storage, Barcode Verification'
    },
    {
      id: uuidv4(),
      empCode: 'EMP-1004',
      fullName: 'Sneha Kulkarni',
      email: 'sneha.kulkarni@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11005',
      role: 'Purchase Manager',
      plant: 'Plant 1 - Pune',
      warehouse: 'Main Raw Material Store',
      department: 'Procurement & Sourcing',
      team: 'Vendor Governance',
      workstation: 'Procurement Office',
      supervisor: 'Anand Deshmukh',
      status: 'Active',
      skills: 'Vendor Negotiation, 4-Month Material Run Forecasting, Import Logistics, PO Issuance'
    },
    {
      id: uuidv4(),
      empCode: 'EMP-1005',
      fullName: 'Suresh Patil',
      email: 'suresh.patil@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11006',
      role: 'Floor Supervisor',
      plant: 'Plant 1 - Pune',
      warehouse: 'Assembly Line 1 Buffer',
      department: 'Final Assembly Line 1',
      team: 'Line 1 Alpha',
      workstation: 'Line 1 Supervisory Station',
      supervisor: 'Anand Deshmukh',
      status: 'Active',
      skills: 'Kit Issuance, BOM Reconciliation, Shop Floor Shift Balancing, Worker Productivity Tracking',
      assignedWorkersJson: JSON.stringify(['Ravi Kumar', 'Amit Sharma', 'Sunil Jadhav'])
    },
    {
      id: uuidv4(),
      empCode: 'EMP-2001',
      fullName: 'Ravi Kumar',
      email: 'ravi.kumar@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11007',
      role: 'Worker',
      plant: 'Plant 1 - Pune',
      warehouse: 'Assembly Line 1 Buffer',
      department: 'Final Assembly Line 1',
      team: 'Line 1 Alpha',
      workstation: 'Station 2 - Housing Assembly & Cap Press',
      supervisor: 'Suresh Patil',
      status: 'Active',
      skills: 'Pneumatic Screwdriver, B22 Cap Press, Heat-Sink Paste Dispensing'
    },
    {
      id: uuidv4(),
      empCode: 'EMP-2002',
      fullName: 'Amit Sharma',
      email: 'amit.sharma@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11008',
      role: 'Worker',
      plant: 'Plant 1 - Pune',
      warehouse: 'Assembly Line 1 Buffer',
      department: 'Final Assembly Line 1',
      team: 'Line 1 Alpha',
      workstation: 'Station 1 - Driver Potting & Wire Soldering',
      supervisor: 'Suresh Patil',
      status: 'Active',
      skills: 'Lead-Free Soldering, Potting Gel Injection, Wire Harness Routing'
    },
    {
      id: uuidv4(),
      empCode: 'EMP-2003',
      fullName: 'Sunil Jadhav',
      email: 'sunil.jadhav@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11009',
      role: 'Worker',
      plant: 'Plant 1 - Pune',
      warehouse: 'Assembly Line 1 Buffer',
      department: 'Final Assembly Line 1',
      team: 'Line 1 Alpha',
      workstation: 'Station 4 - High-Voltage Ageing & Lumens Check',
      supervisor: 'Suresh Patil',
      status: 'Active',
      skills: 'End-of-Line Testing, Ageing Tunnel Loading, Optical Diffuser Snap-Fitting'
    },
    {
      id: uuidv4(),
      empCode: 'EMP-3001',
      fullName: 'Naveen Reddy',
      email: 'naveen.reddy@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11010',
      role: 'Plant Manager',
      plant: 'Plant 2 - Hyderabad',
      warehouse: 'Southern Staging Store',
      department: 'Executive Management',
      team: 'Plant 2 Leadership',
      workstation: 'Plant Office - Cherlapally',
      supervisor: 'System Super Admin',
      status: 'Active',
      skills: 'Commercial Luminaire Fabrication, IP66 Gasket Sealing, Production Planning'
    },
    {
      id: uuidv4(),
      empCode: 'EMP-3002',
      fullName: 'Priya Nair',
      email: 'priya.nair@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11011',
      role: 'Store Manager',
      plant: 'Plant 2 - Hyderabad',
      warehouse: 'Southern Staging Store',
      department: 'Raw Material Stores & Logistics',
      team: 'Southern Depot Logistics',
      workstation: 'Store Desk - Hyderabad',
      supervisor: 'Naveen Reddy',
      status: 'Active',
      skills: 'Inter-Plant Transit GRN, High-Bay Staging, FIFO Dispatch'
    },
    {
      id: uuidv4(),
      empCode: 'EMP-3003',
      fullName: 'K. Srinivas',
      email: 'k.srinivas@eiffel.in',
      password: defaultPassword,
      phoneNumber: '+91 98220 11012',
      role: 'Floor Supervisor',
      plant: 'Plant 2 - Hyderabad',
      warehouse: 'Heavy Luminaire Assembly Buffer',
      department: 'Commercial Assembly Line 2',
      team: 'Line 2 Bravo',
      workstation: 'Floodlight Jig Line',
      supervisor: 'Naveen Reddy',
      status: 'Active',
      skills: 'Die-Cast Heavy Assembly, IP67 Driver Integration, Torque Calibration'
    }
  ];

  for (const u of realUsers) {
    await userRepo.save(userRepo.create(u as any));
  }
  console.log(`✅ Seeded ${realUsers.length} real workforce users into MySQL.`);

  // 2. REAL MATERIALS MASTER
  console.log('🌱 Seeding authentic Eiffel LED Raw Materials...');
  const matRepo = AppDataSource.getRepository(MaterialEntity);

  const realMaterials = [
    {
      id: uuidv4(),
      code: 'PCB-12W-FR4',
      name: '12W LED Star MCPCB (Lumileds 2835 Chipset)',
      category: 'Electronics',
      subCategory: 'LED Star Boards',
      uom: 'Pcs',
      supplier: 'Lumileds India Components',
      warehouse: 'Main Raw Material Store',
      location: 'Rack E-01 (Moisture Controlled)',
      currentStock: 3450,
      stockWithEmployees: 180,
      minStock: 2000,
      maxStock: 12000,
      reorderLevel: 3000,
      safetyStock: 1500,
      leadTimeDays: 14,
      standardCost: 42.50,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'PCB-09W-FR4',
      name: '9W LED Star MCPCB (Lumileds 2835 Chipset)',
      category: 'Electronics',
      subCategory: 'LED Star Boards',
      uom: 'Pcs',
      supplier: 'Lumileds India Components',
      warehouse: 'Main Raw Material Store',
      location: 'Rack E-02 (Moisture Controlled)',
      currentStock: 4800,
      stockWithEmployees: 150,
      minStock: 2500,
      maxStock: 15000,
      reorderLevel: 3500,
      safetyStock: 1800,
      leadTimeDays: 14,
      standardCost: 32.00,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'PCB-20W-BAT',
      name: '20W Linear Batten LED Module (4ft Al-Substrate)',
      category: 'Electronics',
      subCategory: 'Linear Modules',
      uom: 'Pcs',
      supplier: 'Lumileds India Components',
      warehouse: 'Main Raw Material Store',
      location: 'Rack E-05',
      currentStock: 1800,
      stockWithEmployees: 80,
      minStock: 1000,
      maxStock: 6000,
      reorderLevel: 1500,
      safetyStock: 800,
      leadTimeDays: 14,
      standardCost: 65.00,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'COB-50W-BRIDG',
      name: '50W High-Lumen Bridgelux COB LED Array (5000K, 90 CRI)',
      category: 'Electronics',
      subCategory: 'COB Arrays',
      uom: 'Pcs',
      supplier: 'Bridgelux Semiconductor',
      warehouse: 'Southern Staging Store',
      location: 'Rack E-09 (Static Protected)',
      currentStock: 950,
      stockWithEmployees: 40,
      minStock: 500,
      maxStock: 3000,
      reorderLevel: 800,
      safetyStock: 400,
      leadTimeDays: 21,
      standardCost: 185.00,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'DRV-12W-IC',
      name: '12W Constant Current Isolated Driver (HPF > 0.95, Surge 2.5kV)',
      category: 'Electronics',
      subCategory: 'Power Supplies',
      uom: 'Pcs',
      supplier: 'Delta Electronics India',
      warehouse: 'Main Raw Material Store',
      location: 'Rack D-01',
      currentStock: 2150,
      stockWithEmployees: 120,
      minStock: 1500,
      maxStock: 8000,
      reorderLevel: 2500,
      safetyStock: 1200,
      leadTimeDays: 10,
      standardCost: 58.00,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'DRV-09W-IC',
      name: '9W Constant Current Isolated Driver (HPF > 0.92)',
      category: 'Electronics',
      subCategory: 'Power Supplies',
      uom: 'Pcs',
      supplier: 'Delta Electronics India',
      warehouse: 'Main Raw Material Store',
      location: 'Rack D-02',
      currentStock: 3200,
      stockWithEmployees: 140,
      minStock: 2000,
      maxStock: 10000,
      reorderLevel: 2800,
      safetyStock: 1400,
      leadTimeDays: 10,
      standardCost: 46.00,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'DRV-50W-IP67',
      name: '50W IP67 Waterproof Constant Current Driver (4kV Surge)',
      category: 'Electronics',
      subCategory: 'Outdoor Drivers',
      uom: 'Pcs',
      supplier: 'Delta Electronics India',
      warehouse: 'Heavy Luminaire Assembly Buffer',
      location: 'Rack D-07',
      currentStock: 620,
      stockWithEmployees: 30,
      minStock: 400,
      maxStock: 2500,
      reorderLevel: 600,
      safetyStock: 300,
      leadTimeDays: 14,
      standardCost: 240.00,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'HSG-12W-ALU',
      name: '12W Aluminium Die-Cast Thermally Conductive Housing',
      category: 'Mechanical',
      subCategory: 'Heatsinks & Enclosures',
      uom: 'Pcs',
      supplier: 'Sunlit Precision Die-Cast',
      warehouse: 'Main Raw Material Store',
      location: 'Bay M-03',
      currentStock: 6400,
      stockWithEmployees: 250,
      minStock: 2500,
      maxStock: 14000,
      reorderLevel: 4000,
      safetyStock: 2000,
      leadTimeDays: 7,
      standardCost: 34.00,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'HSG-09W-ALU',
      name: '9W Aluminium Die-Cast Housing Shell',
      category: 'Mechanical',
      subCategory: 'Heatsinks & Enclosures',
      uom: 'Pcs',
      supplier: 'Sunlit Precision Die-Cast',
      warehouse: 'Main Raw Material Store',
      location: 'Bay M-04',
      currentStock: 5100,
      stockWithEmployees: 200,
      minStock: 2500,
      maxStock: 12000,
      reorderLevel: 3500,
      safetyStock: 1800,
      leadTimeDays: 7,
      standardCost: 26.50,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'HSG-50W-FLD',
      name: '50W Pressure Die-Cast IP66 Floodlight Enclosure with Fin Radiator',
      category: 'Mechanical',
      subCategory: 'Heavy Castings',
      uom: 'Pcs',
      supplier: 'Sunlit Precision Die-Cast',
      warehouse: 'Southern Staging Store',
      location: 'Bay M-10',
      currentStock: 800,
      stockWithEmployees: 40,
      minStock: 400,
      maxStock: 3000,
      reorderLevel: 700,
      safetyStock: 350,
      leadTimeDays: 10,
      standardCost: 195.00,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'DIF-12W-PC',
      name: '12W High Transmittance Polycarbonate Frosted Dome Diffuser',
      category: 'Optics',
      subCategory: 'Diffusers',
      uom: 'Pcs',
      supplier: 'Sunlit Precision Die-Cast',
      warehouse: 'Main Raw Material Store',
      location: 'Bay O-01',
      currentStock: 7800,
      stockWithEmployees: 180,
      minStock: 3000,
      maxStock: 15000,
      reorderLevel: 4500,
      safetyStock: 2000,
      leadTimeDays: 5,
      standardCost: 12.50,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'WIR-PTFE-22',
      name: '22AWG High-Temp PTFE Connecting Wire Harness (Pre-Stripped)',
      category: 'Hardware',
      subCategory: 'Wiring & Cables',
      uom: 'Sets',
      supplier: 'Apex Cables & Electrical Fasteners',
      warehouse: 'Main Raw Material Store',
      location: 'Shelf W-02',
      currentStock: 8500,
      stockWithEmployees: 250,
      minStock: 3000,
      maxStock: 20000,
      reorderLevel: 5000,
      safetyStock: 2500,
      leadTimeDays: 4,
      standardCost: 4.80,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'SCR-M3-SS',
      name: 'SS M3x6 Phillips Pan Head Assembly Screws',
      category: 'Hardware',
      subCategory: 'Fasteners',
      uom: 'Pcs',
      supplier: 'Apex Cables & Electrical Fasteners',
      warehouse: 'Main Raw Material Store',
      location: 'Shelf F-08',
      currentStock: 32000,
      stockWithEmployees: 600,
      minStock: 10000,
      maxStock: 80000,
      reorderLevel: 20000,
      safetyStock: 10000,
      leadTimeDays: 3,
      standardCost: 0.75,
      status: 'Active'
    },
    {
      id: uuidv4(),
      code: 'BOX-12W-RET',
      name: '12W Eiffel Premium Retail Printed Inner Monocarton (350 GSM)',
      category: 'Packaging',
      subCategory: 'Retail Monocartons',
      uom: 'Pcs',
      supplier: 'Packwell Corrugations',
      warehouse: 'Finished Goods Packaging Store',
      location: 'Pallet P-01',
      currentStock: 9200,
      stockWithEmployees: 200,
      minStock: 4000,
      maxStock: 25000,
      reorderLevel: 6000,
      safetyStock: 3000,
      leadTimeDays: 7,
      standardCost: 4.50,
      status: 'Active'
    }
  ];

  for (const m of realMaterials) {
    await matRepo.save(matRepo.create(m as any));
  }
  console.log(`✅ Seeded ${realMaterials.length} real LED materials into MySQL.`);

  // 3. REAL PRODUCTS & BOMS
  console.log('🌱 Seeding authentic Eiffel Finished Luminaires & BOMs...');
  const prodRepo = AppDataSource.getRepository(ProductEntity);

  const realProducts = [
    {
      id: uuidv4(),
      code: 'EFL-BLB-12W',
      name: 'Eiffel 12W Prime Eco LED Bulb (B22)',
      category: 'LED Bulbs',
      wattage: '12W',
      unit: 'Unit',
      standardCost: 161.05,
      status: 'Active',
      bomJson: JSON.stringify([
        { materialCode: 'PCB-12W-FR4', materialName: '12W LED Star MCPCB', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'DRV-12W-IC', materialName: '12W Isolated Driver', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'HSG-12W-ALU', materialName: '12W Aluminium Housing', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'DIF-12W-PC', materialName: '12W PC Diffuser Dome', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'WIR-PTFE-22', materialName: '22AWG Wire Harness', qtyPerUnit: 1, uom: 'Sets' },
        { materialCode: 'SCR-M3-SS', materialName: 'SS M3x6 Assembly Screws', qtyPerUnit: 2, uom: 'Pcs' },
        { materialCode: 'BOX-12W-RET', materialName: '12W Eiffel Retail Box', qtyPerUnit: 1, uom: 'Pcs' }
      ])
    },
    {
      id: uuidv4(),
      code: 'EFL-BLB-09W',
      name: 'Eiffel 9W Classic LED Bulb (B22)',
      category: 'LED Bulbs',
      wattage: '9W',
      unit: 'Unit',
      standardCost: 124.50,
      status: 'Active',
      bomJson: JSON.stringify([
        { materialCode: 'PCB-09W-FR4', materialName: '9W LED Star MCPCB', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'DRV-09W-IC', materialName: '9W Isolated Driver', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'HSG-09W-ALU', materialName: '9W Aluminium Housing', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'DIF-12W-PC', materialName: 'PC Diffuser Dome', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'WIR-PTFE-22', materialName: '22AWG Wire Harness', qtyPerUnit: 1, uom: 'Sets' },
        { materialCode: 'SCR-M3-SS', materialName: 'SS M3x6 Screws', qtyPerUnit: 2, uom: 'Pcs' },
        { materialCode: 'BOX-12W-RET', materialName: 'Retail Monocarton', qtyPerUnit: 1, uom: 'Pcs' }
      ])
    },
    {
      id: uuidv4(),
      code: 'EFL-BAT-20W',
      name: 'Eiffel 20W Linear Slim Batten (4ft)',
      category: 'Battens',
      wattage: '20W',
      unit: 'Unit',
      standardCost: 285.00,
      status: 'Active',
      bomJson: JSON.stringify([
        { materialCode: 'PCB-20W-BAT', materialName: '20W Linear Batten LED Module', qtyPerUnit: 2, uom: 'Pcs' },
        { materialCode: 'DRV-12W-IC', materialName: 'Batten Power Driver', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'WIR-PTFE-22', materialName: '22AWG Wire Harness', qtyPerUnit: 2, uom: 'Sets' },
        { materialCode: 'SCR-M3-SS', materialName: 'SS M3x6 Assembly Screws', qtyPerUnit: 4, uom: 'Pcs' }
      ])
    },
    {
      id: uuidv4(),
      code: 'EFL-DL-15W',
      name: 'Eiffel 15W Architectural Recessed Downlight',
      category: 'Downlights',
      wattage: '15W',
      unit: 'Unit',
      standardCost: 340.00,
      status: 'Active',
      bomJson: JSON.stringify([
        { materialCode: 'PCB-12W-FR4', materialName: 'LED Engine Board', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'DRV-12W-IC', materialName: 'Downlight Driver', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'HSG-12W-ALU', materialName: 'Die-Cast Downlight Trim', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'DIF-12W-PC', materialName: 'Frosted Optical Lens', qtyPerUnit: 1, uom: 'Pcs' }
      ])
    },
    {
      id: uuidv4(),
      code: 'EFL-FLD-50W',
      name: 'Eiffel 50W Commercial Outdoor IP66 Floodlight',
      category: 'Floodlights',
      wattage: '50W',
      unit: 'Unit',
      standardCost: 890.00,
      status: 'Active',
      bomJson: JSON.stringify([
        { materialCode: 'COB-50W-BRIDG', materialName: '50W Bridgelux COB LED Array', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'DRV-50W-IP67', materialName: '50W IP67 Waterproof Driver', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'HSG-50W-FLD', materialName: '50W Die-Cast Floodlight Housing', qtyPerUnit: 1, uom: 'Pcs' },
        { materialCode: 'WIR-PTFE-22', materialName: 'Wire Harness', qtyPerUnit: 2, uom: 'Sets' },
        { materialCode: 'SCR-M3-SS', materialName: 'SS Fasteners', qtyPerUnit: 8, uom: 'Pcs' }
      ])
    }
  ];

  for (const p of realProducts) {
    await prodRepo.save(prodRepo.create(p as any));
  }
  console.log(`✅ Seeded ${realProducts.length} real products and BOMs into MySQL.`);

  // 4. REAL PURCHASE ORDERS
  console.log('🌱 Seeding authentic Eiffel Purchase Orders...');
  const poRepo = AppDataSource.getRepository(PurchaseOrderEntity);

  const realPOs = [
    {
      id: uuidv4(),
      poNumber: 'PO-2026-089',
      supplier: 'Lumileds India Components',
      poDate: '2026-09-28',
      materialCode: 'PCB-12W-FR4',
      materialName: '12W LED Star MCPCB (Lumileds 2835 Chipset)',
      orderedQty: 5000,
      receivedQty: 0,
      pendingQty: 5000,
      unitRate: 42.50,
      expectedDeliveryDate: '2026-10-06',
      status: 'In Transit',
      transporter: 'V-Trans Express (AWB: VT-892110)',
      trackingNo: 'VT-892110',
      dispatchDate: '2026-10-01'
    },
    {
      id: uuidv4(),
      poNumber: 'PO-2026-090',
      supplier: 'Delta Electronics India',
      poDate: '2026-09-29',
      materialCode: 'DRV-12W-IC',
      materialName: '12W Constant Current Isolated Driver (HPF)',
      orderedQty: 4000,
      receivedQty: 1000,
      pendingQty: 3000,
      unitRate: 58.00,
      expectedDeliveryDate: '2026-10-08',
      status: 'In Transit',
      transporter: 'TCI Freight Logistics (AWB: TCI-54129)',
      trackingNo: 'TCI-54129',
      dispatchDate: '2026-10-02'
    },
    {
      id: uuidv4(),
      poNumber: 'PO-2026-091',
      supplier: 'Sunlit Precision Die-Cast',
      poDate: '2026-10-01',
      materialCode: 'HSG-12W-ALU',
      materialName: '12W Aluminium Die-Cast Housing Shell',
      orderedQty: 6000,
      receivedQty: 0,
      pendingQty: 6000,
      unitRate: 34.00,
      expectedDeliveryDate: '2026-10-12',
      status: 'Ordered',
      transporter: 'Mahindra Logistics Direct',
      trackingNo: 'ML-PUN-331',
      dispatchDate: '2026-10-03'
    },
    {
      id: uuidv4(),
      poNumber: 'PO-2026-085',
      supplier: 'Bridgelux Semiconductor',
      poDate: '2026-09-25',
      materialCode: 'COB-50W-BRIDG',
      materialName: '50W High-Lumen Bridgelux COB LED Array',
      orderedQty: 1000,
      receivedQty: 0,
      pendingQty: 1000,
      unitRate: 185.00,
      expectedDeliveryDate: '2026-10-15',
      status: 'In Transit',
      transporter: 'Gati KWE Express (AWB: GATI-HYD-772)',
      trackingNo: 'GATI-HYD-772',
      dispatchDate: '2026-10-02'
    }
  ];

  for (const po of realPOs) {
    await poRepo.save(poRepo.create(po as any));
  }
  console.log(`✅ Seeded ${realPOs.length} real purchase orders into MySQL.`);

  // 5. REAL PRODUCTION KITS
  console.log('🌱 Seeding authentic Shop Floor Production Kits...');
  const kitRepo = AppDataSource.getRepository(KitEntity);

  const realKits = [
    {
      id: uuidv4(),
      kitNumber: 'KIT-2026-1001',
      productCode: 'EFL-BLB-12W',
      productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
      plannedQty: 100,
      workerName: 'Ravi Kumar',
      supervisorName: 'Suresh Patil',
      workstation: 'Station 2 - Housing Assembly & Cap Press',
      status: 'In Production',
      itemsJson: JSON.stringify([
        { materialCode: 'PCB-12W-FR4', materialName: '12W LED Star MCPCB', bomQty: 1, totalIssued: 100, consumed: 80, returned: 10, wastage: 0, balance: 10 },
        { materialCode: 'DRV-12W-IC', materialName: '12W Isolated Driver', bomQty: 1, totalIssued: 100, consumed: 85, returned: 5, wastage: 2, balance: 8 },
        { materialCode: 'HSG-12W-ALU', materialName: '12W Aluminium Housing', bomQty: 1, totalIssued: 100, consumed: 90, returned: 10, wastage: 0, balance: 0 },
        { materialCode: 'DIF-12W-PC', materialName: 'PC Diffuser Dome', bomQty: 1, totalIssued: 100, consumed: 85, returned: 15, wastage: 0, balance: 0 }
      ])
    },
    {
      id: uuidv4(),
      kitNumber: 'KIT-2026-1002',
      productCode: 'EFL-BLB-09W',
      productName: 'Eiffel 9W Classic LED Bulb (B22)',
      plannedQty: 150,
      workerName: 'Amit Sharma',
      supervisorName: 'Suresh Patil',
      workstation: 'Station 1 - Driver Potting & Wire Soldering',
      status: 'In Production',
      itemsJson: JSON.stringify([
        { materialCode: 'PCB-09W-FR4', materialName: '9W LED Star MCPCB', bomQty: 1, totalIssued: 150, consumed: 120, returned: 0, wastage: 0, balance: 30 },
        { materialCode: 'DRV-09W-IC', materialName: '9W Isolated Driver', bomQty: 1, totalIssued: 150, consumed: 125, returned: 0, wastage: 1, balance: 24 }
      ])
    },
    {
      id: uuidv4(),
      kitNumber: 'KIT-2026-0988',
      productCode: 'EFL-BLB-12W',
      productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
      plannedQty: 200,
      workerName: 'Ravi Kumar',
      supervisorName: 'Suresh Patil',
      workstation: 'Final Assembly Line 1',
      status: 'Closed',
      itemsJson: JSON.stringify([
        { materialCode: 'PCB-12W-FR4', materialName: '12W LED Star MCPCB', bomQty: 1, totalIssued: 200, consumed: 198, returned: 2, wastage: 0, balance: 0 }
      ]),
      reconciliationJson: JSON.stringify({
        reconciledAt: '2026-10-01 05:30 PM',
        supervisorNotes: 'Batch completed with 100% material accounting. 2 undamaged PCBs returned to warehouse.'
      })
    }
  ];

  for (const k of realKits) {
    await kitRepo.save(kitRepo.create(k as any));
  }
  console.log(`✅ Seeded ${realKits.length} real production kits into MySQL.`);

  // 6. REAL PRODUCTION SHIFT LOGS
  console.log('🌱 Seeding authentic Shop Floor Production Shift Logs...');
  const logRepo = AppDataSource.getRepository(ProductionLogEntity);

  const realLogs = [
    {
      id: uuidv4(),
      productName: 'Eiffel 12W Prime Eco LED Bulb (B22)',
      kitNumber: 'KIT-2026-1001',
      productCode: 'EFL-BLB-12W',
      stage: 'Final Assembly & Testing',
      operatorName: 'Ravi Kumar',
      goodQty: 98,
      reworkQty: 2,
      scrapQty: 0,
      qaStatus: 'Pass',
      notes: 'Morning Shift A completed. Average throughput 12.25 units/hr. 2 units sent for wire resoldering.'
    },
    {
      id: uuidv4(),
      productName: 'Eiffel 9W Classic LED Bulb (B22)',
      kitNumber: 'KIT-2026-1002',
      productCode: 'EFL-BLB-09W',
      stage: 'Driver Integration & Potting',
      operatorName: 'Amit Sharma',
      goodQty: 148,
      reworkQty: 1,
      scrapQty: 1,
      qaStatus: 'Pass',
      notes: 'Evening Shift B. Achieved 102.7% target productivity. 1 driver failed Hi-Pot surge.'
    }
  ];

  for (const l of realLogs) {
    await logRepo.save(logRepo.create(l as any));
  }
  console.log(`✅ Seeded ${realLogs.length} real shift logs into MySQL.`);

  // 7. REAL STOCK LEDGER ENTRIES
  console.log('🌱 Seeding authentic Traceable Stock Ledger...');
  const ledgerRepo = AppDataSource.getRepository(StockLedgerEntity);

  const realLedgers = [
    {
      id: uuidv4(),
      materialCode: 'PCB-12W-FR4',
      materialName: '12W LED Star MCPCB (Lumileds 2835 Chipset)',
      transactionType: 'PO_RECEIPT',
      quantity: 5000,
      balanceAfter: 5000,
      referenceNumber: 'SYS-INIT-PUN-01',
      department: 'Raw Material Stores & Logistics',
      employeeName: 'Ramesh Sharma',
      remarks: 'Initial audited physical inventory balance upload (Pune Plant)'
    },
    {
      id: uuidv4(),
      materialCode: 'PCB-12W-FR4',
      materialName: '12W LED Star MCPCB (Lumileds 2835 Chipset)',
      transactionType: 'KIT_ISSUE',
      quantity: -200,
      balanceAfter: 4800,
      referenceNumber: 'KIT-2026-0988',
      department: 'Final Assembly Line 1',
      employeeName: 'Ravi Kumar',
      remarks: 'Issued to Line 1 for batch 200 (Ravi Kumar)'
    },
    {
      id: uuidv4(),
      materialCode: 'PCB-12W-FR4',
      materialName: '12W LED Star MCPCB (Lumileds 2835 Chipset)',
      transactionType: 'KIT_ISSUE',
      quantity: -100,
      balanceAfter: 4700,
      referenceNumber: 'KIT-2026-1001',
      department: 'Final Assembly Line 1',
      employeeName: 'Ravi Kumar',
      remarks: 'Issued to Ravi Kumar under Work Order WO-2026-091'
    },
    {
      id: uuidv4(),
      materialCode: 'PCB-12W-FR4',
      materialName: '12W LED Star MCPCB (Lumileds 2835 Chipset)',
      transactionType: 'PO_RECEIPT',
      quantity: 1000,
      balanceAfter: 5700,
      referenceNumber: 'INV-2026-9812',
      department: 'Raw Material Stores & Logistics',
      employeeName: 'Ramesh Sharma',
      remarks: 'Supplier delivery from Lumileds India (Inv: INV-2026-9812, Lot: LOT-LM-865-B4)'
    },
    {
      id: uuidv4(),
      materialCode: 'DRV-12W-IC',
      materialName: '12W Constant Current Isolated Driver (HPF)',
      transactionType: 'RTV_RETURN',
      quantity: -50,
      balanceAfter: 2150,
      referenceNumber: 'DN-2026-042',
      department: 'Quality Assurance & Testing',
      employeeName: 'Dr. Vikram Malhotra',
      remarks: 'RTV to Delta Electronics under Debit Note DN-2026-042 (Power factor < 0.90)'
    }
  ];

  for (const sl of realLedgers) {
    await ledgerRepo.save(ledgerRepo.create(sl as any));
  }
  console.log(`✅ Seeded ${realLedgers.length} real stock ledger records into MySQL.`);

  console.log('\n=========================================');
  console.log('🎉 REAL EIFFEL MANUFACTURING DATABASE SEED COMPLETE!');
  console.log('=========================================');

  await AppDataSource.destroy();
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
