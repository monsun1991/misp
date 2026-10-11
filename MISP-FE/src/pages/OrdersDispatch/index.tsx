import React, { useState } from 'react';
import {
  Send,
  PlusCircle,
  Truck,
  PackageCheck,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UploadCloud,
  FileUp,
  Download,
  Building,
  Printer,
  ChevronDown,
  X,
  Package,
  Layers,
  ArrowRight,
  Users,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Briefcase,
  ArrowLeft,
  Trash2,
  Copy,
  Plus,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import {
  useMipsStore,
  CustomerPO,
  CustomerPOItem,
  OutwardDispatchRecord,
  Customer,
  isPlantMatch
} from '@/store/useMipsStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const OrdersDispatchPage: React.FC = () => {
  const {
    customerPOs: rawCustomerPOs,
    dispatchRecords: rawDispatchRecords,
    finishedGoods: rawFinishedGoods,
    customers,
    products,
    selectedPlant,
    createCustomerPO,
    dispatchCustomerPO,
    closeCustomerPO,
    addCustomer
  } = useMipsStore();

  const customerPOs = (rawCustomerPOs || []).filter((po) => isPlantMatch(po.plant, selectedPlant));
  const dispatchRecords = (rawDispatchRecords || []).filter((d) => isPlantMatch(d.plant, selectedPlant));
  const finishedGoods = (rawFinishedGoods || []).filter((fg) => isPlantMatch(fg.plant, selectedPlant));

  const fgsStockByProductId = useMemo(() => {
    const map: Record<string, number> = {};
    finishedGoods.forEach((fg) => {
      map[fg.productId] = (map[fg.productId] || 0) + fg.availableQty;
    });
    return map;
  }, [finishedGoods]);

  const [activeTab, setActiveTab] = useState<'orders' | 'dispatches' | 'customers'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Page View Mode: 'list' or 'create_po' (dedicated full-page form)
  const [viewMode, setViewMode] = useState<'list' | 'create_po'>('list');

  // Modals
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedPOForDispatch, setSelectedPOForDispatch] = useState<CustomerPO | null>(null);
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [activeDispatchChallan, setActiveDispatchChallan] = useState<OutwardDispatchRecord | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  // New Customer PO Form State
  const initialCustomer = customers[0] || {
    name: 'Havells Consumer Luminaires',
    gstin: '27AABCH1092P1ZF',
    city: 'Pune',
    state: 'Maharashtra'
  };

  const [selectedCustomerOption, setSelectedCustomerOption] = useState<string>(customers[0]?.id || 'cust-001');
  const [isCustomCustomer, setIsCustomCustomer] = useState(false);

  const [newCustName, setNewCustName] = useState(initialCustomer.name);
  const [newCustGst, setNewCustGst] = useState(initialCustomer.gstin);
  const [newCustPoNo, setNewCustPoNo] = useState(`PO/CUST/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
  const [newPoDate, setNewPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDeliveryDate, setNewDeliveryDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newBillingCity, setNewBillingCity] = useState(`${initialCustomer.city}, ${initialCustomer.state}`);
  const [uploadedFileName, setUploadedFileName] = useState<string>('Customer_Purchase_Order.pdf');
  const [newOrderNotes, setNewOrderNotes] = useState('');

  // Standalone Add Customer Form State (for Directory Tab)
  const [newClientName, setNewClientName] = useState('');
  const [newClientGst, setNewClientGst] = useState('');
  const [newClientCity, setNewClientCity] = useState('');
  const [newClientState, setNewClientState] = useState('Maharashtra');
  const [newClientContact, setNewClientContact] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientCategory, setNewClientCategory] = useState<Customer['category']>('B2B Brand OEM');
  const [newClientTerms, setNewClientTerms] = useState('30 Days Net from Delivery Challan');

  // Multi-item rows for Customer PO
  const [poLineItems, setPoLineItems] = useState<
    { productId: string; productCode: string; productName: string; orderedQty: number; unitPrice: number; uom: string }[]
  >([
    {
      productId: products[0]?.id || 'prod-001',
      productCode: products[0]?.code || 'BLB-12W-ECO',
      productName: products[0]?.name || 'Eiffel 12W Prime Eco LED Bulb (B22)',
      orderedQty: 2000,
      unitPrice: 88.0,
      uom: 'Pcs'
    }
  ]);

  // Dispatch Form State
  const [dispatchTransporter, setDispatchTransporter] = useState('V-Trans Logistics India');
  const [dispatchVehicleNo, setDispatchVehicleNo] = useState('MH-12-RN-8812');
  const [dispatchEwayBill, setDispatchEwayBill] = useState(`EWB-${Math.floor(100000000000 + Math.random() * 900000000000)}`);
  const [dispatchOfficer, setDispatchOfficer] = useState('Ramesh Sharma (Store Manager)');
  const [dispatchNotes, setDispatchNotes] = useState('');
  const [closeAfterDispatch, setCloseAfterDispatch] = useState(false);
  const [dispatchInputs, setDispatchInputs] = useState<Record<string, number>>({});

  // Handler for customer dropdown selection
  const handleCustomerDropdownChange = (val: string) => {
    setSelectedCustomerOption(val);
    if (val === 'OTHERS') {
      setIsCustomCustomer(true);
      setNewCustName('');
      setNewCustGst('');
      setNewBillingCity('');
    } else {
      setIsCustomCustomer(false);
      const cust = customers.find((c) => c.id === val);
      if (cust) {
        setNewCustName(cust.name);
        setNewCustGst(cust.gstin);
        setNewBillingCity(`${cust.city}, ${cust.state}`);
      }
    }
  };

  // Filtered Customer POs
  const filteredOrders = customerPOs.filter((po) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      po.customerPoNumber.toLowerCase().includes(q) ||
      po.customerName.toLowerCase().includes(q) ||
      po.billingCity.toLowerCase().includes(q) ||
      po.items.some((i) => i.productName.toLowerCase().includes(q) || i.productCode.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalOpenOrders = customerPOs.filter((p) => p.status !== 'Closed' && p.status !== 'Fully Dispatched').length;
  const totalDispatchedUnits = customerPOs.reduce((acc, p) => acc + p.totalDispatchedQty, 0);
  const totalOpenOrderValue = customerPOs
    .filter((p) => p.status !== 'Closed')
    .reduce((acc, p) => acc + p.totalAmount, 0);
  const partialDispatchedCount = customerPOs.filter((p) => p.status === 'Partially Dispatched').length;

  const handleAddLineItem = () => {
    const nextProd = products[poLineItems.length % products.length] || products[0];
    setPoLineItems([
      ...poLineItems,
      {
        productId: nextProd?.id || 'prod-001',
        productCode: nextProd?.code || 'BLB-12W-ECO',
        productName: nextProd?.name || 'Eiffel 12W Prime Eco LED Bulb (B22)',
        orderedQty: 1000,
        unitPrice: Math.round((nextProd?.standardCost || 60) * 1.35),
        uom: 'Pcs'
      }
    ]);
  };

  const handleAddMultipleItems = (count: number) => {
    const newItems = Array.from({ length: count }, (_, idx) => {
      const prod = products[(poLineItems.length + idx) % products.length] || products[0];
      return {
        productId: prod?.id || 'prod-001',
        productCode: prod?.code || 'BLB-12W-ECO',
        productName: prod?.name || 'Eiffel 12W Prime Eco LED Bulb (B22)',
        orderedQty: 1000,
        unitPrice: Math.round((prod?.standardCost || 60) * 1.35),
        uom: 'Pcs'
      };
    });
    setPoLineItems([...poLineItems, ...newItems]);
  };

  const handleDuplicateLineItem = (index: number) => {
    const item = poLineItems[index];
    const updated = [...poLineItems];
    updated.splice(index + 1, 0, { ...item });
    setPoLineItems(updated);
  };

  const handlePrefill50Items = () => {
    const qtyPresets = [500, 1000, 1500, 2000, 2500, 3000, 5000, 800, 1200, 4000];
    const items = [];
    for (let i = 0; i < 50; i++) {
      const prod = products[i % products.length];
      const batchSuffix = i >= products.length ? ` (Lot-${Math.floor(i / products.length) + 1})` : '';
      items.push({
        productId: prod.id,
        productCode: `${prod.code}${i >= products.length ? `-${Math.floor(i / products.length) + 1}` : ''}`,
        productName: `${prod.name}${batchSuffix}`,
        orderedQty: qtyPresets[i % qtyPresets.length],
        unitPrice: Math.round((prod.standardCost || 60) * 1.35),
        uom: 'Pcs'
      });
    }
    setPoLineItems(items);
  };

  const handleRemoveLineItem = (index: number) => {
    if (poLineItems.length <= 1) return;
    setPoLineItems(poLineItems.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    const updated = [...poLineItems];
    updated[index] = {
      ...updated[index],
      productId: prod.id,
      productCode: prod.code,
      productName: prod.name,
      unitPrice: Math.round(prod.standardCost * 1.35)
    };
    setPoLineItems(updated);
  };

  const handleCreateCustomerPOSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (poLineItems.length === 0) return;

    // If a brand new custom buyer was entered, save it dynamically into Customers Directory!
    if (isCustomCustomer && newCustName.trim()) {
      const alreadyExists = customers.some((c) => c.name.toLowerCase() === newCustName.trim().toLowerCase());
      if (!alreadyExists) {
        addCustomer({
          name: newCustName.trim(),
          gstin: newCustGst.trim() || 'UNREGISTERED',
          city: newBillingCity.split(',')[0]?.trim() || 'Pune',
          state: newBillingCity.split(',')[1]?.trim() || 'Maharashtra',
          contactPerson: 'Commercial Purchase Dept',
          phone: '+91 98000 00000',
          email: 'orders@buyer.com',
          category: 'B2B Brand OEM',
          paymentTerms: '30 Days Net',
        });
      }
    }

    createCustomerPO({
      customerPoNumber: newCustPoNo,
      customerName: newCustName,
      customerGst: newCustGst,
      billingCity: newBillingCity,
      poDate: newPoDate,
      expectedDispatchDate: newDeliveryDate,
      plant: selectedPlant,
      uploadedFileName,
      notes: newOrderNotes,
      items: poLineItems.map((item) => ({
        productId: item.productId,
        productCode: item.productCode,
        productName: item.productName,
        orderedQty: Number(item.orderedQty),
        dispatchedQty: 0,
        pendingQty: Number(item.orderedQty),
        unitPrice: Number(item.unitPrice),
        uom: item.uom
      }))
    });

    setViewMode('list');
  };

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    addCustomer({
      name: newClientName.trim(),
      gstin: newClientGst.trim(),
      city: newClientCity.trim() || 'Pune',
      state: newClientState.trim() || 'Maharashtra',
      contactPerson: newClientContact.trim(),
      phone: newClientPhone.trim(),
      email: newClientEmail.trim(),
      category: newClientCategory,
      paymentTerms: newClientTerms,
    });

    // Reset
    setNewClientName('');
    setNewClientGst('');
    setNewClientCity('');
    setNewClientContact('');
    setNewClientPhone('');
    setNewClientEmail('');
    setShowAddCustomerModal(false);
  };

  const openDispatchDialog = (po: CustomerPO) => {
    setSelectedPOForDispatch(po);
    const initialInputs: Record<string, number> = {};
    po.items.forEach((item) => {
      initialInputs[item.productId] = item.pendingQty; // Default to all pending
    });
    setDispatchInputs(initialInputs);
    setCloseAfterDispatch(false);
    setDispatchNotes('');
    setShowDispatchModal(true);
  };

  const handleProcessDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPOForDispatch) return;

    const itemsToDispatch = Object.entries(dispatchInputs)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, qty]) => ({
        productId,
        qty: Number(qty)
      }));

    if (itemsToDispatch.length === 0) {
      alert('Please enter at least 1 unit to dispatch.');
      return;
    }

    dispatchCustomerPO({
      customerPoId: selectedPOForDispatch.id,
      transporter: dispatchTransporter,
      vehicleNo: dispatchVehicleNo,
      ewayBillNo: dispatchEwayBill,
      items: itemsToDispatch,
      closeAfterDispatch,
      user: dispatchOfficer,
      notes: dispatchNotes
    });

    setShowDispatchModal(false);
    setSelectedPOForDispatch(null);
  };

  // -------------------------------------------------------------
  // FULL PAGE VIEW: Record Customer Purchase Order (Sales PO)
  // Handles 50+ line items with full width, sticky headers & totals
  // -------------------------------------------------------------
  if (viewMode === 'create_po') {
    const totalOrderedQty = poLineItems.reduce((acc, i) => acc + Number(i.orderedQty || 0), 0);
    const totalOrderValuation = poLineItems.reduce(
      (acc, i) => acc + Number(i.orderedQty || 0) * Number(i.unitPrice || 0),
      0
    );

    return (
      <div className="space-y-6 pb-28">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Orders & Dispatch
              </Button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <Badge variant="outline" className="bg-[#183638]/10 text-[#146b68] dark:text-[#d4e967] border-[#146b68]/30 text-[11px] font-semibold">
                {selectedPlant}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <FileUp className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
              Record Customer Purchase Order (Sales PO)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Full-page high-capacity order recording. Enter 50+ line items with dynamic buyer selection, live valuation totals, and PO file attachment.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleCreateCustomerPOSubmit()}
              className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Save Customer Purchase Order
            </Button>
          </div>
        </div>

        <form onSubmit={handleCreateCustomerPOSubmit} className="space-y-6">
          {/* Section 1 & 2: Buyer Details & Order Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Buyer Company Information Card */}
            <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                  1. Buyer & Consignee Information
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose a registered brand OEM or select "Others" to enter a new client.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dynamic Customer Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-800 dark:text-slate-200">
                        Customer / Buyer Company Name *
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {isCustomCustomer ? '✍️ Manual Entry Mode' : '🏛️ Registry Dropdown'}
                      </span>
                    </div>

                    <select
                      value={selectedCustomerOption}
                      onChange={(e) => handleCustomerDropdownChange(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#84cc16]"
                    >
                      <option value="">-- Select Registered Buyer --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.city})
                        </option>
                      ))}
                      <option value="OTHERS" className="font-bold text-[#146b68] dark:text-[#84cc16]">
                        + Others (Enter New Buyer / Distributor)
                      </option>
                    </select>

                    {isCustomCustomer && (
                      <div className="mt-2 space-y-1">
                        <Input
                          required
                          value={newCustName}
                          onChange={(e) => setNewCustName(e.target.value)}
                          className="h-9 text-xs font-bold border-[#84cc16] focus:border-[#84cc16]"
                          placeholder="Type New Buyer Company Name..."
                        />
                        <span className="text-[10px] text-emerald-600 block">
                          ✓ Will be automatically saved to your Customer Directory
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Buyer GSTIN / Tax ID
                    </label>
                    <Input
                      value={newCustGst}
                      onChange={(e) => setNewCustGst(e.target.value)}
                      className="h-9 font-mono"
                      placeholder="e.g. 27AABCH1092P1ZF"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Customer PO Number *
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setNewCustPoNo(`PO/CUST/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`)
                        }
                        className="text-[10px] text-[#146b68] dark:text-[#84cc16] hover:underline flex items-center gap-0.5"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> Auto-Gen
                      </button>
                    </div>
                    <Input
                      required
                      value={newCustPoNo}
                      onChange={(e) => setNewCustPoNo(e.target.value)}
                      className="h-9 font-mono text-blue-600 font-bold"
                      placeholder="e.g. PO/HVL/2026/9021"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      PO Issue Date *
                    </label>
                    <Input
                      type="date"
                      required
                      value={newPoDate}
                      onChange={(e) => setNewPoDate(e.target.value)}
                      className="h-9"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Delivery Due Date (ETA) *
                    </label>
                    <Input
                      type="date"
                      required
                      value={newDeliveryDate}
                      onChange={(e) => setNewDeliveryDate(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Destination City & State (Delivery Hub)
                    </label>
                    <Input
                      value={newBillingCity}
                      onChange={(e) => setNewBillingCity(e.target.value)}
                      className="h-9"
                      placeholder="e.g. Bhiwandi, Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Fulfillment Manufacturing Plant
                    </label>
                    <Input
                      readOnly
                      disabled
                      value={selectedPlant}
                      className="h-9 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Upload & Terms Card */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                    2. PO Document & Commercial Terms
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Attach signed customer purchase order file.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  {/* Upload Box */}
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-50 transition-colors">
                    <UploadCloud className="w-8 h-8 text-[#146b68] dark:text-[#84cc16] mx-auto mb-1.5" />
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Customer PO Document (PDF / Scan)'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Drag & drop buyer PO or browse from files
                    </div>
                    <div className="mt-2.5 flex justify-center">
                      <input
                        type="file"
                        id="po-page-file-upload"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedFileName(e.target.files[0].name);
                          }
                        }}
                      />
                      <label
                        htmlFor="po-page-file-upload"
                        className="cursor-pointer text-[11px] px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-md font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 shadow-sm"
                      >
                        Choose File...
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Special Packaging & Commercial Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={newOrderNotes}
                      onChange={(e) => setNewOrderNotes(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#84cc16]"
                      placeholder="e.g. Master carton packaging of 50 pcs per box; barcode labeling required on secondary cartons."
                    />
                  </div>
                </CardContent>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 rounded-b-xl flex items-center justify-between text-xs">
                <span className="text-slate-500">Order Initial Status:</span>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-none font-semibold">
                  Pending Dispatch
                </Badge>
              </div>
            </Card>
          </div>

          {/* Section 3: High-Capacity Product Line Items Table (50+ Items) */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                    3. Ordered Finished Goods & Quantities
                    <Badge variant="outline" className="ml-2 font-mono text-xs bg-slate-100 dark:bg-slate-800 font-bold">
                      {poLineItems.length} Line Items
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Enter individual product quantities and agreed unit selling prices. High-capacity grid designed for 50+ lines.
                  </CardDescription>
                </div>

                {/* Bulk Row Add / Action Controls */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddLineItem}
                    className="h-7 text-xs text-[#146b68] dark:text-[#84cc16] border-[#146b68]/40 hover:bg-[#146b68]/10"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    + Add Item
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddMultipleItems(5)}
                    className="h-7 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    + 5 Rows
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddMultipleItems(10)}
                    className="h-7 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    + 10 Rows
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handlePrefill50Items}
                    className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Prefill 50 Items (Demo)
                  </Button>
                  {poLineItems.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setPoLineItems([poLineItems[0]])}
                      className="h-7 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      Reset to 1 Row
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-300 font-semibold border-b shadow-sm">
                    <tr>
                      <th className="py-3 px-3 w-12 text-center">#</th>
                      <th className="py-3 px-3 min-w-[260px]">Product / Finished Good Name</th>
                      <th className="py-3 px-3 w-32">SKU Code</th>
                      <th className="py-3 px-3 w-24">UOM</th>
                      <th className="py-3 px-3 w-36 text-right">Ordered Qty</th>
                      <th className="py-3 px-3 w-36 text-right">Unit Price (₹)</th>
                      <th className="py-3 px-3 w-36 text-right">Line Valuation (₹)</th>
                      <th className="py-3 px-3 w-24 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {poLineItems.map((item, idx) => {
                      const lineTotal = Number(item.orderedQty || 0) * Number(item.unitPrice || 0);
                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                            idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/40 dark:bg-slate-850/30'
                          }`}
                        >
                          <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={item.productId}
                              onChange={(e) => handleProductChange(idx, e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-md p-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-[#84cc16]"
                            >
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} {fgsStockByProductId[p.id] ? `(FGS: ${fgsStockByProductId[p.id].toLocaleString()} avail)` : '(FGS: 0)'}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                              {item.productCode}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={item.uom}
                              onChange={(e) => {
                                const updated = [...poLineItems];
                                updated[idx].uom = e.target.value;
                                setPoLineItems(updated);
                              }}
                              className="bg-transparent border rounded p-1 text-xs font-medium"
                            >
                              <option value="Pcs">Pcs</option>
                              <option value="Sets">Sets</option>
                              <option value="Boxes">Boxes</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <Input
                              type="number"
                              min="1"
                              required
                              value={item.orderedQty}
                              onChange={(e) => {
                                const updated = [...poLineItems];
                                updated[idx].orderedQty = Math.max(0, Number(e.target.value));
                                setPoLineItems(updated);
                              }}
                              className="h-8 text-xs font-bold text-right font-mono w-28 ml-auto"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              required
                              value={item.unitPrice}
                              onChange={(e) => {
                                const updated = [...poLineItems];
                                updated[idx].unitPrice = Math.max(0, Number(e.target.value));
                                setPoLineItems(updated);
                              }}
                              className="h-8 text-xs text-right font-mono w-28 ml-auto"
                            />
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                            ₹{lineTotal.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                title="Duplicate Row"
                                onClick={() => handleDuplicateLineItem(idx)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              {poLineItems.length > 1 && (
                                <button
                                  type="button"
                                  title="Delete Row"
                                  onClick={() => handleRemoveLineItem(idx)}
                                  className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Table Toolbar */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddLineItem}
                    className="h-8 text-xs text-[#146b68] dark:text-[#84cc16] border-[#146b68]/40"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Another Item Row
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddMultipleItems(5)}
                    className="h-8 text-xs text-slate-600 dark:text-slate-400"
                  >
                    + 5 Rows
                  </Button>
                </div>

                <div className="flex items-center gap-6 font-medium">
                  <div>
                    <span className="text-slate-500">Total Items:</span>{' '}
                    <strong className="text-slate-900 dark:text-slate-100">{poLineItems.length} lines</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Total Qty:</span>{' '}
                    <strong className="text-slate-900 dark:text-slate-100">{totalOrderedQty.toLocaleString()} units</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Consignment Valuation:</span>{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm font-extrabold">
                      ₹{totalOrderValuation.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sticky Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 py-3 px-6 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs">
              <div className="hidden sm:block">
                <span className="text-slate-500">Order:</span>{' '}
                <strong className="font-mono text-blue-600 font-bold">{newCustPoNo}</strong>
              </div>
              <div className="hidden md:block">
                <span className="text-slate-500">Buyer:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">{newCustName || 'Select Buyer'}</strong>
              </div>
              <div>
                <span className="text-slate-500">Lines:</span>{' '}
                <strong>{poLineItems.length}</strong>
              </div>
              <div>
                <span className="text-slate-500">Units:</span>{' '}
                <strong>{totalOrderedQty.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-500">Total Value:</span>{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold text-base">
                  ₹{totalOrderValuation.toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setViewMode('list')}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16] px-5"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Save Customer Purchase Order
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LIST VIEW: Orders, Dispatches & Customer Directory
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Send className="w-6 h-6 text-[#146b68] dark:text-[#84cc16]" />
              Customer Orders, Sales POs & Dispatch
            </h1>
            <Badge variant="outline" className="bg-[#183638]/10 text-[#146b68] dark:text-[#d4e967] border-[#146b68]/30 text-[11px] font-semibold">
              {selectedPlant}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Capture B2B buyer Purchase Orders, select from registered customers or add new ones, manage partial dispatches, and generate Delivery Challans (DC).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setViewMode('create_po')}
            className="bg-[#84cc16] hover:bg-[#72b012] text-[#143234] font-bold text-xs shadow-md shadow-[#84cc16]/25 border border-[#84cc16]"
          >
            <FileUp className="w-4 h-4 mr-1.5" />
            Upload / Record Customer PO
          </Button>

          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center border">
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Buyer POs ({customerPOs.length})
            </button>
            <button
              onClick={() => setActiveTab('dispatches')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'dispatches'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Dispatch Challans ({dispatchRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'customers'
                  ? 'bg-[#183638] text-[#84cc16] shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Buyers Directory ({customers.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Open Customer POs
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpenOrders} Orders</div>
            <div className="text-xs text-slate-400 mt-0.5">Value: ₹{(totalOpenOrderValue / 100000).toFixed(2)} Lakhs</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Partially Dispatched
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{partialDispatchedCount} Orders</div>
            <div className="text-xs text-slate-400 mt-0.5">Dispatches in multiple tranches</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Units Dispatched
            </CardTitle>
            <Truck className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{totalDispatchedUnits.toLocaleString()} units</div>
            <div className="text-xs text-slate-400 mt-0.5">Finished LED products shipped</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Registered B2B Buyers
            </CardTitle>
            <Users className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{customers.length} Companies</div>
            <div className="text-xs text-slate-400 mt-0.5">OEMs, distributors & dealers</div>
          </CardContent>
        </Card>
      </div>

      {/* TAB 1: Customer POs Registry */}
      {activeTab === 'orders' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <Input
                  placeholder="Search buyer name, PO#, product or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8 text-xs bg-slate-50 dark:bg-slate-800 border rounded-md px-2"
                >
                  <option value="All">All Order Statuses</option>
                  <option value="New Order">New Order</option>
                  <option value="In Production">In Production</option>
                  <option value="Partially Dispatched">Partially Dispatched</option>
                  <option value="Fully Dispatched">Fully Dispatched</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Customer PO #</th>
                    <th className="py-2.5 px-3">Buyer / Client</th>
                    <th className="py-2.5 px-3">Ordered Finished Goods</th>
                    <th className="py-2.5 px-3 text-right">Total Qty</th>
                    <th className="py-2.5 px-3 text-right text-emerald-600">Dispatched</th>
                    <th className="py-2.5 px-3 text-right text-blue-600 font-bold">Pending</th>
                    <th className="py-2.5 px-3 text-right">Order Value</th>
                    <th className="py-2.5 px-3">Delivery ETA</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{po.customerPoNumber}</div>
                        <div className="text-[10px] text-slate-400">Date: {po.poDate}</div>
                        {po.uploadedFileName && (
                          <div className="inline-flex items-center gap-1 mt-1 text-[10px] text-[#146b68] dark:text-[#84cc16] bg-[#146b68]/10 px-1.5 py-0.5 rounded font-medium">
                            <FileText className="w-3 h-3" />
                            <span>{po.uploadedFileName}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{po.customerName}</div>
                        <div className="text-[10px] text-slate-400">{po.billingCity}</div>
                        {po.customerGst && (
                          <div className="text-[10px] font-mono text-slate-500">GST: {po.customerGst}</div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="space-y-1 max-w-xs">
                          {po.items.map((item, idx) => (
                            <div key={idx} className="text-[11px] flex justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-0.5">
                              <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                                {item.productName}
                              </span>
                              <span className="font-mono text-slate-500 shrink-0">
                                {item.orderedQty.toLocaleString()} {item.uom}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-medium">{po.totalOrderedQty.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-600">
                        {po.totalDispatchedQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-blue-600 dark:text-blue-400">
                        {po.totalPendingQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                        ₹{(po.totalAmount / 1000).toFixed(1)}k
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {po.expectedDispatchDate}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {po.status === 'New Order' && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            New Order
                          </Badge>
                        )}
                        {po.status === 'In Production' && (
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                            In Production
                          </Badge>
                        )}
                        {po.status === 'Partially Dispatched' && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            ⚠ Partial Dispatch
                          </Badge>
                        )}
                        {po.status === 'Fully Dispatched' && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            ✓ Fully Dispatched
                          </Badge>
                        )}
                        {po.status === 'Closed' && (
                          <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300">
                            Closed
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {po.status !== 'Fully Dispatched' && po.status !== 'Closed' ? (
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <Button
                              size="sm"
                              onClick={() => openDispatchDialog(po)}
                              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            >
                              <Truck className="w-3.5 h-3.5 mr-1" />
                              Dispatch
                            </Button>
                            {po.status === 'Partially Dispatched' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => closeCustomerPO(po.id, 'Buyer confirmed partial delivery completion')}
                                className="h-7 text-xs border-slate-400 text-slate-600 hover:bg-slate-100"
                              >
                                Close PO
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        No customer purchase orders found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: Outward Delivery Challans (DC Journal) */}
      {activeTab === 'dispatches' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
              Outward Delivery Challans (DC) & Factory Gate Dispatches
            </CardTitle>
            <CardDescription>
              Chronological log of all finished goods vehicles dispatched from {selectedPlant} with E-Way Bill references.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Challan / DC #</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Customer / Consignee</th>
                    <th className="py-2.5 px-3">Against PO #</th>
                    <th className="py-2.5 px-3">Transporter & Truck #</th>
                    <th className="py-2.5 px-3">E-Way Bill #</th>
                    <th className="py-2.5 px-3 text-right">Units</th>
                    <th className="py-2.5 px-3 text-right">Value (₹)</th>
                    <th className="py-2.5 px-3">Prepared By</th>
                    <th className="py-2.5 px-3 text-right">Print</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {dispatchRecords.map((dc) => (
                    <tr key={dc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-3 px-3 font-mono font-bold text-[#146b68] dark:text-[#84cc16]">
                        {dc.dispatchNo}
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{dc.dispatchDate}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {dc.customerName}
                      </td>
                      <td className="py-3 px-3 font-mono text-blue-600">{dc.customerPoNumber}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{dc.transporter}</div>
                        <div className="text-[10px] font-mono text-slate-400">Truck: {dc.vehicleNo}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{dc.ewayBillNo}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                        {dc.totalUnits.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600">
                        ₹{dc.totalValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">{dc.dispatchedBy}</td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveDispatchChallan(dc);
                            setShowChallanModal(true);
                          }}
                          className="h-7 text-xs border-slate-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        >
                          <Printer className="w-3.5 h-3.5 mr-1" />
                          View DC
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {dispatchRecords.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        No outward dispatches recorded yet for {selectedPlant}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Registered Buyers Directory */}
      {activeTab === 'customers' && (
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                B2B Customers & Buyer Directory
              </CardTitle>
              <CardDescription>
                Master directory of retail brands, wholesale electrical distributors, and OEM buyers with GST credentials.
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowAddCustomerModal(true)}
              className="bg-[#183638] text-[#84cc16] hover:bg-[#122b2d] border border-[#84cc16]/40 text-xs font-semibold"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Add Registered Buyer
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Company Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">GSTIN / Tax ID</th>
                    <th className="py-2.5 px-3">Location (City, State)</th>
                    <th className="py-2.5 px-3">Contact Person & Phone</th>
                    <th className="py-2.5 px-3">Commercial Terms</th>
                    <th className="py-2.5 px-3 text-right">Orders Placed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {customers.map((c) => {
                    const orderCount = customerPOs.filter(
                      (p) => p.customerName.toLowerCase() === c.name.toLowerCase()
                    ).length;

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{c.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-2.5 h-2.5" />
                            {c.email}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant="outline"
                            className={
                              c.category === 'B2B Brand OEM'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : c.category === 'Regional Distributor'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }
                          >
                            {c.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-slate-600 dark:text-slate-400">
                          {c.gstin}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{c.city}, {c.state}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{c.contactPerson}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" />
                            {c.phone}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                          {c.paymentTerms}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border">
                            {orderCount} Orders
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}


      {/* MODAL 2: Outward Dispatch & Delivery Challan */}
      {showDispatchModal && selectedPOForDispatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  Dispatch Finished Products against PO #{selectedPOForDispatch.customerPoNumber}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Consignee: {selectedPOForDispatch.customerName} &bull; {selectedPOForDispatch.billingCity}
                </p>
              </div>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleProcessDispatch} className="space-y-4 text-xs">
              {/* Product Dispatch Quantity Inputs */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-800 dark:text-slate-200 block">
                  1. Enter Quantities To Dispatch In This Shipment:
                </label>
                <div className="space-y-2">
                  {selectedPOForDispatch.items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-850 space-y-1.5"
                    >
                      <div className="flex justify-between items-center font-medium flex-wrap gap-1">
                        <span className="text-slate-800 dark:text-slate-200">{item.productName}</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-slate-500 font-mono text-[11px]">
                            Pending: <strong className="text-blue-600">{item.pendingQty}</strong> / {item.orderedQty} units
                          </span>
                          {(fgsStockByProductId[item.productId] ?? 0) >= item.pendingQty ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px]">
                              FGS: {(fgsStockByProductId[item.productId] || 0).toLocaleString()} pcs
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 text-[10px]">
                              FGS: {(fgsStockByProductId[item.productId] || 0).toLocaleString()} pcs (Short)
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="text-[10px] text-slate-400 block mb-0.5">Quantity to Ship Now</label>
                          <Input
                            type="number"
                            min="0"
                            max={item.pendingQty}
                            value={dispatchInputs[item.productId] ?? item.pendingQty}
                            onChange={(e) =>
                              setDispatchInputs({
                                ...dispatchInputs,
                                [item.productId]: Math.min(item.pendingQty, Math.max(0, Number(e.target.value)))
                              })
                            }
                            className="h-8 text-xs font-bold text-emerald-600"
                          />
                        </div>
                        <div className="text-[11px] pt-4 text-slate-500">
                          Remaining after: {item.pendingQty - (dispatchInputs[item.productId] || 0)} units
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logistics & Transporter Details */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                  <span>2. Logistics & Transporter Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">
                      Transporter / Freight Carrier *
                    </label>
                    <Input
                      required
                      value={dispatchTransporter}
                      onChange={(e) => setDispatchTransporter(e.target.value)}
                      className="h-8"
                      placeholder="e.g. V-Trans Logistics India"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">
                      Vehicle / Truck Registration # *
                    </label>
                    <Input
                      required
                      value={dispatchVehicleNo}
                      onChange={(e) => setDispatchVehicleNo(e.target.value)}
                      className="h-8 font-mono"
                      placeholder="e.g. MH-12-RN-8812"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">
                      GST E-Way Bill Number *
                    </label>
                    <Input
                      required
                      value={dispatchEwayBill}
                      onChange={(e) => setDispatchEwayBill(e.target.value)}
                      className="h-8 font-mono text-emerald-700 dark:text-emerald-400 font-bold"
                      placeholder="e.g. EWB-991204882190"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">
                      Dispatch Incharge / Prepared By *
                    </label>
                    <Input
                      required
                      value={dispatchOfficer}
                      onChange={(e) => setDispatchOfficer(e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Force Close Option */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-xs">
                <input
                  type="checkbox"
                  id="close-po-check"
                  checked={closeAfterDispatch}
                  onChange={(e) => setCloseAfterDispatch(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="close-po-check" className="text-amber-800 dark:text-amber-300 cursor-pointer">
                  <strong>Mark PO as Closed after this dispatch</strong> (Use if customer accepted short delivery as final)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowDispatchModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Generate Delivery Challan & Dispatch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Printable Delivery Challan Preview */}
      {showChallanModal && activeDispatchChallan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#146b68] dark:text-[#84cc16]" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Delivery Challan (DC) #{activeDispatchChallan.dispatchNo}
                </h2>
              </div>
              <button onClick={() => setShowChallanModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border">
              <div className="flex justify-between border-b pb-2">
                <div>
                  <div className="text-[10px] text-slate-400">Shipper / Factory</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Eiffel LED Lighting Pvt Ltd</div>
                  <div className="text-[10px] text-slate-500">{activeDispatchChallan.plant}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Dispatch Date</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{activeDispatchChallan.dispatchDate}</div>
                </div>
              </div>

              <div className="flex justify-between border-b pb-2">
                <div>
                  <div className="text-[10px] text-slate-400">Consignee / Buyer</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{activeDispatchChallan.customerName}</div>
                  <div className="text-[10px] font-mono text-blue-600">PO: {activeDispatchChallan.customerPoNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Carrier & Truck #</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{activeDispatchChallan.transporter}</div>
                  <div className="text-[10px] font-mono text-slate-500">{activeDispatchChallan.vehicleNo}</div>
                </div>
              </div>

              <table className="w-full text-left text-xs border-b pb-2">
                <thead>
                  <tr className="text-slate-400 text-[10px] border-b">
                    <th className="py-1">Item Description</th>
                    <th className="py-1 text-right">Qty</th>
                    <th className="py-1 text-right">Rate</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {activeDispatchChallan.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1 font-medium">{item.productName}</td>
                      <td className="py-1 text-right font-bold">{item.qty}</td>
                      <td className="py-1 text-right">₹{item.unitPrice}</td>
                      <td className="py-1 text-right font-bold">₹{(item.qty * item.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between font-bold pt-1">
                <span>Total Consignment Value:</span>
                <span className="text-emerald-600 text-sm">₹{activeDispatchChallan.totalValue.toLocaleString()}</span>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t flex justify-between">
                <span>E-Way Bill: {activeDispatchChallan.ewayBillNo}</span>
                <span>Gate Pass Authorized</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setShowChallanModal(false)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  window.print();
                }}
                className="bg-[#183638] text-[#84cc16] hover:bg-[#122b2d] font-bold"
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print Delivery Challan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Add New Registered Customer / Buyer */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#146b68] dark:text-[#84cc16]" />
                  Register New B2B Buyer / Client
                </h2>
                <p className="text-[11px] text-slate-500">
                  Add wholesale distributor or retail OEM partner to your master directory.
                </p>
              </div>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Company / Trade Name *</label>
                <Input
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Syska LED Innovations Pvt Ltd"
                  className="h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newClientCategory}
                    onChange={(e) => setNewClientCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 text-xs"
                  >
                    <option value="B2B Brand OEM">B2B Brand OEM</option>
                    <option value="Regional Distributor">Regional Distributor</option>
                    <option value="Wholesale Trader">Wholesale Trader</option>
                    <option value="Direct Institutional">Direct Institutional</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">GSTIN Number</label>
                  <Input
                    value={newClientGst}
                    onChange={(e) => setNewClientGst(e.target.value)}
                    placeholder="e.g. 27AAECS9812K1Z9"
                    className="h-8 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <Input
                    value={newClientCity}
                    onChange={(e) => setNewClientCity(e.target.value)}
                    placeholder="e.g. Pune"
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">State</label>
                  <Input
                    value={newClientState}
                    onChange={(e) => setNewClientState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Contact Person</label>
                  <Input
                    value={newClientContact}
                    onChange={(e) => setNewClientContact(e.target.value)}
                    placeholder="e.g. Mahesh Agarwal"
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <Input
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="e.g. +91 99230 88200"
                    className="h-8"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Official Email</label>
                <Input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="e.g. procurement@buyer.com"
                  className="h-8"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Payment & Commercial Terms</label>
                <Input
                  value={newClientTerms}
                  onChange={(e) => setNewClientTerms(e.target.value)}
                  placeholder="e.g. 30 Days Net from Delivery Challan"
                  className="h-8"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddCustomerModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#183638] text-[#84cc16] hover:bg-[#122b2d] font-bold">
                  Save Buyer Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersDispatchPage;
