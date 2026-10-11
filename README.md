# MIPS — Manufacturing Intelligence & Production System
### Full-Stack Manufacturing ERP for LED Lighting Manufacturing
**Company:** Eiffel LED Lighting Pvt. Ltd.  
**Tech Stack:** React 18 + Vite + TypeScript (Frontend) | Node.js + Express + TypeScript + MySQL (Backend)

---

## 🚀 Repository Structure

```text
misp/
├── MISP-FE/                 # Frontend: React 18, Vite, TailwindCSS, Zustand, Radix UI
├── MISP-BE/                 # Backend: Node.js, Express, TypeScript, TypeORM, MySQL
├── MIPS_DOCUMENTATION.md    # Complete Technical Documentation & Phase 2/3/4 Roadmap
├── MIPS_USER_MANUAL.md      # Detailed Role-Wise User Manual & Operational Workflows
└── README.md                # Project Overview & Quick Start
```

---

## 🛠️ Quick Start

### 1. Frontend (MISP-FE)
```bash
cd MISP-FE
npm install
npm run dev
```
Runs at: **http://localhost:5174**

**Demo Login:**
- **Email:** `admin@gmail.com`
- **Password:** `Password@123`

### 2. Backend (MISP-BE)
```bash
cd MISP-BE
npm install
npm run dev
```
Runs at: **http://localhost:4001**

---

## 📦 Core Modules

1. **🏠 Executive Dashboard** (`/dashboard`) — Shift output vs Expected output, inventory health, live KPI counters.
2. **📦 Raw Material Inventory** (`/inventory`) — Flat SKU view, Group by Product BOM capacity view, Stock Ledger.
3. **🏭 Finished Goods Store (FGS)** (`/finished-goods`) — Assembled product inventory, burn-in QA status, dynamic aging alerts, batch traceability.
4. **🚚 Procurement** (`/procurement`) — Supplier Purchase Orders, Goods Received Notes (GRN), partial order fulfillment & closure.
5. **🧰 Production Kits** (`/kits`) — Material issuance from warehouse to assembly operators, accountability tracking, scrap/wastage reconciliation.
6. **🏭 Shift Production** (`/production`) — Shift logs, actual vs expected yield, labor productivity %.
7. **📤 Customer Orders & Dispatch** (`/orders-dispatch`) — Full-page 50+ item Customer PO creation, Delivery Challans, dynamic buyer registry.
8. **📈 Demand Forecast** (`/forecast`) — 4-month component requirement planning (MRP lite).
9. **👥 Workforce & RBAC** (`/employees`, `/settings`) — Role permissions, plant selection (Pune Hub & Hyderabad Hub).

---

## 📖 Documentation & Guides

- 📘 [Technical Architecture & Roadmap (MIPS_DOCUMENTATION.md)](./MIPS_DOCUMENTATION.md)
- 📗 [Detailed User Manual & Daily Checklists (MIPS_USER_MANUAL.md)](./MIPS_USER_MANUAL.md)
