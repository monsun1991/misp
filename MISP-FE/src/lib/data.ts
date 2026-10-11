import type { Task, ReportChartData, Appointment, User, Contact, SalesStage, LostReason, PurchaseOrder, Vendor, Account } from './types';
import { addMonths, formatISO, subDays } from 'date-fns';

export const mockUser: User = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex.johnson@mips.com',
  avatarUrl: 'https://placehold.co/40x40.png?text=AJ',
  avatarFallback: 'AJ'
};

const janeDoe: User = {
  id: 'user2',
  name: 'Jane Doe',
  email: 'jane.doe@mips.com',
  avatarUrl: 'https://placehold.co/40x40.png?text=JD',
  avatarFallback: 'JD'
};

const mikeBrown: User = {
  id: 'user3',
  name: 'Mitchell Admin',
  email: 'mitchell.admin@mips.com',
  avatarUrl: 'https://placehold.co/40x40.png?text=MA',
  avatarFallback: 'MA'
};

const today = new Date();

export const mockLeads: any[] = [
  { 
    id: 'lead1', 
    name: 'Dubai Marina Apartment Inquiry', 
    email: 'ahmed.hassan@emiratesgroup.ae', 
    phone: '+971-50-123-4567', 
    status: 'New', 
    source: 'Website', 
    lastContacted: new Date(2024, 6, 1).toISOString(), 
    createdAt: new Date(2024, 6, 1).toISOString(),
    value: 1850000,
    company: 'Emirates Investment Group',
    priority: 2, 
    tags: [{ name: 'Residential', className: 'bg-blue-100 text-blue-700' }],
    assignee: janeDoe,
    probability: 0.30,
    expectedClosingDate: formatISO(addMonths(today, 1)),
    internalNotes: 'Client looking for 2-bedroom apartment in Dubai Marina. Budget confirmed at AED 1.8M. Prefers high floor with marina views.',
    description: 'Interested in purchasing a luxury apartment in Dubai Marina with marina views',
    owner: 'Jane Doe',
    title: 'Investment Manager',
    mobile: '+971-55-987-6543',
    fax: '+971-4-123-4567',
    website: 'https://www.emiratesgroup.ae',
    industry: 'Investment',
    numberOfEmployees: '50-100',
    annualRevenue: 12000000,
    rating: 'Warm',
    emailOptOut: false,
    skypeId: 'ahmed.emirates',
    secondaryEmail: 'ahmed.h@emiratesgroup.ae',
    twitter: '@ahmedhassan_uae',
    street: 'Sheikh Zayed Road',
    city: 'Dubai',
    state: 'Dubai',
    zipCode: '00000',
    country: 'UAE'
  },
  { 
    id: 'lead2', 
    name: 'Palm Jumeirah Villa Rental', 
    email: 'sarah.williams@luxuryproperties.ae', 
    phone: '+971-52-234-5678', 
    status: 'New', 
    source: 'Referral', 
    lastContacted: new Date(2024, 6, 5).toISOString(), 
    createdAt: new Date(2024, 5, 28).toISOString(),
    value: 450000,
    company: 'Luxury Properties UAE',
    priority: 1, 
    tags: [{ name: 'Luxury', className: 'bg-yellow-100 text-yellow-700' }],
    assignee: mockUser,
    probability: 0.10,
    expectedClosingDate: formatISO(addMonths(today, 2)),
    internalNotes: 'Client interested in luxury villa rental on Palm Jumeirah. Annual rental budget AED 450K. Looking for 4+ bedrooms with private beach access.',
    description: 'Looking for luxury villa rental on Palm Jumeirah with private beach access',
    owner: 'Alex Johnson',
    title: 'Property Director',
    mobile: '+971-56-345-6789',
    industry: 'Real Estate',
    numberOfEmployees: '20-50',
    annualRevenue: 8000000,
    rating: 'Cold',
    emailOptOut: false,
    street: 'Business Bay',
    city: 'Dubai',
    state: 'Dubai',
    zipCode: '00000',
    country: 'UAE'
  },
  { 
    id: 'lead3', 
    name: 'Business Bay Office Space', 
    email: 'info@globalcorp.ae', 
    phone: '+971-4-567-8901', 
    status: 'Qualified', 
    source: 'Cold Call', 
    lastContacted: new Date(2024, 6, 10).toISOString(), 
    createdAt: new Date(2024, 5, 15).toISOString(),
    value: 2200000,
    company: 'Global Corp UAE',
    priority: 3, 
    tags: [
      { name: 'Commercial', className: 'bg-blue-100 text-blue-700' },
      { name: 'Office Space', className: 'bg-green-100 text-green-700' }
    ],
    assignee: janeDoe,
    probability: 0.75,
    expectedClosingDate: formatISO(addMonths(today, 1)),
    internalNotes: 'Met at the property expo. Very interested in premium office space. Budget confirmed for AED 2.2M.',
    description: 'Multinational company looking for premium office space in Business Bay',
    owner: 'Jane Doe',
    title: 'Regional Director',
    mobile: '+971-55-678-9012',
    fax: '+971-4-567-8902',
    website: 'https://www.globalcorp.ae',
    industry: 'Corporate Services',
    numberOfEmployees: '100-500',
    annualRevenue: 50000000,
    rating: 'Hot',
    emailOptOut: false,
    skypeId: 'global.corp',
    secondaryEmail: 'director@globalcorp.ae',
    twitter: '@globalcorp_uae',
    street: 'Dubai International Financial Centre',
    city: 'Dubai',
    state: 'Dubai',
    zipCode: '00000',
    country: 'UAE'
  },
  { 
    id: 'lead4', 
    name: 'DeltaPC: 10 Computer Desks', 
    email: 'purchasing@readymat.com', 
    phone: '555-4444', 
    status: 'Qualified', 
    source: 'Social Media', 
    lastContacted: new Date(2024, 6, 12).toISOString(), 
    createdAt: new Date(2024, 5, 10).toISOString(),
    value: 35000,
    company: 'Ready Mat',
    priority: 1,
    tags: [
      { name: 'Information', className: 'bg-blue-100 text-blue-700' },
      { name: 'Training', className: 'bg-green-100 text-green-700' }
    ],
    assignee: mockUser,
    probability: 0.10,
    expectedClosingDate: formatISO(addMonths(today, 3)),
    internalNotes: 'Initial contact made. Sent brochure. Follow up in 2 weeks.',
    description: 'Computer desk order for manufacturing facility upgrade',
    owner: 'Alex Johnson',
    title: 'Purchasing Manager',
    mobile: '555-4445',
    industry: 'Manufacturing',
    numberOfEmployees: '200-500',
    rating: 'Warm',
    emailOptOut: true,
    street: '321 Industrial Way',
    city: 'Detroit',
    state: 'MI',
    zipCode: '48201',
    country: 'USA'
  },
  {
    id: 'lead5',
    name: 'Open Space Design',
    email: 'projects@decoaddict.com',
    phone: '555-5555',
    status: 'Proposition',
    source: 'Website',
    lastContacted: new Date(2024, 6, 15).toISOString(),
    createdAt: new Date(2024, 6, 2).toISOString(),
    value: 11000,
    company: 'Deco Addict',
    priority: 3,
    tags: [{ name: 'Design', className: 'bg-purple-100 text-purple-700' }],
    assignee: janeDoe,
    probability: 0.60,
    expectedClosingDate: formatISO(addMonths(today, 0.5)),
    internalNotes: 'Proposal sent. Awaiting feedback. They mentioned a competitor is also in the running.',
    description: 'Open space office design consultation and implementation',
    owner: 'Jane Doe',
    title: 'Design Director',
    mobile: '555-5556',
    website: 'https://www.decoaddict.com',
    industry: 'Design',
    numberOfEmployees: '10-20',
    rating: 'Hot',
    emailOptOut: false,
    skypeId: 'decoaddict.projects',
    twitter: 'decoaddict',
    street: '654 Design Ave',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    country: 'USA'
  },
  {
    id: 'lead6',
    name: 'Office Design and Architecture',
    email: 'contact@florencedesign.com',
    phone: '555-6666',
    status: 'Proposition',
    source: 'Website',
    lastContacted: new Date(2024, 6, 18).toISOString(),
    createdAt: new Date(2024, 6, 8).toISOString(),
    value: 15000,
    company: 'Florence Design Co',
    priority: 2,
    tags: [{ name: 'Design', className: 'bg-purple-100 text-purple-700' }],
    assignee: mockUser,
    probability: 0.40,
    expectedClosingDate: formatISO(addMonths(today, 2)),
    internalNotes: 'Architecture firm looking for office renovation. Budget approved.',
    description: 'Complete office design and architecture services',
    owner: 'Alex Johnson',
    title: 'Lead Architect',
    mobile: '555-6667',
    industry: 'Architecture',
    numberOfEmployees: '5-10',
    rating: 'Warm',
    emailOptOut: false
  },
  {
    id: 'lead7',
    name: 'Bulk Furniture Order',
    email: 'procurement@techcorp.com',
    phone: '555-7777',
    status: 'Won',
    source: 'Referral',
    lastContacted: new Date(2024, 6, 20).toISOString(),
    createdAt: new Date(2024, 5, 25).toISOString(),
    value: 75000,
    company: 'Tech Corp Solutions',
    priority: 3,
    tags: [{ name: 'Product', className: 'bg-pink-100 text-pink-700' }],
    assignee: janeDoe,
    probability: 1.0, 
    expectedClosingDate: formatISO(addMonths(today, -1)),
    internalNotes: 'Large furniture order completed successfully. Potential for future orders.',
    description: 'Bulk office furniture procurement for new headquarters',
    owner: 'Jane Doe',
    title: 'Procurement Manager',
    mobile: '555-7778',
    industry: 'Technology',
    numberOfEmployees: '500+',
    rating: 'Hot',
    emailOptOut: false
  },
   {
    id: 'lead8',
    name: 'Conference Room Setup',
    email: 'facilities@startupinc.com',
    phone: '555-8888',
    status: 'Qualified',
    source: 'Social Media',
    lastContacted: new Date(2024, 6, 22).toISOString(),
    createdAt: new Date(2024, 6, 12).toISOString(),
    value: 8000,
    company: 'Startup Inc',
    priority: 2,
    tags: [{ name: 'Information', className: 'bg-blue-100 text-blue-700' }],
    assignee: mockUser,
    probability: 0.65,
    expectedClosingDate: formatISO(addMonths(today, 1)),
    internalNotes: 'Startup looking to set up professional conference rooms. Quick decision makers.',
    description: 'Conference room furniture and AV equipment setup',
    owner: 'Alex Johnson',
    title: 'Facilities Manager',
    mobile: '555-8889',
    industry: 'Technology',
    numberOfEmployees: '10-50',
    rating: 'Warm',
    emailOptOut: false
  },
  {
    id: 'lead9',
    name: 'Retail Store Fixtures',
    email: 'design@retailstore.com',
    phone: '555-9999',
    status: 'Proposition',
    source: 'Trade Show',
    lastContacted: new Date(2024, 6, 25).toISOString(),
    createdAt: new Date(2024, 6, 15).toISOString(),
    value: 25000,
    company: 'Retail Store Chain',
    priority: 3,
    tags: [{ name: 'Design', className: 'bg-purple-100 text-purple-700' }],
    assignee: janeDoe,
    probability: 0.50,
    expectedClosingDate: formatISO(addMonths(today, 2)),
    internalNotes: 'Retail chain expansion project. Multiple store locations planned.',
    description: 'Custom retail store fixtures and display units',
    owner: 'Jane Doe',
    title: 'Store Design Manager',
    mobile: '555-9990',
    industry: 'Retail',
    numberOfEmployees: '100-200',
    rating: 'Hot',
    emailOptOut: false
  },
   {
    id: 'lead10',
    name: 'Medical Office Furniture',
    email: 'admin@healthclinic.com',
    phone: '555-0000',
    status: 'Won',
    source: 'Website',
    lastContacted: new Date(2024, 6, 28).toISOString(),
    createdAt: new Date(2024, 6, 18).toISOString(),
    value: 18000,
    company: 'Health Clinic Network',
    priority: 1,
    tags: [{ name: 'Product', className: 'bg-pink-100 text-pink-700' }],
    assignee: mockUser,
    probability: 1.0,
    expectedClosingDate: formatISO(addMonths(today, 0)),
    internalNotes: 'Medical office furniture order completed. Excellent customer satisfaction.',
    description: 'Specialized medical office furniture and equipment',
    owner: 'Alex Johnson',
    title: 'Office Administrator',
    mobile: '555-0001',
    industry: 'Healthcare',
    numberOfEmployees: '50-100',
    rating: 'Hot',
    emailOptOut: false
  }
];

export const mockProperties: any[] = [
  { id: 'prop1', address: '123 Main St, Anytown, USA', price: 350000, type: 'Sale', status: 'For Sale', bedrooms: 3, bathrooms: 2, sqft: 1800, imageUrl: 'https://placehold.co/600x400.png?text=Main+St', description: 'Charming suburban home with a large backyard.', listedDate: new Date(2024, 5, 1).toISOString(), "data-ai-hint": "suburban house" },
  { id: 'prop2', address: '456 Oak Ave, Anytown, USA', price: 2200, type: 'Rent', status: 'For Rent', bedrooms: 2, bathrooms: 1, sqft: 1200, imageUrl: 'https://placehold.co/600x400.png?text=Oak+Ave', description: 'Modern apartment in the city center, close to amenities.', listedDate: new Date(2024, 5, 15).toISOString(), "data-ai-hint": "apartment building" },
  { id: 'prop3', address: '789 Pine Ln, Anytown, USA', price: 550000, type: 'Sale', status: 'Pending', bedrooms: 4, bathrooms: 3, sqft: 2500, imageUrl: 'https://placehold.co/600x400.png?text=Pine+Ln', description: 'Spacious family home with a pool and renovated kitchen.', listedDate: new Date(2024, 4, 20).toISOString(), "data-ai-hint": "family home" },
  { id: 'prop4', address: '101 Maple Dr, Anytown, USA', price: 450000, type: 'Sale', status: 'Sold', bedrooms: 3, bathrooms: 2.5, sqft: 2200, imageUrl: 'https://placehold.co/600x400.png?text=Maple+Dr', description: 'Beautifully renovated home, sold quickly!', listedDate: new Date(2024, 3, 10).toISOString(), "data-ai-hint": "modern house" },
  { id: 'prop5', address: '222 Birch Pl, Anytown, USA', price: 1800, type: 'Rent', status: 'Rented', bedrooms: 1, bathrooms: 1, sqft: 800, imageUrl: 'https://placehold.co/600x400.png?text=Birch+Pl', description: 'Cozy downtown studio, recently rented.', listedDate: new Date(2024, 4, 5).toISOString(), "data-ai-hint": "studio apartment" },
  { id: 'prop6', address: '333 Cedar Ct, Anytown, USA', price: 650000, type: 'Sale', status: 'For Sale', bedrooms: 5, bathrooms: 4, sqft: 3000, imageUrl: 'https://placehold.co/600x400.png?text=Cedar+Ct', description: 'Luxury estate with stunning views.', listedDate: new Date(2024, 6, 1).toISOString(), "data-ai-hint": "luxury estate" },
  { id: 'prop7', address: '777 Willow Way, Otherville, USA', price: 280000, type: 'Sale', status: 'Off Market', bedrooms: 3, bathrooms: 2, sqft: 1600, imageUrl: 'https://placehold.co/600x400.png?text=Willow+Way', description: 'Temporarily off market, owner doing renovations.', listedDate: subDays(today, 90).toISOString(), "data-ai-hint": "house renovation" },
];

export const mockAppointments: Appointment[] = [
    { id: 'app1', title: 'Viewing for 123 Main St', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), time: '10:00 AM', leadId: 'lead1', propertyId: 'prop1'},
    { id: 'app2', title: 'Follow-up call with Bob', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), time: '02:30 PM', leadId: 'lead3'}, 
    { id: 'app3', title: 'Client Meeting - Deco Addict', date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), time: '11:00 AM', leadId: 'lead1'}, 
];

export const mockTasks: Task[] = [
  { id: 'task1', title: 'Follow up with Deco Addict', assignee: 'Alex Johnson', dueDate: new Date(2024, 6, 20).toISOString(), priority: 'High', status: 'To Do' },
  { id: 'task2', title: 'Prepare documents for Gemini Furniture', assignee: 'Jane Doe', dueDate: new Date(2024, 6, 22).toISOString(), priority: 'Medium', status: 'In Progress' },
  { id: 'task3', title: 'Schedule viewing for The Jackson Group', assignee: 'Alex Johnson', dueDate: new Date(2024, 6, 18).toISOString(), priority: 'High', status: 'Completed' },
];

export const mockLeadSourceReport: ReportChartData = {
  title: 'Lead Source Performance',
  data: [
    { name: 'Website', value: 150, fill: 'hsl(var(--chart-1))' },
    { name: 'Referral', value: 120, fill: 'hsl(var(--chart-2))' },
    { name: 'Cold Call', value: 80, fill: 'hsl(var(--chart-3))' },
    { name: 'Social Media', value: 100, fill: 'hsl(var(--chart-4))' },
    { name: 'Other', value: 50, fill: 'hsl(var(--chart-5))' },
  ],
};

export const mockSalesPipelineReport: ReportChartData = {
  title: 'Pipeline by Stage', 
  data: [
    { name: 'New', value: 50, fill: 'hsl(var(--chart-1))' },
    { name: 'Contacted', value: 40, fill: 'hsl(var(--chart-2))' }, 
    { name: 'Qualified', value: 30, fill: 'hsl(var(--chart-3))' },
    { name: 'Proposition', value: 20, fill: 'hsl(var(--chart-4))' }, 
    { name: 'Won', value: 10, fill: 'hsl(var(--chart-5))' }, 
  ],
};

export const mockAgentPerformanceReport: ReportChartData = {
  title: 'Agent Performance (Deals Closed)',
  data: [
    { name: 'Alex Johnson', value: 12, fill: 'hsl(var(--chart-1))' },
    { name: 'Jane Doe', value: 9, fill: 'hsl(var(--chart-2))' },
    { name: 'Mike Brown', value: 7, fill: 'hsl(var(--chart-3))' },
  ],
};

// Updated to be more consistent with mockLeads after changes
export const mockPipelineByProbabilityReport: ReportChartData = {
  title: 'Pipeline by Probability',
  data: [
    // Counts based on current mockLeads:
    // lead2 (0.10), lead4 (0.10) -> 2 leads
    { name: '10%', value: 2, fill: 'hsl(var(--chart-1))' }, 
    // No leads at 0.20
    { name: '20%', value: 0, fill: 'hsl(var(--chart-2))' }, 
    // lead1 (0.30) -> 1 lead
    { name: '30%', value: 1, fill: 'hsl(var(--chart-default))' }, // Added a 30% category if needed
    // lead6 (0.40) -> 1 lead
    { name: '40%', value: 1, fill: 'hsl(var(--chart-3))' }, 
    // No leads at 0.50
    { name: '50%', value: 0, fill: 'hsl(var(--chart-4))' }, 
    // lead5 (0.60) -> 1 lead
    { name: '60%', value: 1, fill: 'hsl(var(--chart-5))' }, 
    // lead8 (0.65) -> 1 lead
    { name: '65%', value: 1, fill: 'hsl(var(--chart-default))' }, // Added a 65% category if needed
    // lead3 (0.75) -> 1 lead
    { name: '75%', value: 1, fill: 'hsl(var(--chart-1))' }, 
    // lead9 (0.80) -> 1 lead
    { name: '80%', value: 1, fill: 'hsl(var(--chart-2))' }, 
    // No leads at 0.85
    { name: '85%', value: 0, fill: 'hsl(var(--chart-3))' },
     // No leads at 0.90
    { name: '90%', value: 0, fill: 'hsl(var(--chart-4))' },
     // No leads at 0.95
    { name: '95%', value: 0, fill: 'hsl(var(--chart-5))' },
    // lead7 (1.0), lead10 (1.0) -> 2 leads
    { name: '100%', value: 2, fill: 'hsl(var(--chart-default))' } // Added a 100% category
  ].filter(item => item.value > 0 || ['10%', '20%', '40%', '50%', '60%', '75%', '80%', '85%', '90%', '95%'].includes(item.name) ), // Keep original categories, or only show those with data
};


// This data is no longer used for Zylker Big Deals but kept for reference or potential future use
export const mockBigDealsReport: ReportChartData = {
  title: 'Zylker Big Deals (Example - Not Currently Displayed)',
  data: [
    { name: '02/17/2020', value: 3, fill: 'hsl(var(--chart-1))' },
    { name: '03/19/2020', value: 7, fill: 'hsl(var(--chart-2))' },
    { name: '04/11/2020', value: 3, fill: 'hsl(var(--chart-3))' },
    { name: '04/16/2020', value: 5, fill: 'hsl(var(--chart-4))' },
    { name: '04/17/2020', value: 5, fill: 'hsl(var(--chart-5))' },
    { name: '04/18/2020', value: 2, fill: 'hsl(var(--chart-1))' },
    { name: '04/23/2020', value: 5, fill: 'hsl(var(--chart-2))' },
    { name: '05/16/2020', value: 5, fill: 'hsl(var(--chart-3))' },
  ],
};

export const mockDealsByTypeReport: ReportChartData = {
  title: 'Deals by Type',
  data: [
    { name: 'Qualified', value: 97, fill: 'hsl(var(--chart-1))' },
    { name: 'Existing Business', value: 11, fill: 'hsl(var(--chart-2))' },
    { name: 'New Business', value: 12, fill: 'hsl(var(--chart-3))' },
  ],
};

export const mockContacts: Contact[] = [
  {
    id: 'contact1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@decocorp.com',
    phone: '555-1111',
    mobile: '555-1112',
    homePhone: '555-1110',
    otherPhone: '555-1114',
    fax: '555-1115',
    title: 'Project Manager',
    department: 'Operations',
    assistant: 'Mary Johnson',
    assistantPhone: '555-1116',
    dateOfBirth: '1985-03-15',
    leadSource: 'Website',
    leadStatus: 'Qualified to Buy',
    emailOptOut: false,
    skypeId: 'john.smith.deco',
    secondaryEmail: 'j.smith@decocorp.com',
    twitter: '@johnsmith_deco',
    reportingTo: 'Sarah Wilson',
    accountName: 'Deco Corp',
    vendorName: 'Deco Vendor Solutions',
    companyName: 'Deco Corp',
    mailingStreet: '123 Business Ave',
    mailingCity: 'New York',
    mailingState: 'NY',
    mailingCountry: 'USA',
    mailingZip: '10001',
    otherStreet: '456 Secondary St',
    otherCity: 'Brooklyn',
    otherState: 'NY',
    otherCountry: 'USA',
    otherZip: '11201',
    contactOwner: janeDoe,
    createdAt: new Date(2024, 6, 1).toISOString(),
    lastModified: new Date(2024, 6, 15).toISOString(),
    lastContacted: new Date(2024, 6, 10).toISOString(),
    status: 'Active',
    priority: 2,
    description: 'Key contact for office furniture projects. Very responsive and detail-oriented. Has been working with us for over 2 years and consistently brings high-value projects.',
    tags: [
      { name: 'VIP', className: 'bg-yellow-100 text-yellow-700' },
      { name: 'Decision Maker', className: 'bg-blue-100 text-blue-700' }
    ]
  },
  {
    id: 'contact2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@gemini.com',
    phone: '555-2222',
    mobile: '555-2223',
    homePhone: '555-2220',
    otherPhone: '555-2224',
    fax: '555-2225',
    title: 'Interior Designer',
    department: 'Design',
    assistant: 'Tom Wilson',
    assistantPhone: '555-2226',
    dateOfBirth: '1990-07-22',
    leadSource: 'Referral',
    leadStatus: 'New',
    emailOptOut: false,
    skypeId: 'sarah.gemini',
    secondaryEmail: 'sarah.j@gemini.com',
    twitter: '@sarahdesigns',
    reportingTo: 'Michael Davis',
    accountName: 'Gemini Design Studio',
    vendorName: 'Gemini Supplies',
    companyName: 'Gemini Design Studio',
    mailingStreet: '456 Creative Blvd',
    mailingCity: 'Los Angeles',
    mailingState: 'CA',
    mailingCountry: 'USA',
    mailingZip: '90210',
    otherStreet: '789 Art District',
    otherCity: 'Hollywood',
    otherState: 'CA',
    otherCountry: 'USA',
    otherZip: '90028',
    contactOwner: mockUser,
    createdAt: new Date(2024, 5, 15).toISOString(),
    lastModified: new Date(2024, 6, 10).toISOString(),
    lastContacted: new Date(2024, 6, 5).toISOString(),
    status: 'Active',
    priority: 3,
    description: 'Talented interior designer with high-end residential projects. Strong preference for modern furniture and sustainable materials.',
    tags: [
      { name: 'Designer', className: 'bg-purple-100 text-purple-700' },
      { name: 'High Value', className: 'bg-green-100 text-green-700' }
    ]
  },
  {
    id: 'contact3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@techstart.io',
    phone: '555-3333',
    mobile: '555-3334',
    homePhone: '555-3330',
    otherPhone: '555-3335',
    fax: '555-3336',
    title: 'CTO',
    department: 'Technology',
    assistant: 'Lisa Park',
    assistantPhone: '555-3337',
    dateOfBirth: '1988-11-08',
    leadSource: 'Social Media',
    leadStatus: 'Presentation Scheduled',
    emailOptOut: false,
    skypeId: 'michael.techstart',
    secondaryEmail: 'm.chen@techstart.io',
    twitter: '@mchen_tech',
    reportingTo: 'Jennifer Liu',
    accountName: 'TechStart Solutions',
    vendorName: 'Tech Vendor Hub',
    companyName: 'TechStart Solutions',
    mailingStreet: '789 Innovation Way',
    mailingCity: 'San Francisco',
    mailingState: 'CA',
    mailingCountry: 'USA',
    mailingZip: '94105',
    otherStreet: '321 Tech Park',
    otherCity: 'Palo Alto',
    otherState: 'CA',
    otherCountry: 'USA',
    otherZip: '94301',
    contactOwner: mikeBrown,
    createdAt: new Date(2024, 4, 20).toISOString(),
    lastModified: new Date(2024, 6, 5).toISOString(),
    lastContacted: new Date(2024, 6, 3).toISOString(),
    status: 'Qualified',
    priority: 1,
    description: 'Tech startup CTO looking for modern office furniture. Budget-conscious but values quality. Interested in ergonomic solutions for their growing team.',
    tags: [
      { name: 'Tech', className: 'bg-blue-100 text-blue-700' },
      { name: 'Startup', className: 'bg-orange-100 text-orange-700' }
    ]
  },
  {
    id: 'contact4',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@wellness.com',
    phone: '555-4444',
    mobile: '555-4445',
    homePhone: '555-4440',
    otherPhone: '555-4446',
    fax: '555-4447',
    title: 'Operations Director',
    department: 'Operations',
    assistant: 'Carlos Martinez',
    assistantPhone: '555-4448',
    dateOfBirth: '1987-04-12',
    leadSource: 'Cold Calling',
    leadStatus: 'Open',
    emailOptOut: true,
    skypeId: 'emily.wellness',
    secondaryEmail: 'e.rodriguez@wellness.com',
    twitter: '@emilyhealth',
    reportingTo: 'Dr. Patricia Smith',
    accountName: 'Wellness Center Inc',
    vendorName: 'Health Vendors LLC',
    companyName: 'Wellness Center Inc',
    mailingStreet: '321 Health Street',
    mailingCity: 'Miami',
    mailingState: 'FL',
    mailingCountry: 'USA',
    mailingZip: '33101',
    otherStreet: '654 Wellness Blvd',
    otherCity: 'Fort Lauderdale',
    otherState: 'FL',
    otherCountry: 'USA',
    otherZip: '33301',
    contactOwner: janeDoe,
    createdAt: new Date(2024, 3, 10).toISOString(),
    lastModified: new Date(2024, 5, 25).toISOString(),
    lastContacted: new Date(2024, 5, 20).toISOString(),
    status: 'Active',
    priority: 2,
    description: 'Managing expansion of wellness centers. Interested in ergonomic office solutions and wellness-focused furniture designs.',
    tags: [
      { name: 'Healthcare', className: 'bg-green-100 text-green-700' }
    ]
  },
  {
    id: 'contact5',
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@financial.com',
    phone: '555-5555',
    mobile: '555-5556',
    homePhone: '555-5550',
    otherPhone: '555-5557',
    fax: '555-5558',
    title: 'Managing Partner',
    department: 'Executive',
    assistant: 'Rachel Green',
    assistantPhone: '555-5559',
    dateOfBirth: '1975-09-30',
    leadSource: 'Trade Show',
    leadStatus: 'Closed Won',
    emailOptOut: false,
    skypeId: 'david.financial',
    secondaryEmail: 'd.thompson@financial.com',
    twitter: '@davidfinance',
    reportingTo: 'Board of Directors',
    accountName: 'Thompson Financial Group',
    vendorName: 'Financial Vendors Inc',
    companyName: 'Thompson Financial Group',
    mailingStreet: '654 Wall Street',
    mailingCity: 'New York',
    mailingState: 'NY',
    mailingCountry: 'USA',
    mailingZip: '10005',
    otherStreet: '987 Finance Ave',
    otherCity: 'Manhattan',
    otherState: 'NY',
    otherCountry: 'USA',
    otherZip: '10006',
    contactOwner: mockUser,
    createdAt: new Date(2024, 2, 5).toISOString(),
    lastModified: new Date(2024, 6, 1).toISOString(),
    lastContacted: new Date(2024, 5, 28).toISOString(),
    status: 'Active',
    priority: 3,
    description: 'Financial services firm expanding their office space. Prefers traditional, high-quality furniture. Has a substantial budget for office renovation.',
    tags: [
      { name: 'Finance', className: 'bg-indigo-100 text-indigo-700' },
      { name: 'Executive', className: 'bg-red-100 text-red-700' }
    ]
  },
  {
    id: 'contact6',
    firstName: 'Lisa',
    lastName: 'Wang',
    email: 'lisa.wang@creative.agency',
    phone: '555-6666',
    mobile: '555-6667',
    homePhone: '555-6660',
    otherPhone: '555-6668',
    fax: '555-6669',
    title: 'Creative Director',
    department: 'Creative',
    assistant: 'Alex Kim',
    assistantPhone: '555-6670',
    dateOfBirth: '1992-01-18',
    leadSource: 'Website',
    leadStatus: 'Attempted to Contact',
    emailOptOut: false,
    skypeId: 'lisa.creative',
    secondaryEmail: 'l.wang@creative.agency',
    twitter: '@lisacreative',
    reportingTo: 'Creative Board',
    accountName: 'Creative Minds Agency',
    vendorName: 'Creative Supplies Co',
    companyName: 'Creative Minds Agency',
    mailingStreet: '987 Art District',
    mailingCity: 'Austin',
    mailingState: 'TX',
    mailingCountry: 'USA',
    mailingZip: '73301',
    otherStreet: '123 Creative Lane',
    otherCity: 'Austin',
    otherState: 'TX',
    otherCountry: 'USA',
    otherZip: '73302',
    contactOwner: mikeBrown,
    createdAt: new Date(2024, 1, 12).toISOString(),
    lastModified: new Date(2024, 5, 20).toISOString(),
    lastContacted: new Date(2024, 5, 15).toISOString(),
    status: 'Inactive',
    priority: 1,
    description: 'Creative agency looking for unique, artistic furniture pieces. Values aesthetics over traditional office furniture. Interested in custom designs.',
    tags: [
      { name: 'Creative', className: 'bg-pink-100 text-pink-700' },
      { name: 'Artistic', className: 'bg-purple-100 text-purple-700' }
    ]
  }
];

// Sales Stages Mock Data
export const mockSalesStages: SalesStage[] = [
  {
    id: 'stage-1',
    name: 'Qualification',
    sequence: 1,
    isWonStage: false,
    isLostStage: false,
    probability: 10,
    color: '#3B82F6', // Blue
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'stage-2',
    name: 'Needs Analysis',
    sequence: 2,
    isWonStage: false,
    isLostStage: false,
    probability: 25,
    color: '#8B5CF6', // Purple
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'stage-3',
    name: 'Proposal',
    sequence: 3,
    isWonStage: false,
    isLostStage: false,
    probability: 50,
    color: '#F59E0B', // Amber
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'stage-4',
    name: 'Negotiation',
    sequence: 4,
    isWonStage: false,
    isLostStage: false,
    probability: 75,
    color: '#10B981', // Emerald
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'stage-5',
    name: 'Closed Won',
    sequence: 5,
    isWonStage: true,
    isLostStage: false,
    probability: 100,
    color: '#059669', // Green
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'stage-6',
    name: 'Closed Lost',
    sequence: 6,
    isWonStage: false,
    isLostStage: true,
    probability: 0,
    color: '#DC2626', // Red
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Lost Reasons Mock Data
export const mockLostReasons: LostReason[] = [
  {
    id: 'lost-1',
    reason: 'Price too high',
    description: 'Customer found our pricing not competitive',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'lost-2',
    reason: 'Chose competitor',
    description: 'Customer selected a competing solution',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'lost-3',
    reason: 'Budget constraints',
    description: 'Customer does not have sufficient budget',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'lost-4',
    reason: 'Timeline mismatch',
    description: 'Our delivery timeline does not match customer needs',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'lost-5',
    reason: 'No decision made',
    description: 'Customer postponed or cancelled the project',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Deals Mock Data
export const mockDeals: any[] = [
  {
    id: 'deal-1',
    title: 'Enterprise CRM Implementation',
    expectedRevenue: 150000,
    expectedClosingDate: '2025-03-15T00:00:00Z',
    stageId: 'stage-3',
    stage: mockSalesStages[2], // Proposal
    probability: 60,
    status: 'Open',
    contactId: 'contact1',
    contact: mockContacts[0],
    companyName: 'TechCorp Solutions',
    ownerId: 'user-1',
    owner: mockUser,
    dealType: 'New Business',
    leadSource: 'Website',
    notes: 'Large enterprise deal with potential for expansion',
    description: 'Complete CRM implementation for 500+ users',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
    activitySummary: {
      planned: 3,
      dueToday: 1,
      overdue: 0,
      total: 4
    },
    tags: [
      { name: 'Enterprise', className: 'bg-purple-100 text-purple-700' },
      { name: 'High Value', className: 'bg-green-100 text-green-700' }
    ]
  },
  {
    id: 'deal-2',
    title: 'Marketing Automation Setup',
    expectedRevenue: 45000,
    expectedClosingDate: '2025-02-28T00:00:00Z',
    stageId: 'stage-4',
    stage: mockSalesStages[3], // Negotiation
    probability: 80,
    status: 'Open',
    contactId: 'contact2',
    companyName: 'Growth Marketing Inc',
    ownerId: 'user-1',
    owner: mockUser,
    dealType: 'New Business',
    leadSource: 'Referral',
    notes: 'Quick implementation needed for Q1 campaign',
    description: 'Marketing automation platform setup and training',
    createdAt: '2024-11-15T00:00:00Z',
    updatedAt: '2025-01-18T00:00:00Z',
    activitySummary: {
      planned: 2,
      dueToday: 0,
      overdue: 1,
      total: 3
    },
    tags: [
      { name: 'Marketing', className: 'bg-pink-100 text-pink-700' },
      { name: 'High Value', className: 'bg-green-100 text-green-700' }
    ]
  }
];

// Purchase Orders Mock Data
export const mockVendors: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Office Supplies Plus',
    email: 'orders@officesuppliesplus.com',
    phone: '555-0101',
    website: 'https://www.officesuppliesplus.com',
    contactPerson: 'Sarah Johnson',
    address: {
      street: '123 Business Park Dr',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    paymentTerms: 'Net 30',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'vendor-2',
    name: 'Tech Equipment Corp',
    email: 'sales@techequipment.com',
    phone: '555-0202',
    website: 'https://www.techequipment.com',
    contactPerson: 'Mike Chen',
    address: {
      street: '456 Technology Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    paymentTerms: 'Net 45',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'vendor-3',
    name: 'Furniture Solutions Inc',
    email: 'orders@furnituresolutions.com',
    phone: '555-0303',
    website: 'https://www.furnituresolutions.com',
    contactPerson: 'Lisa Rodriguez',
    address: {
      street: '789 Industrial Way',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30309',
      country: 'USA'
    },
    paymentTerms: 'Net 30',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2025-001',
    title: 'Office Supplies Q1 2025',
    description: 'Quarterly office supplies order for all departments',
    vendorId: 'vendor-1',
    vendorName: 'Office Supplies Plus',
    vendorEmail: 'orders@officesuppliesplus.com',
    vendorPhone: '555-0101',
    subtotal: 2500.00,
    taxAmount: 200.00,
    totalAmount: 2700.00,
    currency: 'USD',
    status: 'In Progress',
    priority: 'Medium',
    createdDate: '2025-01-15T00:00:00Z',
    requiredDate: '2025-02-15T00:00:00Z',
    approvedDate: '2025-01-16T00:00:00Z',
    sentDate: '2025-01-17T00:00:00Z',
    expectedDeliveryDate: '2025-02-10T00:00:00Z',
    createdBy: mockUser,
    assignedTo: mockUser,
    approvedBy: mockUser,
    items: [
      {
        id: 'item-1',
        productName: 'A4 Copy Paper',
        description: 'White 80gsm copy paper, 500 sheets per ream',
        quantity: 50,
        unitPrice: 8.99,
        totalPrice: 449.50,
        unit: 'reams',
        category: 'Paper Products',
        receivedQuantity: 30
      },
      {
        id: 'item-2',
        productName: 'Blue Ballpoint Pens',
        description: 'Medium point blue ink pens',
        quantity: 100,
        unitPrice: 1.25,
        totalPrice: 125.00,
        unit: 'pcs',
        category: 'Writing Supplies',
        receivedQuantity: 100
      },
      {
        id: 'item-3',
        productName: 'Sticky Notes',
        description: '3x3 inch yellow sticky notes, 100 sheets per pad',
        quantity: 200,
        unitPrice: 2.50,
        totalPrice: 500.00,
        unit: 'pads',
        category: 'Office Supplies',
        receivedQuantity: 150
      }
    ],
    notes: 'Please deliver to main reception. Contact facilities manager upon arrival.',
    terms: 'Net 30 payment terms. All items must meet quality standards.',
    shippingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    trackingNumber: 'TRK123456789',
    deliveryStatus: 'In Transit',
    updatedAt: '2025-01-20T00:00:00Z',
    tags: [
      { name: 'Quarterly', className: 'bg-blue-100 text-blue-700' },
      { name: 'Office Supplies', className: 'bg-green-100 text-green-700' }
    ]
  },
  {
    id: 'po-2',
    poNumber: 'PO-2025-002',
    title: 'Laptop Computers for New Hires',
    description: 'Business laptops for Q1 new employee onboarding',
    vendorId: 'vendor-2',
    vendorName: 'Tech Equipment Corp',
    vendorEmail: 'sales@techequipment.com',
    vendorPhone: '555-0202',
    subtotal: 15000.00,
    taxAmount: 1200.00,
    totalAmount: 16200.00,
    currency: 'USD',
    status: 'Pending Approval',
    priority: 'High',
    createdDate: '2025-01-18T00:00:00Z',
    requiredDate: '2025-02-28T00:00:00Z',
    createdBy: janeDoe,
    assignedTo: mockUser,
    items: [
      {
        id: 'item-4',
        productName: 'Business Laptop - Model X1',
        description: 'Intel i7, 16GB RAM, 512GB SSD, Windows 11 Pro',
        quantity: 10,
        unitPrice: 1200.00,
        totalPrice: 12000.00,
        unit: 'units',
        category: 'Computers',
        receivedQuantity: 0
      },
      {
        id: 'item-5',
        productName: 'Laptop Carrying Case',
        description: 'Professional laptop bag with shoulder strap',
        quantity: 10,
        unitPrice: 45.00,
        totalPrice: 450.00,
        unit: 'units',
        category: 'Accessories',
        receivedQuantity: 0
      },
      {
        id: 'item-6',
        productName: 'Wireless Mouse',
        description: 'Ergonomic wireless optical mouse',
        quantity: 10,
        unitPrice: 25.00,
        totalPrice: 250.00,
        unit: 'units',
        category: 'Accessories',
        receivedQuantity: 0
      }
    ],
    notes: 'Urgent order for new employee onboarding. Please expedite processing.',
    terms: 'Net 45 payment terms. 1-year warranty required on all equipment.',
    shippingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    deliveryStatus: 'Not Shipped',
    updatedAt: '2025-01-18T00:00:00Z',
    tags: [
      { name: 'Technology', className: 'bg-purple-100 text-purple-700' },
      { name: 'Urgent', className: 'bg-red-100 text-red-700' }
    ]
  },
  {
    id: 'po-3',
    poNumber: 'PO-2025-003',
    title: 'Conference Room Furniture',
    description: 'New conference table and chairs for meeting room renovation',
    vendorId: 'vendor-3',
    vendorName: 'Furniture Solutions Inc',
    vendorEmail: 'orders@furnituresolutions.com',
    vendorPhone: '555-0303',
    subtotal: 8500.00,
    taxAmount: 680.00,
    totalAmount: 9180.00,
    currency: 'USD',
    status: 'Completed',
    priority: 'Low',
    createdDate: '2024-12-15T00:00:00Z',
    requiredDate: '2025-01-15T00:00:00Z',
    approvedDate: '2024-12-16T00:00:00Z',
    sentDate: '2024-12-17T00:00:00Z',
    expectedDeliveryDate: '2025-01-10T00:00:00Z',
    createdBy: mikeBrown,
    assignedTo: mikeBrown,
    approvedBy: mockUser,
    items: [
      {
        id: 'item-7',
        productName: 'Executive Conference Table',
        description: 'Solid wood conference table, seats 12 people',
        quantity: 1,
        unitPrice: 3500.00,
        totalPrice: 3500.00,
        unit: 'units',
        category: 'Furniture',
        receivedQuantity: 1
      },
      {
        id: 'item-8',
        productName: 'Executive Office Chairs',
        description: 'Leather executive chairs with ergonomic support',
        quantity: 12,
        unitPrice: 350.00,
        totalPrice: 4200.00,
        unit: 'units',
        category: 'Furniture',
        receivedQuantity: 12
      },
      {
        id: 'item-9',
        productName: 'Presentation Whiteboard',
        description: 'Magnetic whiteboard with mobile stand',
        quantity: 1,
        unitPrice: 800.00,
        totalPrice: 800.00,
        unit: 'units',
        category: 'Office Equipment',
        receivedQuantity: 1
      }
    ],
    notes: 'Installation service included. Schedule delivery for weekend to minimize disruption.',
    terms: 'Net 30 payment terms. Installation and setup included in price.',
    shippingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    trackingNumber: 'FRN987654321',
    deliveryStatus: 'Delivered',
    updatedAt: '2025-01-12T00:00:00Z',
    tags: [
      { name: 'Furniture', className: 'bg-brown-100 text-brown-700' },
      { name: 'Installation', className: 'bg-orange-100 text-orange-700' }
    ]
  },
  {
    id: 'po-4',
    poNumber: 'PO-2025-004',
    title: 'Marketing Materials',
    description: 'Brochures and promotional materials for trade show',
    vendorId: 'vendor-1',
    vendorName: 'Office Supplies Plus',
    vendorEmail: 'orders@officesuppliesplus.com',
    vendorPhone: '555-0101',
    subtotal: 1200.00,
    taxAmount: 96.00,
    totalAmount: 1296.00,
    currency: 'USD',
    status: 'Draft',
    priority: 'Medium',
    createdDate: '2025-01-20T00:00:00Z',
    requiredDate: '2025-03-01T00:00:00Z',
    createdBy: janeDoe,
    items: [
      {
        id: 'item-10',
        productName: 'Company Brochures',
        description: 'Full-color tri-fold brochures, glossy finish',
        quantity: 1000,
        unitPrice: 0.85,
        totalPrice: 850.00,
        unit: 'pieces',
        category: 'Marketing Materials',
        receivedQuantity: 0
      },
      {
        id: 'item-11',
        productName: 'Business Cards',
        description: 'Premium business cards, matte finish',
        quantity: 500,
        unitPrice: 0.70,
        totalPrice: 350.00,
        unit: 'pieces',
        category: 'Marketing Materials',
        receivedQuantity: 0
      }
    ],
    notes: 'Need samples approved before full production. Rush delivery may be required.',
    terms: 'Net 30 payment terms. Sample approval required before production.',
    shippingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    deliveryStatus: 'Not Shipped',
    updatedAt: '2025-01-20T00:00:00Z',
    tags: [
      { name: 'Marketing', className: 'bg-pink-100 text-pink-700' },
      { name: 'Trade Show', className: 'bg-yellow-100 text-yellow-700' }
    ]
  },
  {
    id: 'po-5',
    poNumber: 'PO-2025-005',
    title: 'IT Security Equipment',
    description: 'Network security hardware and software licenses',
    vendorId: 'vendor-2',
    vendorName: 'Tech Equipment Corp',
    vendorEmail: 'sales@techequipment.com',
    vendorPhone: '555-0202',
    subtotal: 25000.00,
    taxAmount: 2000.00,
    totalAmount: 27000.00,
    currency: 'USD',
    status: 'Cancelled',
    priority: 'High',
    createdDate: '2025-01-10T00:00:00Z',
    requiredDate: '2025-02-01T00:00:00Z',
    createdBy: mockUser,
    assignedTo: mockUser,
    items: [
      {
        id: 'item-12',
        productName: 'Enterprise Firewall',
        description: 'Next-generation firewall with advanced threat protection',
        quantity: 2,
        unitPrice: 8000.00,
        totalPrice: 16000.00,
        unit: 'units',
        category: 'Security Equipment',
        receivedQuantity: 0
      },
      {
        id: 'item-13',
        productName: 'Security Software Licenses',
        description: 'Annual licenses for endpoint protection (100 users)',
        quantity: 1,
        unitPrice: 9000.00,
        totalPrice: 9000.00,
        unit: 'license',
        category: 'Software',
        receivedQuantity: 0
      }
    ],
    notes: 'Order cancelled due to budget reallocation. Will reorder in Q2.',
    terms: 'Net 45 payment terms. Annual support contract included.',
    shippingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    deliveryStatus: 'Not Shipped',
    updatedAt: '2025-01-15T00:00:00Z',
    tags: [
      { name: 'Security', className: 'bg-red-100 text-red-700' },
      { name: 'Cancelled', className: 'bg-gray-100 text-gray-700' }
    ]
  }
];

export const mockAccounts: Account[] = [
  {
    id: 'acc1',
    accountName: 'King (Sample)',
    phone: '555-555-5555',
    website: 'http://kingmanufacturing.com',
    accountOwner: {
      id: 'user1',
      name: 'Korak Sankar',
      email: 'korak@company.com',
      avatarFallback: 'KS'
    },
    accountType: 'Customer',
    industry: 'Manufacturing',
    annualRevenue: 5000000,
    employees: '100-500',
    billingStreet: '123 King Street',
    billingCity: 'New York',
    billingState: 'NY',
    billingCode: '10001',
    billingCountry: 'USA',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    status: 'Active',
    description: 'Leading manufacturing company specializing in industrial equipment.'
  },
  // ... additional mock accounts
];

    