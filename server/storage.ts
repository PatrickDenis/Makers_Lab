import { 
  type User, 
  type InsertUser,
  type ContactSubmission,
  type InsertContactSubmission,
  type NewsletterSignup,
  type InsertNewsletterSignup,
  type Service,
  type InsertService,
  type UpdateService,
  type Project,
  type InsertProject,
  type UpdateProject,
  type Equipment,
  type InsertEquipment,
  type UpdateEquipment,
  type ProcessStep,
  type InsertProcessStep,
  type UpdateProcessStep,
  type Testimonial,
  type InsertTestimonial,
  type UpdateTestimonial,
  type ConstructionBanner,
  type UpdateConstructionBanner,
  users,
  contactSubmissions,
  newsletterSignups,
  services,
  projects,
  equipment,
  processSteps,
  testimonials,
  constructionBanner
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  
  createNewsletterSignup(signup: InsertNewsletterSignup): Promise<NewsletterSignup>;
  getAllNewsletterSignups(): Promise<NewsletterSignup[]>;
  
  getAllServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: UpdateService): Promise<Service | undefined>;
  deleteService(id: string): Promise<void>;

  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<void>;

  getAllEquipment(): Promise<Equipment[]>;
  getEquipment(id: string): Promise<Equipment | undefined>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: string, equipment: UpdateEquipment): Promise<Equipment | undefined>;
  deleteEquipment(id: string): Promise<void>;

  getAllProcessSteps(): Promise<ProcessStep[]>;
  getProcessStep(id: string): Promise<ProcessStep | undefined>;
  createProcessStep(step: InsertProcessStep): Promise<ProcessStep>;
  updateProcessStep(id: string, step: UpdateProcessStep): Promise<ProcessStep | undefined>;
  deleteProcessStep(id: string): Promise<void>;

  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: UpdateTestimonial): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<void>;

  getConstructionBanner(): Promise<ConstructionBanner | undefined>;
  upsertConstructionBanner(banner: UpdateConstructionBanner): Promise<ConstructionBanner>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }

  async createNewsletterSignup(insertSignup: InsertNewsletterSignup): Promise<NewsletterSignup> {
    try {
      const [signup] = await db
        .insert(newsletterSignups)
        .values(insertSignup)
        .returning();
      return signup;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error("Email already subscribed to newsletter");
      }
      throw error;
    }
  }

  async getAllNewsletterSignups(): Promise<NewsletterSignup[]> {
    return await db
      .select()
      .from(newsletterSignups)
      .orderBy(desc(newsletterSignups.createdAt));
  }

  async getAllServices(): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .orderBy(services.order);
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(insertService)
      .returning();
    return service;
  }

  async updateService(id: string, updateService: UpdateService): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set({ ...updateService, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service || undefined;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async getAllProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .orderBy(projects.order);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: string, updateProject: UpdateProject): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...updateProject, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getAllEquipment(): Promise<Equipment[]> {
    return await db
      .select()
      .from(equipment)
      .orderBy(equipment.order);
  }

  async getEquipment(id: string): Promise<Equipment | undefined> {
    const [item] = await db.select().from(equipment).where(eq(equipment.id, id));
    return item || undefined;
  }

  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const [item] = await db
      .insert(equipment)
      .values(insertEquipment)
      .returning();
    return item;
  }

  async updateEquipment(id: string, updateEquipment: UpdateEquipment): Promise<Equipment | undefined> {
    const [item] = await db
      .update(equipment)
      .set({ ...updateEquipment, updatedAt: new Date() })
      .where(eq(equipment.id, id))
      .returning();
    return item || undefined;
  }

  async deleteEquipment(id: string): Promise<void> {
    await db.delete(equipment).where(eq(equipment.id, id));
  }

  async getAllProcessSteps(): Promise<ProcessStep[]> {
    return await db
      .select()
      .from(processSteps)
      .orderBy(processSteps.order);
  }

  async getProcessStep(id: string): Promise<ProcessStep | undefined> {
    const [step] = await db.select().from(processSteps).where(eq(processSteps.id, id));
    return step || undefined;
  }

  async createProcessStep(insertProcessStep: InsertProcessStep): Promise<ProcessStep> {
    const [step] = await db
      .insert(processSteps)
      .values(insertProcessStep)
      .returning();
    return step;
  }

  async updateProcessStep(id: string, updateProcessStep: UpdateProcessStep): Promise<ProcessStep | undefined> {
    const [step] = await db
      .update(processSteps)
      .set({ ...updateProcessStep, updatedAt: new Date() })
      .where(eq(processSteps.id, id))
      .returning();
    return step || undefined;
  }

  async deleteProcessStep(id: string): Promise<void> {
    await db.delete(processSteps).where(eq(processSteps.id, id));
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .orderBy(testimonials.order);
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial || undefined;
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async updateTestimonial(id: string, updateTestimonial: UpdateTestimonial): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set({ ...updateTestimonial, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial || undefined;
  }

  async deleteTestimonial(id: string): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  async getConstructionBanner(): Promise<ConstructionBanner | undefined> {
    const [banner] = await db.select().from(constructionBanner);
    return banner || undefined;
  }

  async upsertConstructionBanner(updateBanner: UpdateConstructionBanner): Promise<ConstructionBanner> {
    const existing = await this.getConstructionBanner();
    
    if (existing) {
      const [banner] = await db
        .update(constructionBanner)
        .set({ ...updateBanner, updatedAt: new Date() })
        .where(eq(constructionBanner.id, existing.id))
        .returning();
      return banner;
    } else {
      const [banner] = await db
        .insert(constructionBanner)
        .values({
          enabled: updateBanner.enabled ?? false,
          title: updateBanner.title ?? "Site Under Construction",
          subtitle: updateBanner.subtitle ?? "We're making some improvements to serve you better!",
          startDate: updateBanner.startDate ?? "",
          endDate: updateBanner.endDate ?? "",
          message: updateBanner.message ?? "Some features may be temporarily unavailable during this time. We appreciate your patience.",
        })
        .returning();
      return banner;
    }
  }
}

export const storage = new DatabaseStorage();
