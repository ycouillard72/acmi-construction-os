export type Tone = "green" | "amber" | "blue" | "red" | "slate" | "purple";

export type Project = {
  id: string;
  name: string;
  location: string;
  type: string;
  stage: string;
  progress: number;
  contract: number;
  estimatedCost: number;
  committedCost: number;
  actualCost: number;
  forecastCost: number;
  margin: number;
  nextMilestone: string;
  owner: string;
  tone: Tone;
};

export const dashboardMetrics = [
  { label: "Open pipeline", value: "$1.24M", delta: "+18% this month", tone: "green" as Tone, detail: "14 qualified opportunities" },
  { label: "Active jobs", value: "8", delta: "3 milestones this week", tone: "blue" as Tone, detail: "$2.86M under contract" },
  { label: "Forecast gross profit", value: "$642K", delta: "22.4% portfolio margin", tone: "purple" as Tone, detail: "+1.7 pts vs. estimate" },
  { label: "Needs attention", value: "6", delta: "2 cost · 4 schedule", tone: "amber" as Tone, detail: "No critical safety items" },
];

export const projects: Project[] = [
  {
    id: "AC-26041",
    name: "Cofield Residence Roof Replacement",
    location: "Clermont, FL",
    type: "Roof replacement",
    stage: "Dry-in complete",
    progress: 62,
    contract: 48600,
    estimatedCost: 32740,
    committedCost: 31420,
    actualCost: 22860,
    forecastCost: 33450,
    margin: 31.2,
    nextMilestone: "Metal delivery · Aug 11",
    owner: "YC",
    tone: "green",
  },
  {
    id: "AC-26034",
    name: "Hartwell Lakehouse Addition",
    location: "Winter Garden, FL",
    type: "Residential addition",
    stage: "Framing",
    progress: 41,
    contract: 384000,
    estimatedCost: 291700,
    committedCost: 228400,
    actualCost: 152900,
    forecastCost: 301600,
    margin: 21.5,
    nextMilestone: "Sheathing inspection · Aug 12",
    owner: "MR",
    tone: "blue",
  },
  {
    id: "AC-26028",
    name: "Oak Ridge Commercial Reroof",
    location: "Lakeland, FL",
    type: "Commercial roofing",
    stage: "Material procurement",
    progress: 28,
    contract: 218500,
    estimatedCost: 164600,
    committedCost: 151200,
    actualCost: 26700,
    forecastCost: 171800,
    margin: 21.4,
    nextMilestone: "TPO delivery · Aug 14",
    owner: "YC",
    tone: "amber",
  },
  {
    id: "AC-26017",
    name: "Sundown Kitchen + Interior Remodel",
    location: "Windermere, FL",
    type: "Remodel",
    stage: "MEP rough-in",
    progress: 55,
    contract: 146000,
    estimatedCost: 109400,
    committedCost: 103800,
    actualCost: 78200,
    forecastCost: 116900,
    margin: 19.9,
    nextMilestone: "Rough-in inspection · Aug 10",
    owner: "KL",
    tone: "red",
  },
  {
    id: "AC-26009",
    name: "Citrus Grove Custom Home",
    location: "Groveland, FL",
    type: "New construction",
    stage: "Foundation",
    progress: 19,
    contract: 892000,
    estimatedCost: 681500,
    committedCost: 418000,
    actualCost: 121300,
    forecastCost: 696400,
    margin: 21.9,
    nextMilestone: "Slab pour · Aug 18",
    owner: "MR",
    tone: "purple",
  },
];

export const pipeline = [
  {
    stage: "New lead",
    total: 182000,
    tone: "slate" as Tone,
    opportunities: [
      { name: "Lakeside Retail Roof", company: "Lakeside Retail Partners", value: 132000, age: "2d", type: "Commercial roof", owner: "YC" },
      { name: "Morales Roof Repair", company: "Elena Morales", value: 50000, age: "Today", type: "Storm / insurance", owner: "KL" },
    ],
  },
  {
    stage: "Qualified",
    total: 340000,
    tone: "blue" as Tone,
    opportunities: [
      { name: "Pine Ridge Addition", company: "Aaron + Mia Patel", value: 265000, age: "4d", type: "Residential addition", owner: "MR" },
      { name: "Davenport Shingle Roof", company: "J. Caldwell", value: 75000, age: "6d", type: "Roof replacement", owner: "YC" },
    ],
  },
  {
    stage: "Site visit",
    total: 289000,
    tone: "purple" as Tone,
    opportunities: [
      { name: "Celebration Clubhouse", company: "Cypress HOA", value: 184000, age: "Tue", type: "Commercial remodel", owner: "YC" },
      { name: "Harper Outdoor Kitchen", company: "Monica Harper", value: 105000, age: "Thu", type: "Remodel", owner: "KL" },
    ],
  },
  {
    stage: "Proposal sent",
    total: 336000,
    tone: "amber" as Tone,
    opportunities: [
      { name: "Magnolia Dental Buildout", company: "Magnolia Dental Group", value: 286000, age: "3d", type: "Commercial buildout", owner: "MR" },
      { name: "Reed Tile Reroof", company: "Anthony Reed", value: 50000, age: "8d", type: "Roof replacement", owner: "YC" },
    ],
  },
  {
    stage: "Verbal yes",
    total: 96000,
    tone: "green" as Tone,
    opportunities: [
      { name: "Bennett Pool House", company: "Rachel Bennett", value: 96000, age: "1d", type: "New structure", owner: "YC" },
    ],
  },
];

export const contacts = [
  { name: "Monica Harper", role: "Homeowner", company: "Harper Residence", email: "monica.harper@example.com", phone: "(407) 555-0147", lastTouch: "Today", owner: "KL", status: "Active lead" },
  { name: "Jamal Brooks", role: "Facilities Director", company: "Lakeside Retail Partners", email: "j.brooks@example.com", phone: "(863) 555-0182", lastTouch: "Yesterday", owner: "YC", status: "Qualified" },
  { name: "Priya Shah", role: "Architect", company: "Formline Studio", email: "priya@formline.example", phone: "(321) 555-0118", lastTouch: "Aug 6", owner: "MR", status: "Referral partner" },
  { name: "Daniel Cofield", role: "Homeowner", company: "Cofield Residence", email: "d.cofield@example.com", phone: "(352) 555-0164", lastTouch: "Aug 5", owner: "YC", status: "Active client" },
  { name: "Katherine Wu", role: "Property Manager", company: "Cypress HOA", email: "kwu@cypresshoa.example", phone: "(407) 555-0199", lastTouch: "Aug 4", owner: "YC", status: "Site visit" },
];

export const companies = [
  { name: "Lakeside Retail Partners", type: "Commercial client", location: "Lakeland, FL", contacts: 3, openValue: "$132,000" },
  { name: "Formline Studio", type: "Architect / referral", location: "Orlando, FL", contacts: 2, openValue: "$0" },
  { name: "Cypress HOA", type: "Community association", location: "Celebration, FL", contacts: 4, openValue: "$184,000" },
  { name: "Magnolia Dental Group", type: "Commercial client", location: "Winter Garden, FL", contacts: 2, openValue: "$286,000" },
];

export const properties = [
  { address: "4218 Arrowtree Blvd", city: "Clermont, FL 34711", type: "Single-family", contact: "Daniel Cofield", roof: "Standing seam metal", project: "AC-26041", note: "Gate code on file" },
  { address: "11806 Hartwell Cove", city: "Winter Garden, FL 34787", type: "Single-family", contact: "Aaron Hartwell", roof: "Architectural shingle", project: "AC-26034", note: "Lake access restrictions" },
  { address: "2800 Oak Ridge Commerce Dr", city: "Lakeland, FL 33801", type: "Retail center", contact: "Jamal Brooks", roof: "60 mil TPO", project: "AC-26028", note: "After-hours crane plan" },
  { address: "8532 Sundown Place", city: "Windermere, FL 34786", type: "Single-family", contact: "Marisol Sundown", roof: "Tile", project: "AC-26017", note: "Occupied remodel" },
  { address: "16105 Citrus Grove Rd", city: "Groveland, FL 34736", type: "New build site", contact: "Noah + Ava Price", roof: "TBD", project: "AC-26009", note: "Well and septic permits" },
];

export const estimates = [
  { id: "EST-26104", name: "Magnolia Dental Buildout", customer: "Magnolia Dental Group", status: "Sent", amount: 286000, cost: 216100, margin: 24.4, expires: "Aug 19", updated: "2h ago" },
  { id: "EST-26103", name: "Bennett Pool House", customer: "Rachel Bennett", status: "Approved", amount: 96000, cost: 71600, margin: 25.4, expires: "Aug 24", updated: "Yesterday" },
  { id: "EST-26102", name: "Celebration Clubhouse", customer: "Cypress HOA", status: "Draft", amount: 184000, cost: 142700, margin: 22.4, expires: "Aug 28", updated: "Yesterday" },
  { id: "EST-26101", name: "Reed Tile Reroof", customer: "Anthony Reed", status: "Follow-up", amount: 50000, cost: 33900, margin: 32.2, expires: "Aug 12", updated: "Aug 5" },
  { id: "EST-26098", name: "Pine Ridge Addition", customer: "Aaron + Mia Patel", status: "In review", amount: 265000, cost: 201500, margin: 24.0, expires: "Aug 31", updated: "Aug 4" },
];

export const partners = [
  { name: "Orange Line Electric", trade: "Electrical", contact: "Luis Rivera", phone: "(407) 555-0131", coi: "Dec 18, 2026", jobs: 3, rating: "A", status: "Approved" },
  { name: "Sunstate Drywall", trade: "Drywall + framing", contact: "Marcus Lee", phone: "(352) 555-0188", coi: "Sep 4, 2026", jobs: 2, rating: "A-", status: "Review soon" },
  { name: "Lake County Roofing Supply", trade: "Materials vendor", contact: "Tanya Ellis", phone: "(863) 555-0175", coi: "Not required", jobs: 6, rating: "A", status: "Approved" },
  { name: "ClearSpan Gutters", trade: "Gutters", contact: "Theo James", phone: "(407) 555-0106", coi: "Aug 22, 2026", jobs: 1, rating: "B+", status: "Expiring" },
  { name: "Central FL Concrete", trade: "Concrete", contact: "Sam Ortega", phone: "(321) 555-0142", coi: "Jan 11, 2027", jobs: 2, rating: "A-", status: "Approved" },
];

export const documents = [
  { name: "Cofield Notice of Commencement.pdf", category: "Permit / legal", record: "AC-26041", version: "v1", owner: "YC", updated: "Today, 8:42 AM", source: "SharePoint placeholder" },
  { name: "Hartwell Framing Plans.pdf", category: "Plans", record: "AC-26034", version: "v4", owner: "MR", updated: "Yesterday, 4:18 PM", source: "SharePoint placeholder" },
  { name: "Oak Ridge TPO Submittal.pdf", category: "Product submittal", record: "AC-26028", version: "v2", owner: "YC", updated: "Aug 6", source: "Local demo" },
  { name: "Orange Line Electric COI.pdf", category: "Vendor compliance", record: "V-0018", version: "2026", owner: "KL", updated: "Aug 2", source: "Local demo" },
  { name: "Sundown Change Order 003.pdf", category: "Change order", record: "AC-26017", version: "Signed", owner: "KL", updated: "Jul 31", source: "SharePoint placeholder" },
];

export const activities = [
  { title: "Confirm Cofield metal delivery window", related: "AC-26041", assignee: "Yannick", due: "Today · 9:30 AM", priority: "High", status: "Open" },
  { title: "Send Magnolia proposal follow-up", related: "EST-26104", assignee: "Yannick", due: "Today · 11:00 AM", priority: "High", status: "Open" },
  { title: "Upload Hartwell sheathing inspection photos", related: "AC-26034", assignee: "Maya", due: "Today · 2:00 PM", priority: "Normal", status: "In progress" },
  { title: "Review Sunstate Drywall COI renewal", related: "V-0021", assignee: "Kendra", due: "Monday", priority: "Normal", status: "Open" },
  { title: "Approve Citrus Grove foundation draw", related: "AC-26009", assignee: "Yannick", due: "Tuesday", priority: "High", status: "Waiting" },
  { title: "Schedule Oak Ridge preconstruction meeting", related: "AC-26028", assignee: "Maya", due: "Wednesday", priority: "Normal", status: "Open" },
];

export const recentActivity = [
  { actor: "MR", text: "moved Hartwell Lakehouse to Framing", time: "12 min ago", tone: "blue" as Tone },
  { actor: "KL", text: "logged CO #003 on Sundown Remodel", time: "38 min ago", tone: "purple" as Tone },
  { actor: "YC", text: "approved the Cofield material order", time: "1 hr ago", tone: "green" as Tone },
  { actor: "MR", text: "added 18 inspection photos", time: "2 hrs ago", tone: "amber" as Tone },
];

export const weekSchedule = [
  { day: "MON", date: "10", label: "Sundown rough-in inspection", meta: "9:00 AM · Windermere", tone: "red" as Tone },
  { day: "TUE", date: "11", label: "Cofield metal delivery", meta: "7:30 AM · Clermont", tone: "green" as Tone },
  { day: "WED", date: "12", label: "Hartwell sheathing inspection", meta: "1:30 PM · Winter Garden", tone: "blue" as Tone },
  { day: "THU", date: "13", label: "Harper site visit", meta: "10:00 AM · Windermere", tone: "purple" as Tone },
];

export const costSnapshot = [
  { month: "Mar", value: 42 },
  { month: "Apr", value: 59 },
  { month: "May", value: 47 },
  { month: "Jun", value: 76 },
  { month: "Jul", value: 68 },
  { month: "Aug", value: 88 },
];

export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
