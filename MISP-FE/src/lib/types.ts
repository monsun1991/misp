export interface EmailConfig {
  id: number;
  name: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  isDefault: boolean;
  createdBy: number;
  updatedBy?: number;
  createdAt: string;
  updatedAt: string;
  createdByUser: {
    id: number;
    fullName: string;
    role: string;
  };
  updatedByUser?: {
    id: number;
    fullName: string;
    role: string;
  };
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Opportunity title
  email: string; // Contact email for the lead/opportunity
  phone: string; // Contact phone for the lead/opportunity
  status: 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost' | 'Closed Lost to Competition';
  source: string; // Original source, can still be used or mapped to a tag
  lastContacted: string; // ISO date string
  createdAt: string; // ISO date string
  isConverted?: boolean;
  value: number; // Monetary value of the lead/opportunity
  company?: string; // Associated company/client
  priority: 0 | 1 | 2 | 3; // Star rating
  tags?: Array<{ name: string; className: string }>; // For colored badges e.g. className: "bg-blue-100 text-blue-700"
  
  // Updated assignment structure
  assignee: {
    id: number;
    fullName: string;
    role: string;
  };
  createdByUser: {
    id: number;
    fullName: string;
    role: string;
  };

  // New fields for redesigned detail view
  probability?: number; // e.g., 0.30 for 30%
  expectedClosingDate?: string; // ISO date string
  internalNotes?: string;
  description?: string; // Main description field
  owner?: string; // Lead owner name

  // Additional fields from Add Lead form
  title?: string; // Job title
  mobile?: string;
  secondary_mobile?: string;
  fax?: string;
  website?: string;
  industry?: string;
  numberOfEmployees?: string;
  annualRevenue?: number;
  rating?: 'Hot' | 'Warm' | 'Cold';
  emailOptOut?: boolean;
  skypeId?: string;
  secondaryEmail?: string;
  twitter?: string;

  // Address Information (can be flat or nested)
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  canEdit?: boolean;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  secondary_mobile?: string;
  homePhone?: string;
  otherPhone?: string;
  assistantPhone?: string;
  fax?: string;
  title?: string;
  department?: string;
  assistant?: string;
  dateOfBirth?: string;
  leadSource: string;
  emailOptOut?: boolean;
  skypeId?: string;
  secondaryEmail?: string;
  twitter?: string;
  account?: any
  isConverted?: boolean;
  // Company Information
  accountName?: string;
  vendorName?: string;
  reportingTo?: string;

  // Address Information
  mailingStreet?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingZip?: string;
  mailingCountry?: string;
  otherStreet?: string;
  otherCity?: string;
  otherState?: string;
  otherZip?: string;
  otherCountry?: string;

  // System Information
  contactOwner: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    avatarFallback: string;
  };
  createdAt: string;
  lastModified: string;
  description?: string;

  // Additional fields for functionality
  tags?: Array<{ name: string; className: string }>;
  priority?: 1 | 2 | 3;
  status?: 'Active' | 'Inactive' | 'Qualified' | 'Unqualified';

  // Add new fields
  leadStatus: 'New' | 'Open' | 'Attempted to Contact' | 'Unqualified' | 'Qualified to Buy' | 'Presentation Scheduled' | 'Closed Won' | 'Closed Lost';
  lastContacted?: string; // ISO date string
  companyId?: string; // For proper company association
  companyName?: string; // For display purposes
  
  // Profile Image
  contactImage?: string;
  
  // New Enquiry Fields
  interestedArea?: string;
  unitType?: string;
  expectedPossession?: string;
  interestedProject?: string;
  propertyPurpose?: string;
  budget?: string;
  facing?: string;
  profession?: string;
  
  // Additional fields for API compatibility
  assignedId?: string;
  assignee?: {
    id: number;
    fullName: string;
    role?: string;
    profilePicture?: string;
  };
  accountId?: number;
  mailingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  canEdit?: boolean;
}

export interface Property {
  id: string;
  address: string;
  price: number;
  type: 'Sale' | 'Rent';
  status: 'For Sale' | 'For Rent' | 'Pending' | 'Sold' | 'Rented' | 'Off Market';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl?: string;
  description: string;
  listedDate: string; // ISO date string
}

export interface Appointment {
  id: string;
  title: string;
  date: string; // ISO date string
  time: string;
  leadId?: string;
  propertyId?: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string; // User ID or name for task assignee
  dueDate: string; // ISO date string
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Completed';
  description?: string;
}

export interface User {
  id: string;
  name: string;
  fullName?: string; // Added for API compatibility
  email: string;
  avatarUrl?: string;
  avatarFallback: string; // Added fallback for consistency
}

// For charts
export interface ChartDataItem {
  name: string;
  value: number;
  fill?: string; // Optional color for chart segments
}

export interface ReportChartData {
  title: string;
  data: ChartDataItem[];
}

// Sales Pipeline Management Types
export interface SalesStage {
  id: string;
  name: string;
  sequence: number;
  isWonStage: boolean;
  isLostStage: boolean;
  probability: number; // Default probability for deals in this stage
  color: string; // For visual representation
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  expectedRevenue: number;
  expectedClosingDate: string; // ISO date string
  stageId: string;
  stage: SalesStage;
  probability: number; // Can be manually overridden
  status: 'Open' | 'Closed Won' | 'Closed Lost';
  // Associations
  contactId?: string;
  contact?: Contact;
  companyId?: string;
  companyName?: string;

  // Owner and assignment
  ownerId: string;
  assignedId?: string | null;
  owner: User;

  // Additional information
  dealType: 'New Business' | 'Existing Business' | 'Renewal' | 'Upsell';
  leadSource?: string;
  notes?: string;
  description?: string;

  // Lost deal information
  lostReasonId?: string;
  lostReason?: LostReason;
  lostDate?: string;

  // System information
  createdAt: string;
  updatedAt: string;

  // Activity summary for kanban display
  activitySummary: {
    planned: number;
    dueToday: number;
    overdue: number;
    total: number;
  };

  primaryContact: {
    firstName: string;
    lastName: string

  }

  // Tags for categorization
  tags?: Array<{ name: string; className: string }>;

  // Additional fields for API compatibility
  salesStage?: string;
  dealSource?: string;
  winProbability?: number;
  primaryContactId?: number;
  accountId?: number;
  account?: {
    id: number;
    accountName: string;
  };

  // Patient registration fields
  isRegistered?: boolean;
  registrationResponseId?: string;
  crmRequestId?: string;
  locationId?: string;
  leadId?: string;
  lead?: {
    firstName?: string;
    lastName?: string;
  };
}

export interface LostReason {
  id: string;
  reason: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DealActivity {
  id: string;
  dealId: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Task' | 'Note';
  title: string;
  description?: string;
  status: 'Planned' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate?: string; // ISO date string
  completedDate?: string; // ISO date string
  assignedTo: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface DealNote {
  id: string;
  dealId: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

// Form types for deal management
export interface CreateDealForm {
  title: string;
  expectedRevenue: number;
  expectedClosingDate: string;
  stageId: string;
  probability: number;
  contactId?: string;
  companyId?: string;
  dealType: Deal['dealType'];
  leadSource?: string;
  notes?: string;
  description?: string;
}

export interface UpdateDealForm extends Partial<CreateDealForm> {
  id: string;
}

export interface MarkDealLostForm {
  dealId: string;
  lostReasonId: string;
  customReason?: string;
  notes?: string;
}

// Purchase Order Management Types
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  title: string;
  description?: string;

  // Vendor Information
  vendorId: string;
  vendorName: string;
  vendorEmail?: string;
  vendorPhone?: string;

  // Financial Information
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;

  // Status and Dates
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Sent to Vendor' | 'Acknowledged' | 'In Progress' | 'Partially Received' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';

  // Important Dates
  createdDate: string; // ISO date string
  requiredDate: string; // ISO date string
  approvedDate?: string; // ISO date string
  sentDate?: string; // ISO date string
  expectedDeliveryDate?: string; // ISO date string

  // Ownership and Assignment
  createdBy: User;
  assignedTo?: User;
  approvedBy?: User;

  // Line Items
  items: PurchaseOrderItem[];

  // Additional Information
  notes?: string;
  terms?: string;
  shippingAddress?: Address;
  billingAddress?: Address;

  // Tracking
  trackingNumber?: string;
  deliveryStatus?: 'Not Shipped' | 'Shipped' | 'In Transit' | 'Delivered' | 'Delayed';

  // System Information
  updatedAt: string;
  tags?: Array<{ name: string; className: string }>;
}

export interface PurchaseOrderItem {
  id: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string; // e.g., 'pcs', 'kg', 'hours'
  category?: string;
  receivedQuantity?: number;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  contactPerson?: string;
  address?: Address;
  paymentTerms?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form types for purchase order management
export interface CreatePurchaseOrderForm {
  title: string;
  description?: string;
  vendorId: string;
  requiredDate: string;
  priority: PurchaseOrder['priority'];
  items: Omit<PurchaseOrderItem, 'id' | 'totalPrice'>[];
  notes?: string;
  terms?: string;
  shippingAddress?: Address;
}

export interface UpdatePurchaseOrderForm extends Partial<CreatePurchaseOrderForm> {
  id: string;
}

export interface POStatusUpdate {
  poId: string;
  newStatus: PurchaseOrder['status'];
  notes?: string;
  trackingNumber?: string;
}

export interface Account {
  id: string;
  accountName: string;
  phone?: string;
  website?: string;
  accountOwner: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    avatarFallback: string;
  };

  // Account Information
  accountNumber?: string;
  accountSite?: string;
  parentAccount?: string;
  accountType?: 'Prospect' | 'Customer' | 'Investor' | 'Partner' | 'Reseller' | 'Other';
  industry?: string;
  annualRevenue?: number;
  employees?: string;
  ownership?: 'Public' | 'Private' | 'Subsidiary' | 'Other';
  tickerSymbol?: string;
  rating?: 'Hot' | 'Warm' | 'Cold';

  // Address Information
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingCode?: string;
  billingCountry?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCode?: string;
  shippingCountry?: string;

  // System Information
  createdAt: string;
  lastModified: string;
  description?: string;

  // Additional fields
  tags?: Array<{ name: string; className: string }>;
  priority?: 1 | 2 | 3;
  status?: 'Active' | 'Inactive';
}

// Quotations Drive Types
export interface DriveFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: number;
    fullName: string;
  };
}

export interface DriveFile {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: number;
    fullName: string;
  };
}

export interface DriveItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
  folderId?: string | null;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  fileName?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: number;
    fullName: string;
  };
}

