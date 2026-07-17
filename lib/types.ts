import { ObjectId } from "mongodb";

// ─── User ───
export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
}

// ─── Job Posting ───
export type EmploymentType = "full-time" | "part-time" | "internship" | "remote";

export type JobCategory =
  | "Engineering"
  | "Design"
  | "Marketing"
  | "Sales"
  | "Product"
  | "Data Science"
  | "DevOps"
  | "Finance"
  | "Human Resources"
  | "Customer Support";

export interface JobPosting {
  _id: ObjectId;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  category: string;
  employmentType: EmploymentType;
  salaryRange?: string;
  shortDescription: string;
  fullDescription: string;
  postedAt: Date;
}

// ─── Application ───
export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected";

export interface Application {
  _id: ObjectId;
  userId: ObjectId;
  jobId: ObjectId;
  status: ApplicationStatus;
  notes?: string;
  generatedCoverLetter?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Populated version with job details joined
export interface ApplicationWithJob extends Application {
  job?: JobPosting;
}

// ─── Coach Conversation ───
export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface CoachConversation {
  _id: ObjectId;
  userId: ObjectId;
  jobId?: ObjectId;
  messages: CoachMessage[];
  createdAt: Date;
}

// ─── API Response helpers ───
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
