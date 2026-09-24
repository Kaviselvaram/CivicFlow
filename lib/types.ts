export type Role = "CITIZEN" | "AUTHORITY" | "ADMIN";

export type IssueStatus =
  | "REPORTED"
  | "IN_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "VERIFIED"
  | "REOPENED";

export type IssuePriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IssueCategory =
  | "ROADS"
  | "SANITATION"
  | "WATER"
  | "ELECTRICAL"
  | "INFRASTRUCTURE"
  | "TRAFFIC";

export interface CategoryMeta {
  id: IssueCategory;
  name: string;
  tagline: string;
  departmentSlug: string;
  defaultSlaHours: number;
  sampleKeywords: string[];
}

export const CATEGORIES_CONFIG: Record<IssueCategory, CategoryMeta> = {
  ROADS: {
    id: "ROADS",
    name: "Roads & Potholes",
    tagline: "Asphalt cavities, damaged curbs, speed bumps, sinkholes",
    departmentSlug: "public-works",
    defaultSlaHours: 48,
    sampleKeywords: ["pothole", "asphalt", "crater", "sinkhole", "road", "pavement", "curb"],
  },
  SANITATION: {
    id: "SANITATION",
    name: "Solid Waste & Sanitation",
    tagline: "Overflowing public bins, illegal commercial dumping, street litter",
    departmentSlug: "waste-management",
    defaultSlaHours: 24,
    sampleKeywords: ["garbage", "trash", "waste", "dumping", "litter", "rubbish", "bins"],
  },
  WATER: {
    id: "WATER",
    name: "Water Supply & Drainage",
    tagline: "Pipe bursts, sewer overflow, storm drain blockage, flooding",
    departmentSlug: "water-drainage",
    defaultSlaHours: 12,
    sampleKeywords: ["water", "leak", "pipe", "burst", "drain", "sewage", "flood"],
  },
  ELECTRICAL: {
    id: "ELECTRICAL",
    name: "Streetlights & Power",
    tagline: "Dark streetlights, sparking cables, unlit crosswalks, exposed wiring",
    departmentSlug: "electrical-lighting",
    defaultSlaHours: 24,
    sampleKeywords: ["streetlight", "lamp", "dark", "light", "spark", "cable", "wire", "blackout"],
  },
  INFRASTRUCTURE: {
    id: "INFRASTRUCTURE",
    name: "Public Infrastructure & Parks",
    tagline: "Broken park benches, bridge guardrails, cracked footpaths, playground damage",
    departmentSlug: "parks-infrastructure",
    defaultSlaHours: 72,
    sampleKeywords: ["bench", "guardrail", "park", "playground", "bridge", "walkway", "railing"],
  },
  TRAFFIC: {
    id: "TRAFFIC",
    name: "Traffic & Mobility",
    tagline: "Faulty traffic signals, missing road signage, severe obstruction",
    departmentSlug: "traffic-mobility",
    defaultSlaHours: 24,
    sampleKeywords: ["traffic", "signal", "light", "sign", "gridlock", "blocking", "hazard"],
  },
};

export interface AIClassificationResult {
  category: IssueCategory;
  subcategory: string;
  departmentSlug: string;
  departmentName: string;
  priority: IssuePriority;
  confidence: number;
  rationale: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string | null;
  avatarUrl?: string | null;
}
