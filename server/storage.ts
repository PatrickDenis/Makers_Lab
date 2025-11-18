import { 
  type User, 
  type InsertUser,
  type ContactSubmission,
  type InsertContactSubmission,
  type NewsletterSignup,
  type InsertNewsletterSignup
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  
  createNewsletterSignup(signup: InsertNewsletterSignup): Promise<NewsletterSignup>;
  getAllNewsletterSignups(): Promise<NewsletterSignup[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private newsletterSignups: Map<string, NewsletterSignup>;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSignups = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...insertSubmission,
      phone: insertSubmission.phone ?? null,
      budget: insertSubmission.budget ?? null,
      timeline: insertSubmission.timeline ?? null,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createNewsletterSignup(insertSignup: InsertNewsletterSignup): Promise<NewsletterSignup> {
    const existing = Array.from(this.newsletterSignups.values()).find(
      (signup) => signup.email === insertSignup.email
    );
    
    if (existing) {
      throw new Error("Email already subscribed to newsletter");
    }

    const id = randomUUID();
    const signup: NewsletterSignup = {
      ...insertSignup,
      id,
      createdAt: new Date(),
    };
    this.newsletterSignups.set(id, signup);
    return signup;
  }

  async getAllNewsletterSignups(): Promise<NewsletterSignup[]> {
    return Array.from(this.newsletterSignups.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
