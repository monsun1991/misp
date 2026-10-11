# MIPS — Manufacturing Intelligence & Production System
### Complete Application Documentation & Roadmap
**Version:** v1.0 (MVP) | **Stack:** React 18 + Vite + TypeScript + Node.js + MySQL  
**Last Updated:** October 2026 | **Industry:** LED Lighting Manufacturing (Eiffel LED Lighting Pvt. Ltd.)

---

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Module-by-Module Breakdown](#4-module-by-module-breakdown)
5. [Data Models](#5-data-models)
6. [Material Flow: Warehouse → Floor → Finished Goods](#6-material-flow-warehouse--floor--finished-goods)
7. [User Roles & Permissions](#7-user-roles--permissions)
8. [Current Status](#8-current-status)
9. [Next Phase Roadmap](#9-next-phase-roadmap)
10. [Modern UI/UX Upgrade Plan](#10-modern-uiux-upgrade-plan)
11. [Priority Matrix](#11-implementation-priority-matrix)
12. [Project File Structure](#12-project-file-structure)

---

## 1. Project Overview

MIPS is a **full-stack Manufacturing ERP system** built for small-to-medium LED lighting manufacturers. It replaces spreadsheets and disconnected WhatsApp-based workflows with a unified digital operations platform.

**Core Coverage:**
- 📦 Raw Material Inventory & Stock Ledger (warehouse + floor + workers)
- 🛒 Procurement (Supplier POs, GRN, Partial Close)
- 🏭 Production Floor: Kit Issuance, Assembly, Reconciliation
- 📊 Labour Productivity & Worker Accountability
- 📤 Customer Sales POs & Outward Dispatch (Delivery Challans)
- 📈 Demand Forecasting & Reorder Recommendations
- 👥 Employee & Department Management
- 📝 Reports, Audit Logs, and Role-Based Access Control

**Primary Users:**
| Role | Primary Activities |
|------|--------------------|
| Owner / Admin | Dashboard overview, all reports, approvals |
| Production Manager | Plan batches, issue kits, track output |
| Store Manager | GRN receipts, kit issuance, stock adjustments |
| Supervisor | Operator oversight, kit reconciliation |
| Dispatch Officer | Customer PO management, delivery challans |
| Accountant | Reports, procurement view, invoice tracking |
| Operator / Worker | View issued kits, log own production |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                        │
│  MIPS Frontend — React 18 + Vite + TypeScript           │
│  Port: 5174 (dev) | Zustand State | React Query         │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP/REST (Axios)
                           │ Port: 4001
┌──────────────────────────▼──────────────────────────────┐
│                   MIPS BACKEND                          │
│  Node.js + Express + TypeScript                         │
│  JWT Auth | TypeORM | Helmet | Morgan | Compression     │
└────────────────┬────────────────────────┬───────────────┘
                 │                        │
     ┌───────────▼──────────┐  ┌──────────▼─────────────┐
     │  MySQL 8 Database    │  │  Redis Cache (Optional) │
     │  DB: misp            │  │  Port: 6379             │
     │  Port: 3306          │  └────────────────────────┘
     └──────────────────────┘
```

**Frontend State Management:**
- **Zustand** (`useMipsStore.ts`) — Primary manufacturing data store (~2857 lines, localStorage-persisted)
- **useAuthStore.ts** — JWT authentication state
- **useDarkModeStore.ts** — Theme preference
- **useNotificationStore.ts** — App notifications

---

## 3. Tech Stack

### Frontend (MISP-FE)
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| Vite | 6.3.5 | Build Tool & Dev Server |
| TypeScript | 5.8.3 | Type Safety |
| Tailwind CSS | 4.1.13 | Utility-first Styling |
| Zustand | 5.0.8 | State Management |
| React Router DOM | 7.6.1 | Client-side Routing |
| Recharts | 2.15.3 | Charts & Graphs |
| React Hook Form | 7.56.4 | Form Management |
| Zod | 3.25.42 | Schema Validation |
| TanStack Query | 5.90.2 | Server State & Caching |
| TanStack Table | 8.21.3 | Advanced Data Tables |
| TanStack Virtual | 3.13.12 | Virtual scrolling |
| Radix UI | Various | Accessible UI Primitives |
| Lucide React | 0.475.0 | Icon Library |
| jsPDF + AutoTable | 4.1.0 | PDF Export |
| ExcelJS / XLSX | 4.4.0 | Excel Export |
| DnD Kit | 6.3.1 | Drag & Drop |
| Socket.io-client | 4.8.3 | Real-time (prepared) |
| Firebase | 12.1.0 | Push Notifications (prepared) |

### Backend (MISP-BE)
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API Server |
| TypeScript | Type Safety |
| TypeORM | Database ORM |
| MySQL 8 | Primary Database |
| Redis | Session/Cache (optional) |
| JWT | Authentication |
| Helmet | Security Headers |
| Morgan | HTTP Request Logging |
| Compression | Response Compression |

---

## 4. Module-by-Module Breakdown

### 4.1 🏠 Dashboard (`/dashboard`)
Real-time executive overview of factory operations.

**Key Widgets:**
- KPI Cards: Total Open Orders, Inventory Value, Active Workers, Floor Rejection Rate
- Production Bar Chart: Expected vs. Actual Output (by shift/day)
- Inventory Health: Stock level alerts — Critical / Low / Normal / Surplus
- Top Worker Leaderboard: Productivity percentage ranking
- Procurement Pipeline: Pending PO deliveries
- 4-Month Forecast Horizon: Material demand prediction chart

---

### 4.2 📦 Inventory (`/inventory`)
Real-time raw material stock tracking across warehouses, floors, and workers.

**Tabs:**
1. **Stock List (Flat View)** — All materials with current stock, safety stock, warehouse location
2. **Grouped by Product (BOM View)** — Group subparts under parent products, shows max assembly capacity & bottleneck detection
3. **Stock Ledger** — Full audit trail: GRN IN, Kit Issue OUT, Return IN, Scrap OUT, Adjustment

**Key Columns:**
| Column | Description |
|--------|-------------|
| Material Code | Unique SKU / Item code |
| Warehouse | Assigned store location |
| Current Stock | Units currently in warehouse |
| Floor Stock (With Workers) | Units issued to shop floor operators |
| Rejections | Units scrapped / rejected |
| Safety Stock | Minimum reorder level |
| Lot / Batch # | Business ID / Traceability |
| Status | Critical / Low / Normal / Surplus |

**Actions:**
- Record Stock Inward (GRN without formal PO)
- Record Stock Outward (write-off, internal transfer)
- Stock Adjustment (with supervisor authorization)

---

### 4.3 🛒 Procurement (`/procurement`)
Manage supplier Purchase Orders (POs) and Goods Received Notes (GRNs).

**PO Status Flow:**
```
Draft → Ordered → In Transit → Partially Received → Received / Closed
```

**Key Features:**
- Partial GRN: If received qty < ordered qty → auto-update to `Partially Received`
- Close PO Button: Manually close when remaining supplier qty won't arrive
- GRN Inspection Modal: Shows Ordered Qty, Already Received, Pending Inbound
- Auto Stock Update: On GRN confirmation, `currentStock` in Inventory increases
- Stock Ledger Entry: Every GRN creates an IN entry in the ledger

---

### 4.4 📅 Forecast (`/forecast`)
Demand-driven Material Requirement Planning (MRP lite).

**How It Works:**
1. User sets Monthly Planned Production Units
2. System iterates all products and their BOMs
3. Calculates required raw material quantities for the planned volume
4. Compares against current stock levels
5. Generates Recommended Purchase Quantities with urgency ratings

---

### 4.5 🧰 Kits & Worker Issue (`/kits`)
**PRIMARY MECHANISM** to move raw materials from warehouse to the shop floor.

**Kit Issue Process:**
1. Select Product to Assemble (e.g., 12W LED Bulb)
2. Enter Batch Quantity (e.g., 2000 units)
3. Assign Worker / Operator + Department / Assembly Line
4. System auto-calculates BOM materials:
   - 2000 × MCPCB = 2000 pcs
   - 2000 × HPF Driver = 2000 pcs
   - 2000 × Housing = 2000 pcs
   - 2000 × B22 Cap = 2000 pcs
5. On confirmation:
   - Warehouse stock **DECREASES** (`currentStock --`)
   - Floor stock **INCREASES** (`stockWithEmployees ++`)
   - Stock Ledger: "Kit Issue" OUT entry created
   - Worker is now **ACCOUNTABLE** for these materials

**Kit Reconciliation (after assembly):**
```
Issued (2000) = Consumed (1980) + Returned (0) + Scrap (20)
```
- 1980 good units → Finished Goods
- 20 defectives → Rejection Ledger
- Worker accountability cleared

---

### 4.6 🏭 Production (`/production`)
Log shift-level production output.

**Log Entry Fields:** Product, Date, Shift, Working Hours, Expected Qty, Actual Produced, Rejections, Waste, Operator, Supervisor

**Productivity Formula:**
```
Productivity % = (Actual Produced / Expected Production) × 100
```

---

### 4.7 📊 Productivity (`/productivity`)
Worker-level performance leaderboard.

**Per-Worker Metrics:** Total Expected vs. Actual, Productivity %, Units per Hour, Rejection Rate

---

### 4.8 📤 Orders & Dispatch (`/orders-dispatch`)
Manage customer B2B Sales POs and outward product dispatch.

**Tabs:**
1. Buyer POs — Record and track all incoming customer purchase orders
2. Dispatch Challans — Outward shipment records with e-way bill numbers
3. Buyers Directory — Registered brand clients (Havells, Crompton, Bajaj, Surya, Syska, Orient, Wipro)

**Customer PO Creation (Full-Page, supports 50+ line items):**
- Dynamic buyer dropdown (registered buyers + "Others" for new buyers)
- Auto-fill GSTIN, city from buyer registry
- Full-width high-capacity line items table
- Bulk row actions: +5 Rows, +10 Rows, Prefill 50 Items
- Live valuation: Total Lines | Total Units | Consignment Value (₹)
- Sticky bottom action bar with running totals
- Document attachment (PO scan/PDF)

**Customer PO Status Flow:**
```
Pending Dispatch → Partially Dispatched → Fully Dispatched / Closed
```

**Dispatch:** Generate Delivery Challan with transporter, vehicle no., E-Way Bill number

---

### 4.9 🗂️ Masters (`/masters`)
Reference data management — foundation of all manufacturing logic.

**Tabs:** Products, Bill of Materials (BOM), Raw Materials, Suppliers, Warehouses

---

### 4.10 👥 Employees (`/employees`)
Workforce directory with roles, departments, skills, and attendance status.

---

### 4.11 ⚙️ Settings (`/settings`)
Factory configuration: Company Profile, Plant Locations, Roles & Permissions, Shift Timings, Quality Thresholds

---

### 4.12 👤 Users & Access (`/users`)
User account management and permission assignment (RBAC).

---

### 4.13 📑 Reports (`/reports`)
Export data to CSV/Excel/PDF: Inventory, Purchase Orders, Production Yield, Dispatch Register

---

## 5. Data Models

```typescript
Material {
  id, code, name, category, warehouse, plant
  currentStock, safetyStock, standardCost, uom
  stockWithEmployees, rejections, leadTimeDays
}

Product {
  id, code, name, category, wattage
  standardCost, bom: BOMItem[]
}

PurchaseOrder {
  id, poNumber, supplier, plant
  status: 'Draft' | 'Ordered' | 'In Transit' | 'Partially Received' | 'Received' | 'Closed'
  items: POItem[], totalAmount, expectedDeliveryDate
}

GRNEntry {
  id, grnNumber, poNumber, plant, receivedDate
  items: GRNItem[], inspectedBy, warehouse
}

ProductionKit {
  id, kitNumber, productId, productName, plant
  plannedBatchQty, assignedEmployee, supervisor, department
  status: 'Issued' | 'In Production' | 'Closed'
  items: KitItem[], createdDate, issueDate, closedDate
}

KitItem {
  materialId, materialCode, materialName
  bomQtyPerUnit, totalIssuedQty
  consumedQty, returnedQty, wastageQty, balanceWithEmployee
}

ProductionLog {
  id, orderNo, productId, productName, plant, date, shift
  operator, supervisor, workingHours
  targetQty, actualQty, rejectedQty, wasteQty
  unitsPerHour, productivityPct
}

CustomerPO {
  id, customerPoNumber, customerName, customerGst
  billingCity, plant, status, poDate, expectedDispatchDate
  items: CustomerPOItem[], totalAmount, totalDispatchedQty
}

StockLedgerEntry {
  id, date, materialId, materialCode, materialName
  transactionType: 'GRN Receipt' | 'Kit Issue' | 'Material Return' | 'Scrap/Write-off' | 'Adjustment'
  referenceNo, warehouse, plant
  inQty, outQty, balanceQty, user, notes
}
```

---

## 6. Material Flow: Warehouse → Floor → Finished Goods

```
SUPPLIER
   │  Purchase Order (PO)
   ▼
[GOODS RECEIVED NOTE — GRN]
   │  → Warehouse currentStock INCREASES
   │  → Stock Ledger: "GRN Receipt" IN entry
   ▼
WAREHOUSE (Raw Material Store)
   │  currentStock: materials stored in bins/racks
   │
   │  Kit Issuance (Material Issue Note / MIN)
   │  Store Manager issues kit → assigns to worker
   ▼
SHOP FLOOR (With Worker)
   │  currentStock DECREASES
   │  stockWithEmployees INCREASES
   │  Stock Ledger: "Kit Issue" OUT entry
   │  → Worker is ACCOUNTABLE for these materials
   │
   │  Assembly / Production process
   ▼
[KIT RECONCILIATION]
   │
   ├── Good Units Produced (e.g., 1980 bulbs)
   │      → Finished Goods store INCREASES
   │      → Production Log created
   │
   ├── Defectives / Rejections (e.g., 20 bulbs)
   │      → Rejection Ledger entry
   │      → Material rejections counter INCREASES
   │
   └── Unused Material Returned
          → Warehouse currentStock INCREASES
          → stockWithEmployees DECREASES
          → Stock Ledger: "Material Return" IN entry
   ▼
FINISHED GOODS STORE
   │  Ready for customer dispatch
   ▼
CUSTOMER DELIVERY
   Delivery Challan (DC) generated
   E-Way Bill logged
   Customer PO status → Fully Dispatched
```

### Stock Visibility by Stage

| Location | System Field | Meaning |
|----------|-------------|---------|
| Warehouse | `currentStock` | Safe in racks, not yet issued |
| Shop Floor | `stockWithEmployees` | Issued to worker, in assembly |
| Rejected | `rejections` | Damaged/scrapped, cannot be used |
| Inbound (PO) | `pendingQty` in PO | Ordered, not yet arrived |
| Dispatched | `totalDispatchedQty` in CustomerPO | Shipped to buyer |

---

## 7. User Roles & Permissions

| Role | Key Permissions |
|------|----------------|
| Admin | Full access — all modules |
| Store Manager | Inventory, GRN, Kit Issue, Stock Adjustment |
| Production Manager | BOM, Kit creation, Production logging |
| Supervisor | Kit reconciliation, Operator oversight |
| Dispatch Officer | Customer POs, Delivery Challans |
| Accountant | Reports, Procurement view |
| Operator | View own kits, log production |

---

## 8. Current Status

### ✅ Implemented & Working

| Feature | Status |
|---------|--------|
| JWT Authentication (Login/Logout) | ✅ Done |
| Multi-plant selection & filtering | ✅ Done |
| Dark/Light mode | ✅ Done |
| Dashboard with KPI cards & charts | ✅ Done |
| Raw Material Inventory (Flat + BOM Group view) | ✅ Done |
| Stock Ledger (full audit trail) | ✅ Done |
| Supplier POs (create, track, GRN) | ✅ Done |
| Partial GRN & PO Partial Close | ✅ Done |
| Demand Forecasting / MRP lite | ✅ Done |
| Production Kit Issuance | ✅ Done |
| Kit Reconciliation (Consumed/Returned/Scrap) | ✅ Done |
| Production Shift Logging | ✅ Done |
| Productivity Leaderboard | ✅ Done |
| Customer Sales PO (Full-Page, 50+ items) | ✅ Done |
| Delivery Challan & Dispatch | ✅ Done |
| Buyers Directory | ✅ Done |
| Masters (Products, BOM, Materials, Suppliers) | ✅ Done |
| Employee Directory | ✅ Done |
| RBAC (Roles & Permissions) | ✅ Done |
| Reports & CSV Export | ✅ Done |
| Audit Logs | ✅ Done |
| Landing Page with ROI Calculator | ✅ Done |

### ⚠️ Partially Implemented

| Feature | Status |
|---------|--------|
| Backend API integration (FE uses Zustand/localStorage) | ⚠️ Partial |
| Real-time socket updates | ⚠️ Prepared, not wired |
| PDF export (Delivery Challan) | ⚠️ Modal preview only |
| Firebase push notifications | ⚠️ Package installed, not configured |

---

## 9. Next Phase Roadmap

### 🔴 Phase 2 — Core Logic (HIGH PRIORITY)

#### 2.1 Warehouse → Floor Movement (Standalone MIN)
> **Problem:** Currently only Kits move stock. Need standalone non-production transfers.

- [ ] **Standalone Material Issue Note (MIN)** — Transfer materials between warehouses without a production kit
  - From: Main Raw Material Store → To: Southern Staging Store → To: Assembly Floor
  - Reason codes: Internal Transfer / Quality Isolation / Return to Supplier
- [ ] **Warehouse-to-Warehouse Transfer Module** — Move stock between physical locations with authorization
- [ ] **QR Code / Barcode Scanning** — Scan material QR to auto-fill issue voucher (mobile camera)
- [ ] **Digital Receiver Sign-off** — Receiver and issuer name + timestamp confirmation
- [ ] **Transfer Voucher Print** — Printable internal transfer document

#### 2.2 Finished Goods Inventory Module (FGS)
> **Status:** ✅ **Implemented & Live (v1.1)**
> Complete operational loop: Kit Reconciliation → Finished Goods Store (FGS) → Customer Sales Dispatch.

- [x] **FGS (Finished Goods Store) Module** (`/finished-goods` + Inventory Tab)
  - Dedicated storage tracking for completed LED luminaires
  - Shows: Product SKU, Batch/Lot #, Origin Kit #, Qty On Hand, Allocated Qty, Available to Ship
  - Dynamic Aging Indicators: Fresh (≤7d), Normal (≤21d), Aging Alert (>21d)
  - QA Status controls: Ready for Dispatch / Under QC / Quarantine / Depleted
- [x] **Automatic Inward from Assembly Kits**: When a Production Kit is reconciled and closed, good units automatically deposit into FGS with batch code `LOT-FG-<KIT_NUM>`
- [x] **FGS → Customer PO Dispatch Link**: Dispatching against Customer POs deducts stock from FGS (FIFO batch allocation)
- [x] **Live In-Stock Visibility**: Sales PO creation and Dispatch modal display real-time FGS available quantity
- [x] **FGS Movement Ledger**: Tamper-proof audit trail of every inward, dispatch, and adjustment
- [x] **Batch & Lot Traceability Modal**: Drill down into assembly kit, operator, and QA inspection notes

#### 2.3 PO & GRN Improvements
- [ ] **GRN Quality Inspection** — Inspector name, accepted qty vs. rejected qty per GRN line item
- [ ] **Return to Vendor (RTV)** — When GRN material is rejected, generate RTV document for supplier
- [ ] **PO Amendment History** — Track every change to a PO (qty, price, delivery date)
- [ ] **Supplier Delivery Schedule** — Expected delivery date per PO line item with calendar view

#### 2.4 Production Planning
- [ ] **Production Work Order (PWO)** — Formal work order:
  ```
  Customer PO → Production Plan → PWO → Kit Issue → Production → FGS
  ```
- [ ] **Daily/Weekly Production Schedule** — Calendar view of what to produce and how many
- [ ] **Line Capacity Planning** — Check if assembly line can meet production plan in given days
- [ ] **Short-supply Alert** — Before issuing kit, alert if any BOM material is below required quantity

---

### 🟡 Phase 3 — Financial & Commercial Layer (MEDIUM PRIORITY)

#### 3.1 Costing & Margin Analysis
- [ ] **Batch Cost Analysis** — Material cost per production run (BOM actual consumption × unit cost)
- [ ] **Standard vs. Actual Cost Variance** — Alert when actual consumption exceeds BOM standard
- [ ] **Sales Order Profitability** — Customer PO value vs. cost of goods → Gross Margin per order
- [ ] **Finished Goods Valuation** — Weighted average cost per finished product

#### 3.2 Invoice & Payment Tracking
- [ ] **GST Tax Invoice Generator** — Auto-compute CGST / SGST / IGST from Delivery Challan
- [ ] **E-Invoice (IRN)** — Integration with GST portal API
- [ ] **Payment Received Tracking** — Mark invoices paid / outstanding / overdue
- [ ] **Accounts Receivable Aging** — 30/60/90 day buckets per customer
- [ ] **Supplier Invoice Matching** — Match GRN to supplier invoice (3-way match: PO + GRN + Invoice)

#### 3.3 Enhanced Customer Management
- [ ] **Customer Credit Limit** — Block dispatch if customer exceeds credit limit
- [ ] **Customer Order History** — Full order history with item-level drill-down
- [ ] **Customer Statement of Account** — Monthly statement of POs, dispatches, invoices, payments

---

### 🟢 Phase 4 — Advanced Operations (FUTURE)

#### 4.1 Quality Control (QC)
- [ ] **Incoming Quality Check (IQC)** — Test plan on GRN items before accepting into stock
- [ ] **In-Process Quality Check (IPQC)** — Mid-assembly inspection checkpoints
- [ ] **Final Quality Check (FQC)** — Before packing into finished goods
- [ ] **Defect Classification** — Codes: Soldering defect, PCB burn, Housing crack, Driver failure
- [ ] **QC Dashboard** — Pass rate trends, defect Pareto chart

#### 4.2 Machine & Asset Management
- [ ] **Machine Registry** — SMT machines, soldering stations, testing jigs, pick-and-place
- [ ] **Preventive Maintenance Schedule** — Service dates, downtime tracking
- [ ] **Machine-linked Production Logs** — Which machine produced which batch?

#### 4.3 HR & Incentives
- [ ] **Attendance & Leave Management**
- [ ] **Shift Scheduling** — Assign operators to shifts from a weekly calendar
- [ ] **Incentive Calculation** — Productivity > 100% = bonus trigger
- [ ] **Training & Certification Tracking** — Which operators are certified on which machines

#### 4.4 Supplier Relationship Management
- [ ] **Supplier Performance Scorecard** — On-time delivery %, quality rejection %
- [ ] **Supplier Price History** — Track component price changes over time
- [ ] **Supplier Contract & MOQ Tracking**

---

## 10. Modern UI/UX Upgrade Plan

### 🎨 10.1 Design System Overhaul

| Current | Target |
|---------|--------|
| Inline Tailwind classes | Design tokens & CSS variables |
| Basic shadow cards | Glassmorphism with backdrop-blur |
| Static tables | Virtual-scroll data grids |
| No keyboard shortcuts | Full keyboard-first navigation |
| Generic loading spinner | Content-aware Skeleton loaders |

**Key additions:**
- [ ] **Command Palette (Ctrl+K / ⌘K)** — Search any module, navigate instantly (like Linear, Notion, GitHub)
- [ ] **Skeleton Loading States** — Every table loads with shimmer skeleton before data arrives
- [ ] **Rich Toast Notifications** — With Undo action, success/error/warning variants
- [ ] **Empty State Illustrations** — Every empty list gets an illustration + CTA button
- [ ] **Animated KPI Counters** — Numbers animate from 0 → value on dashboard load
- [ ] **Keyboard Shortcuts** — `?` opens a shortcuts reference modal
- [ ] **Breadcrumb Navigation** — Always show current location path

### 🖥️ 10.2 Dashboard Upgrade
- [ ] **Resizable / Draggable Widgets** — Customize dashboard layout (DnD Kit already installed)
- [ ] **Date Range Picker** — Switch between Today / This Week / This Month
- [ ] **Production Heat Map** — Weekly intensity grid (like GitHub contribution graph)
- [ ] **Live Shift Clock** — Header shows current shift name and time remaining
- [ ] **Alert Feed Panel** — Sidebar: Low stock alerts, overdue POs, pending reconciliations

### 📱 10.3 Mobile-first & Operator App
- [ ] **Mobile Operator View** — Simplified phone UI for shop floor workers:
  - 📋 View my issued kit today
  - ✅ Log production count for my shift
  - 🚨 Report a defect
  - 📷 Scan material QR code
- [ ] **Bottom Navigation Bar** on mobile (replaces sidebar on small screens)
- [ ] **Swipeable Table Rows** on mobile (swipe right to dispatch, swipe left to close)
- [ ] **PWA (Progressive Web App)** — Installable on Android/iPhone, works offline (read-only mode)

### ⚡ 10.4 Performance Upgrades
- [ ] **Virtual Scrolling** — Already have TanStack Virtual; implement for all tables > 50 rows
- [ ] **Optimistic Updates** — UI updates instantly before server response
- [ ] **Global Search** — Search across materials, POs, customers, employees from header
- [ ] **Quick Filters** — One-click chip filters (Critical Stock, Open POs, Active Workers)
- [ ] **Inline Cell Editing** — Click any table cell to edit in-place (no modal for simple edits)

### 🎯 10.5 Page-Specific UX Improvements

**Dashboard:**
- Split: Left = Operational | Right = Financial
- Click-through KPI cards open detailed drilldown modals

**Inventory:**
- Kanban board view: Cards sorted Critical → Low → Normal → Surplus
- Progress bar per material: Current / Safety Stock / Max Capacity visual
- Click stock number to adjust inline (no full modal)

**Kits:**
- Visual BOM tree (collapsible hierarchy) before issuing
- Kit timeline indicator: Issued → In Production → Reconciled
- Worker photo shown next to assigned kit

**Procurement:**
- Kanban PO Board: Drag POs between status columns
- Delivery countdown badge on In Transit POs
- Supplier performance color badge (Green/Amber/Red)

**Production:**
- Gantt Chart: Planned vs. actual across shifts
- Live production counter (operators enter count in real-time)

**Orders & Dispatch:**
- Dispatch progress ring per customer PO (% dispatched)
- Customer aging: How long since PO was placed?

---

## 11. Implementation Priority Matrix

```
HIGH IMPACT + LOW EFFORT (Do First):
  ★ Finished Goods Inventory (FGS) module
  ★ Standalone Material Transfer / MIN voucher
  ★ Virtual scrolling for large tables
  ★ Skeleton loading states everywhere
  ★ Command Palette (Ctrl+K)
  ★ PDF Delivery Challan (proper print format)
  ★ GRN Quality Inspection fields

HIGH IMPACT + HIGH EFFORT (Plan & Execute):
  ★ Backend API full integration (move off localStorage)
  ★ Production Work Order (PWO) linking Customer PO → Production
  ★ GST Sales Invoice + Payment tracking
  ★ Mobile operator app view
  ★ Real-time socket updates (live floor dashboard)
  ★ QC Module (IQC + FQC)

LOW IMPACT + LOW EFFORT (Quick Wins):
  ★ Animated KPI counters
  ★ Empty state illustrations
  ★ Breadcrumb navigation
  ★ Keyboard shortcuts reference panel
  ★ Alert feed panel on dashboard

LOW IMPACT + HIGH EFFORT (Later Phase):
  ★ Machine & asset management
  ★ Supplier performance scorecard
  ★ Customer portal
  ★ Full HR & payroll integration
  ★ E-Invoice / GST portal API
```

---

## 12. Project File Structure

```
MIPS/
├── MIPS_DOCUMENTATION.md           ← This file
├── MISP-FE/                        # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard/          # Executive dashboard
│   │   │   ├── Inventory/          # Stock management + ledger
│   │   │   ├── Procurement/        # PO & GRN
│   │   │   ├── Forecast/           # MRP / demand planning
│   │   │   ├── Kits/               # Material issue to workers
│   │   │   ├── Production/         # Shift production logging
│   │   │   ├── Productivity/       # Worker performance leaderboard
│   │   │   ├── OrdersDispatch/     # Customer POs & delivery challans
│   │   │   ├── Masters/            # Products, BOM, Suppliers
│   │   │   ├── Employees/          # Workforce management
│   │   │   ├── Settings/           # System configuration
│   │   │   ├── Users/              # Access management
│   │   │   ├── Reports/            # Export & reports
│   │   │   ├── Landing/            # Public marketing page
│   │   │   └── Login/              # Authentication
│   │   ├── store/
│   │   │   ├── useMipsStore.ts     # Main Zustand store (~2857 lines)
│   │   │   ├── useAuthStore.ts     # JWT auth state
│   │   │   ├── useDarkModeStore.ts # Theme preference
│   │   │   └── useNotificationStore.ts
│   │   ├── layouts/
│   │   │   ├── Layout.tsx          # App shell wrapper
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   └── Header.tsx          # Top bar (plant selector, notifications)
│   │   ├── components/
│   │   │   └── ui/                 # 30+ Radix UI components (shadcn/ui style)
│   │   ├── utils/
│   │   │   └── ProtectedRoute.tsx  # Auth guard
│   │   └── App.tsx                 # Route definitions
│   └── package.json
│
└── MISP-BE/                        # Backend (Node.js + Express)
    ├── src/
    │   ├── config/                 # DB connection, timezone config
    │   ├── controllers/            # Route handler logic
    │   ├── models/                 # TypeORM entities (DB tables)
    │   │   ├── user.model.ts
    │   │   ├── material.model.ts
    │   │   ├── product.model.ts
    │   │   ├── kit.model.ts
    │   │   ├── purchase-order.model.ts
    │   │   ├── production-log.model.ts
    │   │   └── stock-ledger.model.ts
    │   ├── repositories/           # Data access layer (TypeORM repos)
    │   ├── routes/                 # API route definitions
    │   │   ├── auth.route.ts       # POST /v1/auth/login, /refresh, /logout
    │   │   ├── mips.route.ts       # All manufacturing endpoints
    │   │   └── dashboard.route.ts  # Dashboard aggregation queries
    │   ├── middlewares/            # Auth guard, error handler
    │   ├── dto/                    # Data Transfer Objects
    │   ├── validations/            # Zod schemas for request validation
    │   └── utils/                  # Helper functions
    ├── .env                        # Environment config
    └── package.json
```

---

## 🔐 Security & Compliance

**Current:**
- JWT tokens (access + refresh) with 24h expiration
- Role-based API access (middleware guards)
- Helmet.js security headers
- CORS configured

**Planned:**
- [ ] Two-Factor Authentication (2FA) for Admin accounts
- [ ] Session timeout with auto-logout warning
- [ ] IP whitelisting for admin API endpoints
- [ ] Activity audit log shipped to external logging (Papertrail / Datadog)
- [ ] Database encryption at rest
- [ ] GDPR-compliant employee data export

---

## 💡 Summary: What to Build Next (In Order)

**Week 1–2 (Immediate):**
1. Finished Goods Store (FGS) module
2. Standalone MIN / Warehouse Transfer voucher
3. PDF Delivery Challan (proper A4 print format)

**Week 3–4 (Short term):**
4. GRN Quality Inspection fields
5. Virtual scrolling for all large tables
6. Skeleton loading states + Command Palette (Ctrl+K)

**Month 2 (Medium term):**
7. Production Work Order (PWO) — link Customer PO → Production Plan → Kit
8. Backend API full integration (move off Zustand localStorage)
9. Mobile operator app view

**Month 3–4 (Commercial layer):**
10. GST Tax Invoice generator
11. Payment received tracking + AR aging
12. Supplier performance scorecard

---

*Document generated: October 2026 | MIPS v1.0 — Eiffel LED Lighting Pvt. Ltd.*

