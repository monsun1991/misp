# MIPS User Manual
## Manufacturing Intelligence & Production System
### Eiffel LED Lighting Pvt. Ltd.

**Version:** 1.1 | **Application URL:** http://localhost:5174  
**Last Updated:** October 2026 | **Support:** IT Department / System Administrator

---

## 📑 Table of Contents

1. [Getting Started — Login & Navigation](#1-getting-started--login--navigation)
2. [Dashboard — Executive Overview](#2-dashboard--executive-overview)
3. [Inventory — Stock Management](#3-inventory--stock-management)
4. [Procurement — Purchase Orders & GRN](#4-procurement--purchase-orders--grn)
5. [Forecast — Demand & Material Planning](#5-forecast--demand--material-planning)
6. [Kits — Material Issue to Workers](#6-kits--material-issue-to-workers)
7. [Production — Shift Logging](#7-production--shift-logging)
8. [Dispatch & POs — Customer Orders](#8-dispatch--pos--customer-orders)
9. [Productivity — Worker Performance](#9-productivity--worker-performance)
10. [Masters — Reference Data](#10-masters--reference-data)
11. [Workforce — Employee Management](#11-workforce--employee-management)
12. [Settings — System Configuration](#12-settings--system-configuration)
13. [Reports — Exports & Analysis](#13-reports--exports--analysis)
14. [Material Flow: Warehouse to Floor to Customer](#14-material-flow-warehouse-to-floor-to-customer)
15. [Role-wise Daily Checklists](#15-role-wise-daily-checklists)
16. [Glossary of Terms](#16-glossary-of-terms)
17. [Troubleshooting & FAQs](#17-troubleshooting--faqs)

---

## 1. Getting Started — Login & Navigation

### 1.1 Logging In

1. Open your browser and go to: **http://localhost:5174**
2. The **Landing Page** appears with Eiffel LED Lighting branding.
3. Click **"Login to MIPS Platform"** or navigate directly to `/login`
4. Enter your credentials:
   - **Email:** Your registered work email
   - **Password:** Your assigned password
5. Click **"Sign In to MIPS"**

> ⚠️ If you see "Invalid credentials", contact your System Administrator to reset your password.

**Demo Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | Password@123 |

---

### 1.2 Understanding the Navigation Sidebar

After login, the **left sidebar** contains icon-based navigation. Each icon leads to a module.

| Icon | Module | Who Uses It |
|------|--------|-------------|
| 🏠 | Dashboard | Owner, Manager |
| 📦 | Inventory | Store Manager |
| 🚚 | Procurement | Purchase Manager |
| 📈 | Forecast | Planner, Manager |
| 🧰 | Kits | Store Manager, Supervisor |
| 🏭 | Production | Supervisor, Operator |
| 📤 | Dispatch & POs | Dispatch Officer |
| 🏆 | Productivity | Manager, HR |
| 🗂️ | Masters | Admin, Masters Manager |
| 👥 | Workforce | HR, Admin |
| ⚙️ | Settings | Admin only |
| 📑 | Reports | Manager, Accountant |

> 💡 The active page highlights in **dark green** with a lime-green icon.

---

### 1.3 Plant Selector (Top Right)

At the top of the screen you will see a **plant selector dropdown** (e.g., "🏭 Plant 1 – Pune Hub").

- Clicking shows all configured plant locations.
- **All data — inventory, POs, kits, production — is filtered by the selected plant.**
- Choose **"All Plants"** to see combined data across all facilities.

---

### 1.4 Dark Mode

Click the **moon/sun icon** in the top-right header to toggle:
- ☀️ Light Mode (default)
- 🌙 Dark Mode (recommended for factory floor)

---

## 2. Dashboard — Executive Overview

**Who uses this:** Owner, Factory Head, Production Manager  
**URL:** `/dashboard`

### 2.1 What You See

The Dashboard gives a **real-time snapshot** of your entire factory at a glance.

---

#### Section A: KPI Cards (Top Row)

| Card | What It Shows |
|------|--------------|
| **Open Customer Orders** | How many buyer POs are pending dispatch |
| **Raw Material Inventory Value** | Total value (₹) of stock in all warehouses |
| **Active Operators** | Workers currently tracked on the shop floor |
| **Floor Rejection Rate** | Percentage of units rejected across all batches |

**Color Codes:**
- 🟢 Green = Good / On track
- 🟡 Amber = Needs attention
- 🔴 Red = Critical, immediate action needed

---

#### Section B: Production Chart (Middle Left)

A **bar chart** showing daily production across recent shifts:
- **Grey bars** = Expected Output (planned units)
- **Green bars** = Actual Produced units
- **Red/Orange bars** = QA Rejections

**How to read it:**
- Green bars close to or exceeding Grey = productivity is on track
- Green bars much shorter than Grey = investigate delays or material shortages

**Below the chart:**
- **Expected Planned:** Total units planned for today
- **Actual Produced:** Actual units completed
- **Rejection Rate:** % of units that failed QA

> 💡 "Expected" = the planned production volume for a shift. This is always compared against actual output.

---

#### Section C: Inventory Health (Middle Right)

Shows a breakdown of raw material stock health:
- 🔴 **Critical** — Below safety stock; order immediately
- 🟡 **Low** — Below reorder level; place order soon
- 🟢 **Normal** — Sufficient stock
- 🔵 **Surplus** — Excess stock; no immediate purchase needed

Click any material in the list to go directly to its inventory details.

---

#### Section D: 4-Month Forecast (Bottom Right)

Shows which materials will run out in the next 4 months based on planned production volume. Red rows = materials that need to be ordered now.

---

## 3. Inventory — Stock Management

**Who uses this:** Store Manager, Warehouse Incharge, Inventory Controller  
**URL:** `/inventory`

### 3.1 Understanding the Three Tabs

| Tab | Purpose |
|-----|---------|
| **Inventory List** | Flat view of all raw materials and their stock levels |
| **Grouped by Product (BOM View)** | Subparts grouped under each finished product |
| **Stock Ledger** | Full audit trail of every stock movement |

---

### 3.2 Tab 1: Inventory List (Flat View)

This is the main stock view. Each row = one raw material.

**Column Guide:**

| Column | What It Means |
|--------|--------------|
| Material Code | Unique ID (e.g., MCPCB-12W-AL) |
| Material Name | Full description |
| Category | Raw / Packaging / Consumable / Spare |
| Warehouse | Which store the material is in |
| Current Stock | Units currently in the warehouse |
| Floor Stock | Units issued to workers on the assembly floor |
| Rejections | Units scrapped / rejected so far |
| Safety Stock | Minimum level below which you must reorder |
| Lot / Batch # | Business ID — unique batch identifier for traceability |
| Status | Critical / Low / Normal / Surplus (color-coded) |

**Understanding the Key Columns:**

**Current Stock** = units physically in the warehouse rack, not yet issued to any worker.

**Floor Stock (With Workers)** = units that have been issued to assembly workers via a Production Kit. These are on the shop floor, not in the warehouse. Use the **Employee Accountability tab** in Kits to see exactly which worker has which material.

**Rejections** = units that have been scrapped, failed QA, or declared unusable. These are permanently lost and cannot be used.

**Lot / Batch # (Business ID)** = the batch identifier from the supplier. This is how you trace where a material came from if there is a quality issue. Example: `LOT-LM-865-B4` tells you this is the 4th batch from supplier LM received as Lot 865.

**Status Badge Colors:**
- 🔴 **Critical** — Below safety stock. Emergency order needed.
- 🟡 **Low** — Getting close to safety level.
- 🟢 **Normal** — Stock is healthy.
- 🔵 **Surplus** — More than needed.

---

#### Searching & Filtering

- **Search bar:** Find materials by code, name, or supplier name
- **Category dropdown:** Filter All / Raw Material / Packaging / Consumable / Spare Parts
- **Warehouse dropdown:** Show stock in a specific store only

---

### 3.3 Tab 2: Grouped by Product (BOM View)

This view groups **subparts under the finished product** they belong to. This is very useful before starting production — you can see at a glance if you have enough of every component.

**Example — 12W LED Bulb:**
```
12W LED Bulb (Eiffel Prime Eco)     Max Assembly: 450 units  ← Limited by MCPCB
  ├── MCPCB-12W-AL          Available: 450 pcs   ✅
  ├── HPF-12W-Driver         Available: 890 pcs   ✅
  ├── Housing-12W-White      Available: 560 pcs   ✅
  └── B22-Aluminium Cap     Available: 1200 pcs  ✅
```

**How to use:**
1. Click on any product row to **expand** and see its BOM subparts
2. **"Max Assembly Capacity"** = how many finished units you can make right now, limited by the lowest-stock subpart
3. The **"Bottleneck"** item (shown in red) is the subpart with lowest stock that limits production
4. If a component is showing 🔴 Critical or 🟡 Low — raise a PO before issuing any Kit

> 💡 **Use this view before issuing a Production Kit** to verify all components are available.

---

### 3.4 Tab 3: Stock Ledger

Every material movement is recorded here as a permanent, tamper-proof entry.

**Transaction Types:**
| Type | Meaning |
|------|---------|
| GRN Receipt | Material received from supplier |
| Kit Issue | Material sent from warehouse to assembly worker |
| Material Return | Unused material returned by worker after job |
| Scrap / Write-off | Material declared unusable |
| Adjustment | Supervisor-authorized correction to stock count |
| Opening Stock | Initial stock entered when system was first set up |

**How to Search:**
- Search box: Find by material name, lot number, or invoice number
- Transaction Type filter: See only Kit Issues, only GRN entries, etc.

---

### 3.5 Recording Stock Inward (Without PO)

Use when you receive material urgently without a formal Purchase Order.

**Steps:**
1. Click **"+ Record Stock Movement"** (top right)
2. Select Movement Type = **"Inward / GRN"**
3. Select Material from dropdown
4. Fill in:
   - **Target Warehouse:** Where are you storing it?
   - **Inbound Category:** Purchase Receipt / Transfer In / Return from Floor
   - **Supplier Name:** Who supplied it?
   - **Invoice No.:** Supplier invoice number (for records)
   - **Lot / Batch No.:** (e.g., LOT-LM-865-B4)
   - **Unit Cost (₹):** Price per unit
5. Click **"Record Inward Stock"**

Stock count increases immediately and a ledger entry is created.

---

### 3.6 Recording Stock Outward (Write-off / Scrap)

Use when writing off damaged or expired material.

**Steps:**
1. Click **"+ Record Stock Movement"**
2. Select Movement Type = **"Outward / Issue"**
3. Select the material
4. Set outbound category = **"Scrap / Write-off"**
5. Enter quantity to remove
6. Enter Debit Note No. and reason
7. Click **"Record Outward Stock"**

---

### 3.7 Stock Adjustment

Use when a physical count reveals a discrepancy (e.g., system shows 500 pcs, physical count shows 480 pcs).

**Steps:**
1. Click **"+ Record Stock Movement"**
2. Select **"Adjustment"** type
3. Enter Adjustment Quantity (positive or negative)
4. Enter **Authorizing Person** (supervisor who approved this)
5. Enter detailed **Reason** (e.g., "Physical audit — 20 pcs short, mouse trap damage in Rack B3")
6. Click **"Save Adjustment"**

> ⚠️ Adjustments are permanent and audit-logged. Always get supervisor approval before adjusting stock.

---

### 3.8 Finished Goods Store (FGS) & Quality Staging

**URL:** `/finished-goods` or click the **"Finished Goods (FGS)"** tab in Inventory.

The **Finished Goods Store (FGS)** tracks completely assembled, boxed LED products ready to be shipped to B2B customers.

#### Key Features:
1. **Automatic Inward from Assembly Kits**:
   - When a Supervisor reconciles and closes a Production Kit, the good units produced automatically deposit into FGS with batch ID `LOT-FG-<KIT_NUMBER>`.
2. **On Hand vs. Allocated vs. Available**:
   - **On Hand**: Total physical units in the warehouse.
   - **Allocated**: Units reserved against pending Customer Purchase Orders.
   - **Available to Ship**: Units free for new dispatch commitments (`On Hand - Allocated`).
3. **Aging Tracker**:
   - 🟢 **Fresh** (≤ 7 days since manufacture)
   - 🔵 **Normal** (≤ 21 days)
   - ⚠️ **Aging Alert** (> 21 days): Needs FIFO dispatch priority.
4. **QA Status Controls**:
   - Ready to Ship / Under QC / Quarantine / Depleted.
5. **Customer Dispatch Deductions**:
   - Generating a Delivery Challan in **Dispatch & POs** automatically deducts stock from FGS and creates a ledger entry.

---

## 4. Procurement — Purchase Orders & GRN

**Who uses this:** Purchase Manager, Store Manager  
**URL:** `/procurement`

### 4.1 Overview

The Procurement module handles:
- Raising Purchase Orders (POs) to suppliers
- Receiving goods via Goods Received Notes (GRNs)
- Tracking partial deliveries
- Closing POs manually when remaining goods won't arrive

---

### 4.2 Reading the PO List

The main table shows all Purchase Orders sorted by date.

**Status Meanings:**
| Status | Color | Meaning |
|--------|-------|---------|
| Draft | Grey | PO created but not yet sent to supplier |
| Ordered | Blue | PO sent to supplier, waiting for delivery |
| In Transit | Purple | Supplier confirmed shipment |
| Partially Received | Amber | Some goods received, more pending |
| Received | Green | All goods received fully |
| Closed | Dark Grey | Manually closed (some items not delivered) |
| Delayed | Red | Delivery date has passed, goods not received |

---

### 4.3 Creating a New Purchase Order

**Steps:**
1. Click **"+ Raise Purchase Order"** (lime green button, top right)
2. Fill in the form:
   - **Select Material:** Choose from approved materials list
   - **Approved Supplier:** Auto-filled from material master; can be changed
   - **Order Quantity:** How many units to order (e.g., 5000 pcs)
   - **Unit Rate (₹):** Negotiated price per unit
   - **Expected Delivery Date (ETA):** When you expect the goods
3. Click **"Create Purchase Order"**
4. The PO appears in the list with status **"Ordered"**

> 💡 One PO supports one material line. For multiple materials, raise separate POs.

---

### 4.4 Processing a Goods Received Note (GRN)

When a supplier delivers goods, you must record a GRN to bring stock into the system.

**Steps:**
1. Find the relevant PO in the list
2. Click **"Record GRN"** (green button on the PO row)
3. The GRN form opens showing:
   - PO number, supplier, material details
   - **Ordered Qty**, **Already Received**, **Pending Inbound**
4. Fill in:
   - **Accepted Qty:** Units that passed visual / physical inspection
   - **Rejected Qty:** Units that are clearly damaged
   - **Damaged Qty:** Units that are borderline / conditionally accepted
   - **Destination Warehouse:** Where to store the accepted goods
   - **Inspection Notes:** e.g., "Visual inspection passed; voltage test verified"
5. Click **"Confirm GRN & Add to Stock"**

**What happens automatically:**
- ✅ `Accepted Qty` is added to the selected warehouse's stock
- ✅ A "GRN Receipt" entry is created in the Stock Ledger
- ✅ PO status updates to `Partially Received` or `Received` based on totals

---

### 4.5 Partial Delivery Handling

If a supplier delivers only part of the order:

**Example:** PO for 5000 MCPCBs. Supplier delivers 3000 today.
1. Enter GRN for 3000 (Accepted Qty = 3000)
2. PO status automatically changes to ⚠️ **Partially Received**
3. PO row shows: Received 3,000 / 5,000 units
4. Record another GRN when remaining 2,000 arrive

**Checking which POs are partially received:**
- Use the **Status filter** dropdown and select "Partially Received"
- All partially received POs will appear with a ⚠️ amber badge
- The PO row shows exactly how many units have been received vs. ordered

---

### 4.6 Closing a PO Manually

When the remaining items from a PO will never arrive (supplier confirmed they can't deliver the balance):

**Steps:**
1. Find the PO with status "Partially Received" or "Ordered"
2. Click the **"Close PO"** button on that PO row
3. Status changes permanently to **"Closed"**

> ⚠️ **Important:** Closing a PO is permanent. The undelivered quantity is written off. Use only when the supplier confirms they cannot supply the balance quantity.

**When would you close a PO?**
- Supplier is out of stock and cannot backfill
- You found an alternate supplier and raised a new PO
- Customer order was cancelled and you no longer need the balance

---

### 4.7 KPI Cards on Procurement Page

| Card | What It Shows |
|------|--------------|
| Total Active POs | Open orders not yet fully received |
| Pending Delivery Value | Total ₹ value of goods not yet received |
| Suppliers Active | Number of suppliers with open POs |

---

## 5. Forecast — Demand & Material Planning

**Who uses this:** Production Manager, Purchase Manager  
**URL:** `/forecast`

### 5.1 Purpose

The Forecast module answers: **"If I plan to produce X units this month, which materials will run out — and when?"**

---

### 5.2 Setting Production Volume

At the top of the page:
1. Find the **"Monthly Production Volume"** input
2. Enter how many finished goods you plan to produce (e.g., 10,000 units)
3. The table below automatically recalculates

---

### 5.3 Reading the Forecast Matrix

| Column | Meaning |
|--------|---------|
| Material | Name and code |
| Current Stock | Units in warehouse right now |
| Required (Next Month) | Units needed based on your production plan |
| Gap / Surplus | Positive = you have extra; Negative = you need to order |
| Recommended Purchase Qty | How many to buy to cover 4 months safely |
| Urgency | 🔴 Critical / 🟡 Order Soon / 🟢 Sufficient |

Rows highlighted in red = materials that will run out before month end at the planned rate. These need **immediate purchase orders**.

---

### 5.4 Using Forecast Output

1. Note all materials marked **Critical** or **Order Soon**
2. Go to **Procurement** and raise Purchase Orders for those materials
3. Come back next week to check updated status

---

## 6. Kits — Material Issue to Workers

**Who uses this:** Store Manager, Supervisor  
**URL:** `/kits`

This is the **most important module** for factory operations. A "Kit" is the official record of which raw materials were given to which worker for which production batch.

### 6.1 Understanding the Kit Lifecycle

```
ISSUE KIT → Worker assembles on floor → RECONCILE KIT → Close Kit
```

- **Kit Status: Issued** — Materials given to the worker. Work hasn't started or is in progress.
- **Kit Status: In Production** — Work in progress, consumption being tracked.
- **Kit Status: Closed** — Job done. All materials accounted for (Consumed + Returned + Scrap = Issued).

---

### 6.2 Issuing a New Production Kit

**Steps:**
1. Click **"+ Issue New Production Kit"** (lime green button, top right)
2. Fill in the form:

   **Select Product to Assemble**
   - Choose from dropdown (e.g., Eiffel 12W Prime Eco LED Bulb B22)
   - BOM subparts are auto-loaded based on your selection

   **Batch Output Quantity**
   - How many finished units is this worker supposed to produce?
   - Example: 2000 units
   - The system auto-calculates material quantities:
     - 2000 × MCPCB = 2000 pcs to issue
     - 2000 × Driver = 2000 pcs to issue
     - 2000 × Housing = 2000 pcs to issue
     - 2000 × B22 Cap = 2000 pcs to issue

   **Production Department**
   - Select the assembly line (e.g., Final Assembly Line 1)

   **Assign to Operator / Worker**
   - Select the worker from dropdown (e.g., Ravi Kumar — Line Operator)
   - **This worker is now responsible for these materials**

   **Responsible Supervisor**
   - Who is overseeing this kit?

3. Click **"Issue Production Kit"**

**What happens automatically:**
- ✅ Raw material stock **decreases** in the warehouse (`currentStock --`)
- ✅ Floor stock **increases** (`stockWithEmployees ++`)
- ✅ Stock Ledger: "Kit Issue" OUT entry created
- ✅ Kit card appears in Kits list with status **"Issued"**
- ✅ Worker appears in Employee Accountability tab with quantity they hold

---

### 6.3 Checking What Materials are With Which Worker

Use the **"Employee Material Ledger"** tab on the Kits page to answer:

**"How can I check if I gave an employee 2000 bulbs worth of material?"**

1. Go to **Kits** → click **"Employee Material Ledger"** tab
2. Find the worker's name in the table
3. The table shows:
   - Which Kit number was issued to them
   - Which materials they hold (MCPCB, Driver, Housing, etc.)
   - How many units of each material
   - Date issued

**"What if 20 subparts are defective — how do I record that?"**

During Kit Reconciliation (after assembly), you enter the defective count as "Wastage/Scrap". Example:
- Issued: 2000 bulbs worth of material
- Good units produced: 1980
- Defectives/Scrap: 20
- The system records: 2000 = 1980 (consumed) + 0 (returned) + 20 (scrapped)

---

### 6.4 Reconciling a Kit (After Assembly)

When the worker completes the batch, the Supervisor must reconcile the kit.

**Steps:**
1. Find the kit card (status = "Issued" or "In Production")
2. Click **"Reconcile Kit"** (blue/indigo button)
3. Reconciliation form opens. For each material, enter:

   | Field | What to Enter |
   |-------|--------------|
   | **Consumed (Output)** | Material used in production (e.g., 1980 pcs → made 1980 good bulbs) |
   | **Returned (Unused)** | Leftover material returned to store (e.g., 0 pcs) |
   | **Wastage / Scrap** | Material damaged during process (e.g., 20 cracked/burnt) |

4. System shows a **balance check**: `Issued = Consumed + Returned + Wastage`
   - 2000 = 1980 + 0 + 20 ✅ → Kit closes cleanly
   - If it doesn't balance → Enter Supervisor Approval Notes explaining discrepancy

5. Click **"Close & Reconcile Kit"**

**What happens automatically:**
- ✅ Kit status changes to **"Closed"**
- ✅ Returned material goes back to warehouse stock
- ✅ Floor stock (`stockWithEmployees`) reduces
- ✅ 20 scrap units logged in Rejection counter on the material
- ✅ Production record updated

---

### 6.5 KPI Cards on Kits Page

| Card | Meaning |
|------|---------|
| Active Kits | Kits currently issued (In Production or Issued status) |
| Workers on Floor | Employees with active issued kits |
| Kits Closed | Completed and reconciled kits |

---

## 7. Production — Shift Logging

**Who uses this:** Supervisor, Production Manager, Operators  
**URL:** `/production`

### 7.1 Purpose

After a shift ends, the Supervisor logs how many units were actually produced, how many were rejected, and who produced them.

---

### 7.2 Reading the Production Log Table

Each row = one shift's production record.

**Columns:**
| Column | Meaning |
|--------|---------|
| Date & Shift | When the production happened (Morning / Evening / Night) |
| Order # | System-generated production order ID |
| Product Name | What was being manufactured |
| Operator / Worker | Who worked on it |
| Expected | How many units were planned for this shift |
| Actual Produced | How many units were actually completed |
| Rejections | Units that failed quality check |
| Units / Hr | Output rate (Actual ÷ Hours worked) |
| Productivity | % = (Actual ÷ Expected) × 100 |

**Productivity % Color Codes:**
- 🟢 Green = ≥ 100% — Worker met or exceeded expected output
- 🟡 Amber = < 100% — Worker produced less than expected

---

### 7.3 Logging a New Production Entry

**Steps:**
1. Click **"+ Log Production Entry"** (top right)
2. Fill in:

   - **Select Manufactured Product:** e.g., Eiffel 18W Slim Batten CCT
   - **Shift:** Morning Shift A / Evening Shift B / Night Shift C
   - **Working Hours:** How many hours did the operator work? (e.g., 8 hrs)
   - **Expected Production Qty:** What was the planned output? (e.g., 200 units)
   - **Actual Produced:** How many finished units were completed? (e.g., 195)
   - **QA Rejections:** How many units failed quality inspection? (e.g., 5)
   - **Wastage / Scrap:** Material wasted not resulting in a finished unit
   - **Operator / Worker:** Who performed the assembly?
   - **Floor Supervisor:** Who supervised?

3. Click **"Save Production Log"**

**The system automatically calculates:**
- Units per Hour = Actual Produced ÷ Working Hours
- Productivity % = (Actual ÷ Expected) × 100

---

### 7.4 KPI Summary Cards

| Card | Meaning |
|------|---------|
| Shift Output Today | Total units produced in current day |
| Total Rejections | Units failed QA across all logs |
| Avg. Productivity | Average productivity % across all logged shifts |

---

## 8. Dispatch & POs — Customer Orders

**Who uses this:** Dispatch Officer, Sales Coordinator, Admin  
**URL:** `/orders-dispatch`

### 8.1 Overview

This module manages **incoming orders from B2B buyers** (Havells, Crompton, Bajaj, etc.) and tracks outward dispatches.

> 💡 Eiffel LED is a manufacturer. Buyers send their Purchase Orders to Eiffel. Eiffel then produces and dispatches products to those buyers.

---

### 8.2 Three Tabs

| Tab | Purpose |
|-----|---------|
| **Buyer POs** | All incoming customer purchase orders |
| **Dispatch Challans** | All outward shipment records (Delivery Challans) |
| **Buyers Directory** | Registered customer companies |

---

### 8.3 Buyer POs Tab — Viewing Customer Orders

Each row = one Customer Purchase Order.

**Status Colors:**
| Status | Color | Meaning |
|--------|-------|---------|
| Pending Dispatch | Blue | Order received, nothing dispatched yet |
| Partially Dispatched | Amber | Some items shipped, some pending |
| Fully Dispatched | Green | All ordered items have been shipped |
| Closed | Grey | Order closed (partial accepted or cancelled) |

---

### 8.4 Creating a New Customer Purchase Order

The Customer PO form is a **full-page view** — not a small popup. This is designed to handle 50+ line items comfortably.

**Steps:**
1. Click **"Upload / Record Customer PO"** (lime green button)
2. The full-page form opens.

---

#### Section 1: Buyer & Consignee Information

| Field | Description |
|-------|-------------|
| **Customer / Buyer Company Name *** | Select from registered buyers dropdown OR choose "+ Others (Enter New Buyer / Distributor)" for a new customer |
| **Buyer GSTIN / Tax ID** | Buyer's GST number (auto-filled if selecting a registered buyer) |
| **Customer PO Number *** | Buyer's own PO reference (e.g., PO/HVL/2026/9021). Click "Auto-Gen" if buyer didn't provide one. |
| **PO Issue Date *** | Date the buyer issued the PO |
| **Delivery Due Date (ETA) *** | When the buyer expects delivery |
| **Destination City & State** | Where to deliver (e.g., Bhiwandi, Maharashtra) |

**Adding a new buyer on the fly:**
- Select **"+ Others (Enter New Buyer / Distributor)"** from dropdown
- Type the company name in the text box that appears
- The new buyer is **automatically saved to your Buyers Directory**

---

#### Section 2: PO Document & Commercial Terms

| Field | Description |
|-------|-------------|
| **Upload PO Document** | Attach the buyer's signed PO scan (PDF or image) |
| **Special Packaging & Commercial Instructions** | Any specific packing, labeling, or delivery notes from buyer |

---

#### Section 3: Ordered Finished Goods & Quantities

This is the main table where you enter what the buyer is ordering.

**For each product line:**
| Field | Description |
|-------|-------------|
| **Product** | Select from your finished goods catalog |
| **SKU Code** | Auto-filled from product selection |
| **UOM** | Unit of Measure (Pcs / Sets / Boxes) |
| **Ordered Qty** | How many units ordered (e.g., 5000 pcs) |
| **Unit Price (₹)** | Agreed selling price per unit |
| **Line Valuation** | Auto-calculated (Qty × Price) |

**Bulk row actions:**
- **+ Add Item:** Add one more product row
- **+ 5 Rows / + 10 Rows:** Add multiple blank rows quickly
- **Copy icon:** Duplicate any row (useful for same product in different configurations)
- **Trash icon:** Delete a row

**Sticky Bottom Bar** (always visible at bottom of screen):
- Shows live: Order #, Buyer Name, Total Lines, Total Units, Total Value (₹)
- **"Save Customer Purchase Order"** button

3. Click **"Save Customer Purchase Order"**

---

### 8.5 Dispatching Against a Customer PO

When products are ready to ship:

**Steps:**
1. Go to **Buyer POs** tab
2. Find the customer's PO
3. Click **"Dispatch"** button on that PO row
4. A dispatch form opens showing all items in the PO:

   **For each product:**
   - Shows: **Pending: X / Total: Y units**
   - Enter **"Quantity to Ship Now"** (can be less than full pending = partial dispatch)

   **Logistics & Transporter Details:**
   | Field | Example |
   |-------|---------|
   | Transporter / Freight Carrier * | V-Trans Logistics India |
   | Vehicle / Truck Registration # * | MH-12-RN-8812 |
   | GST E-Way Bill Number * | EWB-991204882190 |
   | Dispatch Incharge / Prepared By * | Name of person authorizing dispatch |

   **Optional:** Tick "Mark PO as Closed after this dispatch" if customer accepted short delivery as final.

5. Click **"Generate Delivery Challan & Dispatch"**

**What happens:**
- ✅ Delivery Challan (DC) is auto-generated and saved
- ✅ PO status updates to Partially Dispatched or Fully Dispatched
- ✅ Dispatched quantities logged in Dispatch Challans tab

---

### 8.6 Viewing & Printing a Delivery Challan

1. Go to the **Dispatch Challans** tab
2. Find the relevant challan
3. Click **"View DC"** or **"Print"** button
4. Preview shows:
   - Shipper: Eiffel LED Lighting Pvt. Ltd. + Plant
   - Consignee: Customer name + PO number
   - Carrier: Transporter + Vehicle number
   - Item table: Products, quantities, rates, amounts
   - E-Way Bill number

---

### 8.7 Buyers Directory Tab

Manage your registered B2B customers.

**Default registered buyers:**
- Havells Consumer Luminaires
- Crompton Greaves Consumer Electricals
- Bajaj Electricals
- Surya Roshni
- Syska LED
- Orient Electric
- Wipro Lighting

**To add a new buyer:**
1. Click **"+ Add New Buyer"**
2. Fill in: Company Name, Category (B2B Brand OEM / Distributor / Retail Chain / Export), GSTIN, City, State, Contact Person, Phone, Email, Payment Terms
3. Click **"Save Buyer"**

---

## 9. Productivity — Worker Performance

**Who uses this:** Production Manager, HR Manager, Owner  
**URL:** `/productivity`

### 9.1 Overview

This page shows a **performance leaderboard** of all assembly line operators, ranked by productivity.

---

### 9.2 KPI Cards

| Card | Meaning |
|------|---------|
| **Active Operators** | Total workers with production logs |
| **Top Yield Performer** | Operator with highest productivity %; shows their % |
| **Overall Floor Rejection Rate** | Average defect % across all workers |

> **Quality Alert:** If Overall Floor Rejection Rate exceeds **3.0%**, it indicates a quality or training issue.

---

### 9.3 Workforce Productivity Scorecard Table

Each row = one operator's aggregated performance across all logged shifts.

| Column | Meaning |
|--------|---------|
| # | Rank (1 = best performer) |
| Operator Name | Worker's name (gold badge = top performer) |
| Reporting Supervisor | Who supervises this worker |
| Expected Output | Total planned units across all shifts |
| Actual Output | Total units actually produced |
| Hours Logged | Total working hours recorded |
| Units / Hour | Output rate — higher is better |
| Rejection % | Defect rate — lower is better |
| Productivity | Color-coded badge: 🟢 ≥100%, 🟡 <100% |

**Productivity Formula:**
```
Productivity % = (Actual Output / Expected Output) × 100
```
- 110% = Worker produced 10% MORE than expected → 🟢 Excellent
- 85% = Worker produced 15% LESS than expected → 🟡 Needs coaching

---

## 10. Masters — Reference Data

**Who uses this:** Admin, Masters Manager  
**URL:** `/masters`

The Masters module contains the **foundation data** that everything else depends on. Changes here affect inventory calculations, BOM-based kit issuance, and production planning.

---

### 10.1 Tab 1: Products

Lists all finished goods your factory manufactures.

**Fields per product:**
- Product Code (e.g., BLB-12W-ECO)
- Product Name (e.g., Eiffel 12W Prime Eco LED Bulb B22)
- Category (LED Bulb / LED Panel / LED Batten / Flood Light / Street Light)
- Wattage
- Standard Cost (₹)

**To add a new product:**
1. Click **"+ Add New Product"**
2. Fill in Code, Name, Category, Wattage, Standard Cost
3. Click **Save**
4. Then go to **BOM tab** to define its components

---

### 10.2 Tab 2: Bill of Materials (BOM)

Defines **what raw materials** go into each finished product.

**Example — 12W LED Bulb BOM:**
| Material | Qty Per Unit | UOM |
|----------|-------------|-----|
| MCPCB 12W Aluminium | 1 | Pcs |
| HPF Driver 12W | 1 | Pcs |
| Housing 12W White | 1 | Pcs |
| B22 Aluminium Cap | 1 | Pcs |

**To add a BOM component:**
1. Select the product from dropdown
2. Click **"+ Add Component"**
3. Select material, enter quantity per unit, UOM
4. Click **Save**

> ⚠️ **Important:** BOM must be accurate before issuing any Production Kit. Wrong BOM = wrong material quantities issued to workers.

---

### 10.3 Tab 3: Raw Materials

Complete list of approved raw materials.

**Fields:** Material Code, Name, Category, UOM, Current Warehouse, Standard Cost, Lead Time (days), Safety Stock level, Approved Supplier

---

### 10.4 Tab 4: Suppliers

Vendor directory.

**Fields:** Supplier Name, Category (LED Driver / PCB / Housing / etc.), Contact Person, Phone, Lead Time (days)

---

### 10.5 Tab 5: Warehouses

Physical storage locations in your factory.

**Default warehouses:**
- Main Raw Material Store
- Southern Staging Store
- Heavy Luminaire Assembly Buffer
- Finished Goods Packaging Store

---

## 11. Workforce — Employee Management

**Who uses this:** HR Manager, Admin  
**URL:** `/employees`

### 11.1 Overview

The employee directory stores information about all factory workers, supervisors, managers, and staff.

---

### 11.2 Viewing Employees

| Column | Meaning |
|--------|---------|
| Name | Full name |
| Emp. Code | Unique ID (e.g., EMP-005) |
| Role | Job title / designation |
| Department | Which production line or department |
| Plant | Which factory location |
| Status | Active / On Leave / Inactive |

**Filtering:** Use dropdowns to filter by Role, Department, or Status.

---

### 11.3 Adding a New Employee

1. Click **"+ Add New Employee"**
2. Fill in all fields:
   - Full Name, Employee Code, Email, Phone
   - Plant Location (which factory?)
   - Department (which production line?)
   - Supervisor (reporting manager)
   - Team (sub-team within department)
   - Role
   - Workstation (e.g., SMT Machine #3, Soldering Station B-4)
   - Status (Active / On Leave / Inactive)
   - Skills (comma-separated, e.g., SMT Operation, PCB Assembly, Quality Inspection)
3. Click **"Save Employee"**

---

## 12. Settings — System Configuration

**Who uses this:** Admin / IT only  
**URL:** `/settings`

> ⚠️ **Caution:** Changes in Settings affect the entire system. Only authorized personnel should modify settings.

### 12.1 Tab 1: Company Profile

Set your company name, address, GSTIN, and upload your company logo.

---

### 12.2 Tab 2: Roles & Permissions

**Managing Existing Roles:**
1. Click any role card to expand it
2. See all permissions assigned to that role
3. Use the checkbox list to add/remove permissions
4. Click **Save**

**Permission Categories:**
- **Inventory:** View stock, adjust stock, transfer between warehouses
- **Procurement:** Create POs, approve POs, receive GRN
- **Planning:** View forecast, adjust production demands
- **Kits & Floor:** Create kits, issue kits, reconcile, close
- **Production:** Log daily output, record rejections
- **Master Data:** Manage materials, products, BOMs
- **Administration:** Manage roles, departments, users

**Creating a Custom Role:**
1. Scroll to **"Create New Role"** section
2. Enter Role Title (e.g., "Quality Inspector")
3. Enter Role Description
4. Check the permissions this role should have
5. Click **"Save New Role"**

---

### 12.3 Tab 3: Departments

Add/manage production lines and departments.

**Fields:** Department Name, Plant Location, Department Head, Active Teams/Cells, Description

---

### 12.4 Tab 4: Plant Locations

Add/manage manufacturing facilities.

**Fields:** Facility Name, Facility Code, City/State, Facility Type, Plant Head, Warehouse Zones

---

### 12.5 Tab 5: Factory Operations Config

Configure shift timings and thresholds.

| Setting | Default | Description |
|---------|---------|-------------|
| Shift A Timings (Morning) | 06:00 – 14:00 | Morning shift hours |
| Shift B Timings (Evening) | 14:00 – 22:00 | Evening shift hours |
| Standard Work Hours per Shift | 8 hrs | Used for units/hour calculation |
| QA Rejection Tolerance Threshold | 3.0% | Alert if rejection % exceeds this |

---

## 13. Reports — Exports & Analysis

**Who uses this:** Manager, Accountant, Admin  
**URL:** `/reports`

### 13.1 Available Reports

| Report | What It Contains |
|--------|-----------------|
| **Inventory Stock Report** | Current stock levels for all materials with status |
| **Purchase Orders Report** | All POs with status, supplier, amounts |
| **Daily Shift Production & Labour Yield** | Operator output, expected vs. actual, rejection ratios |
| **Customer Dispatch Register** | All delivery challans with customer, quantities, E-Way bills |

### 13.2 Downloading a Report

1. Navigate to **Reports** (`/reports`)
2. Find the report card you need
3. Click **"Download CSV"** button
4. File downloads immediately to your computer
5. Open in Excel or Google Sheets

---

## 14. Material Flow: Warehouse to Floor to Customer

Understanding how materials move through the system is critical for accurate tracking.

### 14.1 Complete Material Flow Diagram

```
SUPPLIER
   │  Purchase Order (PO) raised by Purchase Manager
   ▼
[GOODS RECEIVED NOTE — GRN]
   │  → Accepted Qty added to Warehouse currentStock
   │  → Stock Ledger: "GRN Receipt" IN entry created
   │  → PO status → Partially Received / Received
   ▼
WAREHOUSE (Raw Material Store)
   │  Materials stored in bins/racks
   │  Visible in Inventory → currentStock column
   │
   │  ← Production Kit Issuance ←
   │  Store Manager creates Kit → assigns to worker
   ▼
SHOP FLOOR (With Worker)
   │  currentStock DECREASES
   │  stockWithEmployees INCREASES
   │  Stock Ledger: "Kit Issue" OUT entry
   │  → Worker shown in Employee Accountability tab
   │  → Worker is ACCOUNTABLE for these materials
   │
   │  Worker assembles products
   ▼
[KIT RECONCILIATION] — Supervisor closes the kit
   │
   ├── Good Units Produced (e.g., 1980 bulbs)
   │      → Finished Goods store INCREASES
   │      → Production Log created
   │
   ├── Defectives / Rejections (e.g., 20 bulbs)
   │      → Rejection counter on material INCREASES
   │      → Rejection Ledger entry created
   │
   └── Unused Material Returned (e.g., 0 pcs)
          → Warehouse currentStock INCREASES
          → stockWithEmployees DECREASES
          → Stock Ledger: "Material Return" IN entry
   ▼
FINISHED GOODS STORE (Ready for dispatch)
   │  Completed products available for customer delivery
   ▼
CUSTOMER DELIVERY
   Delivery Challan (DC) generated
   E-Way Bill logged
   Customer PO status → Partially Dispatched / Fully Dispatched
```

---

### 14.2 Stock Visibility by Stage

| Location | System Field | Where to See It |
|----------|-------------|----------------|
| Warehouse | `currentStock` | Inventory → Inventory List column |
| Shop Floor | `stockWithEmployees` | Inventory → Floor Stock column / Kits → Employee Accountability |
| Rejected | `rejections` | Inventory → Rejections column |
| Inbound (ordered) | PO pending qty | Procurement → PO list |
| Dispatched | Customer PO dispatched qty | Dispatch & POs → Buyer POs |

---

### 14.3 Answering Common Floor Questions

**"How much material is currently on the floor?"**
→ Go to **Inventory → Inventory List** → look at the **Floor Stock** column for that material.

**"Who has the material on the floor?"**
→ Go to **Kits → Employee Material Ledger tab** → search by material name.

**"If I gave a worker 2000 bulbs' worth of material and 20 are defective, how do I record it?"**
→ Go to **Kits** → find the kit → click **Reconcile Kit** → enter:
  - Consumed: 1980 (good units)
  - Returned: 0
  - Wastage/Scrap: 20 (defectives)
  - System shows: 2000 = 1980 + 0 + 20 ✅

**"How can I see if an item is rejected?"**
→ Go to **Inventory → Inventory List** → check the **Rejections** column for that material.

**"Where does my material come from — what is the Business ID / Lot number?"**
→ Go to **Inventory → Inventory List** → check the **Lot / Batch #** column. This is the batch identifier from when the material was received via GRN.

---

## 15. Role-wise Daily Checklists

### 👑 Admin / Owner — Daily Checklist
- [ ] Check Dashboard KPI cards — any Critical stock alerts?
- [ ] Check Dashboard rejection rate — is it below 3%?
- [ ] Check open customer orders — any overdue dispatches?
- [ ] Review Productivity leaderboard — any underperforming operators?
- [ ] Check Procurement — any Delayed POs that need follow-up?

---

### 🛒 Purchase Manager — Daily Checklist
- [ ] Check Forecast page for any Critical material alerts
- [ ] Review Procurement → look for Delayed or In Transit POs
- [ ] Raise POs for any Critical or Low stock materials
- [ ] Process any pending GRNs (goods physically received but not in system)
- [ ] Close any POs where remaining goods will not arrive

---

### 🏭 Store Manager — Daily Checklist
- [ ] Process any incoming deliveries as GRNs in Procurement
- [ ] Check BOM View in Inventory — are all components available for today's production?
- [ ] Issue new Production Kits for today's planned batches
- [ ] Check Employee Accountability tab — any overdue kits (issued but not reconciled for > 3 days)?
- [ ] Reconcile completed kits from yesterday's shifts
- [ ] Update stock adjustments if physical count differs from system

---

### 👷 Supervisor — Daily Checklist
- [ ] Confirm all workers have their kits issued for today
- [ ] Log today's production entries in Production module (per shift, per operator)
- [ ] Reconcile any completed kits (Consumed + Returned + Scrap must equal Issued)
- [ ] Review worker productivity on Productivity page
- [ ] Flag any quality issues (high rejection rates)

---

### 📤 Dispatch Officer — Daily Checklist
- [ ] Check Buyer POs tab — any POs with stock ready to dispatch?
- [ ] Process dispatch for ready orders (fill vehicle/E-Way bill details)
- [ ] Print Delivery Challans for today's shipments
- [ ] Update customer on dispatch status
- [ ] Check for any POs where delivery is overdue — escalate to manager

---

## 16. Glossary of Terms

| Term | Full Form | Meaning |
|------|-----------|---------|
| **GRN** | Goods Received Note | Document confirming receipt of goods from a supplier |
| **PO** | Purchase Order | Official order sent to a supplier to buy materials |
| **BOM** | Bill of Materials | List of raw materials needed to make one unit of a product |
| **Kit** | Production Kit | A batch of materials issued to one worker for one production run |
| **MIN** | Material Issue Note | Document recording material movement from warehouse to floor |
| **FGS** | Finished Goods Store | Warehouse for completed, packaged products ready for dispatch |
| **DC** | Delivery Challan | Shipping document accompanying a customer delivery |
| **ETA** | Estimated Time of Arrival | Expected delivery date |
| **UOM** | Unit of Measure | The unit for counting (Pcs, Kgs, Mtr, Boxes, Sets) |
| **SKU** | Stock Keeping Unit | Unique code identifying a material or product |
| **IQC** | Incoming Quality Check | Inspection of goods when received from supplier |
| **QA** | Quality Assurance | Process to ensure products meet quality standards |
| **MCPCB** | Metal Core Printed Circuit Board | PCB used in LED manufacturing (substrate) |
| **RTV** | Return to Vendor | Returning defective goods to the supplier |
| **GSTIN** | GST Identification Number | Unique 15-digit GST registration number |
| **E-Way Bill** | Electronic Way Bill | Government-mandated e-document for goods movement over ₹50,000 |
| **RBAC** | Role-Based Access Control | System where users can only see/do what their role allows |
| **KPI** | Key Performance Indicator | A measurable metric (e.g., rejection rate, units/hour) |
| **Productivity %** | — | (Actual Output / Expected Output) × 100 |
| **Expected Output** | — | Planned production units for a shift or batch |
| **Floor Stock** | — | Material currently on the assembly floor (with workers) |
| **Safety Stock** | — | Minimum stock level below which you must place a reorder |
| **Ledger Entry** | — | Permanent record of a stock movement in the system |
| **Lot / Batch #** | — | Identifier grouping materials received in one delivery (Business ID) |
| **Reconciliation** | — | Process of verifying that Issued = Consumed + Returned + Scrap |
| **Partial GRN** | — | Receiving a portion of an ordered quantity |
| **Dispatch Challan** | — | Document sent with outgoing goods delivery to a customer |
| **Bottleneck Material** | — | The BOM component with least stock that limits max assembly quantity |

---

## 17. Troubleshooting & FAQs

### Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Cannot log in | Contact Admin to reset password |
| Stock not updating after GRN | Ensure you clicked "Confirm GRN & Add to Stock" |
| Kit issue button grayed out | Material stock may be insufficient — check Inventory → BOM View first |
| Customer PO not showing | Check Plant Selector — PO may be in a different plant |
| Productivity page shows 0 workers | No production logs entered yet — go to Production and log entries |
| Cannot close a kit | Enter Reconciliation Notes explaining the discrepancy |
| Material missing from BOM dropdown | Add the material in Masters → Raw Materials first |
| PO stuck in "Ordered" status | Record a GRN when goods arrive, or manually close the PO |
| Rejection count not showing | Rejections only appear after Kit Reconciliation where scrap is entered |
| Floor stock doesn't match physical | Check Employee Accountability — material may be with a specific worker |

---

### Frequently Asked Questions

**Q: How do I check how much stock is on the floor vs. in the warehouse?**  
A: Go to **Inventory → Inventory List**. Look at two columns:
- **Current Stock** = in the warehouse
- **Floor Stock** = with workers on the assembly floor

---

**Q: A buyer placed an order for 5000 bulbs but we can only supply 4000 now. What do we do?**  
A: 
1. Create the Customer PO for 5000 units as received
2. When dispatching, enter 4000 in "Quantity to Ship Now" — this creates a Partial Dispatch
3. The PO status becomes "Partially Dispatched"
4. When the remaining 1000 are ready, dispatch again against the same PO

---

**Q: A supplier delivered only 3000 of the 5000 MCPCBs ordered. What do I do?**  
A:
1. Go to Procurement → find the PO
2. Click "Record GRN" → enter Accepted Qty = 3000
3. PO status automatically changes to "Partially Received"
4. When remaining 2000 arrive, record another GRN
5. If remaining 2000 will never arrive, click "Close PO" on the PO row

---

**Q: How do I see which batch of material a particular product was made from?**  
A: Go to **Inventory → Stock Ledger** and search by material name. Find the Kit Issue entry → note the Kit Number → go to **Kits** → find that Kit → it shows which Lot/Batch the materials came from.

---

**Q: An operator was given 2000 bulbs worth of material. 20 came out defective. How do I record the final count of 1980 good bulbs?**  
A: Go to **Kits** → find the operator's kit → click **Reconcile Kit** → enter:
- Consumed: 1980
- Returned: 0
- Wastage/Scrap: 20
- System verifies: 2000 = 1980 + 0 + 20 ✅

---

**Q: Why is the "Expected" column used instead of "Target"?**  
A: In MIPS, we use **"Expected"** to reflect the planned production estimate, not a hard target. This is more appropriate for manufacturing planning where the expected output is based on standard capacity and BOM calculations — not an imposed performance target.

---

### Data Storage Note (Current Version)

> ⚠️ **Currently, all data is stored in your browser's local storage.** This means:
> - Data persists when you close and reopen the browser on the same computer
> - Data does NOT sync across multiple computers or users
> - Clearing browser data or using a different browser will show fresh/default data
>
> The backend API integration will enable multi-user, server-stored data in a future release.

---

*MIPS User Manual v1.1 | October 2026 | Eiffel LED Lighting Pvt. Ltd.*  
*For system support, contact your IT Administrator.*

