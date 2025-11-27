import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema, 
  insertNewsletterSignupSchema, 
  insertServiceSchema, 
  updateServiceSchema,
  insertProjectSchema,
  updateProjectSchema,
  insertEquipmentSchema,
  updateEquipmentSchema,
  insertProcessStepSchema,
  updateProcessStepSchema,
  insertTestimonialSchema,
  updateTestimonialSchema,
  updateConstructionBannerSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Use local file uploads - works both on Replit preview and local hosting
console.log("Using local file uploads");

if (!process.env.ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD environment variable is required");
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required")
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.json({ 
        success: true, 
        message: "Quote request received successfully",
        id: submission.id 
      });
    } catch (error) {
      console.error("Contact submission error:", error);
      res.status(400).json({ 
        success: false, 
        message: "Failed to submit quote request" 
      });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json({ success: true, submissions });
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch submissions" 
      });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSignupSchema.parse(req.body);
      await storage.createNewsletterSignup(validatedData);
      res.json({ 
        success: true, 
        message: "Successfully subscribed to newsletter" 
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("already subscribed")) {
        res.status(400).json({ 
          success: false, 
          message: "This email is already subscribed" 
        });
      } else {
        console.error("Newsletter signup error:", error);
        res.status(400).json({ 
          success: false, 
          message: "Failed to subscribe to newsletter" 
        });
      }
    }
  });

  app.get("/api/newsletter", async (req, res) => {
    try {
      const signups = await storage.getAllNewsletterSignups();
      res.json({ success: true, signups });
    } catch (error) {
      console.error("Error fetching newsletter signups:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch signups" 
      });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const validatedData = adminLoginSchema.parse(req.body);
      const { password } = validatedData;
      
      if (password === ADMIN_PASSWORD) {
        req.session.regenerate((err) => {
          if (err) {
            console.error("Session regeneration error:", err);
            return res.status(500).json({ success: false, message: "Login failed" });
          }
          
          req.session.isAdmin = true;
          req.session.save((err) => {
            if (err) {
              console.error("Session save error:", err);
              return res.status(500).json({ success: false, message: "Login failed" });
            }
            res.json({ success: true, message: "Login successful" });
          });
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid password" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid request data" });
      }
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: "Logout successful" });
    });
  });

  app.get("/api/admin/check", async (req, res) => {
    res.json({ isAuthenticated: !!req.session.isAdmin });
  });

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session.isAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    next();
  };

  // Image Upload Routes - uses local file storage
  // Works on Replit preview and when hosting locally
  app.post("/api/upload", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ success: true, imageUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Serve uploaded files from local storage
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const allServices = await storage.getAllServices();
      res.json({ success: true, services: allServices });
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ success: false, message: "Failed to fetch services" });
    }
  });

  app.post("/api/services", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.json({ success: true, service });
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ success: false, message: "Failed to create service" });
    }
  });

  app.put("/api/services/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateServiceSchema.parse(req.body);
      const service = await storage.updateService(req.params.id, validatedData);
      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }
      res.json({ success: true, service });
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(400).json({ success: false, message: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.json({ success: true, message: "Service deleted" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ success: false, message: "Failed to delete service" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await storage.getAllProjects();
      res.json({ success: true, projects: allProjects });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ success: false, message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.json({ success: true, project });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ success: false, message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateProjectSchema.parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      res.json({ success: true, project });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ success: false, message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.json({ success: true, message: "Project deleted" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ success: false, message: "Failed to delete project" });
    }
  });

  app.get("/api/equipment", async (req, res) => {
    try {
      const allEquipment = await storage.getAllEquipment();
      res.json({ success: true, equipment: allEquipment });
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ success: false, message: "Failed to fetch equipment" });
    }
  });

  app.post("/api/equipment", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertEquipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(validatedData);
      res.json({ success: true, equipment });
    } catch (error) {
      console.error("Error creating equipment:", error);
      res.status(400).json({ success: false, message: "Failed to create equipment" });
    }
  });

  app.put("/api/equipment/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateEquipmentSchema.parse(req.body);
      const equipment = await storage.updateEquipment(req.params.id, validatedData);
      if (!equipment) {
        return res.status(404).json({ success: false, message: "Equipment not found" });
      }
      res.json({ success: true, equipment });
    } catch (error) {
      console.error("Error updating equipment:", error);
      res.status(400).json({ success: false, message: "Failed to update equipment" });
    }
  });

  app.delete("/api/equipment/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteEquipment(req.params.id);
      res.json({ success: true, message: "Equipment deleted" });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      res.status(500).json({ success: false, message: "Failed to delete equipment" });
    }
  });

  app.get("/api/process-steps", async (req, res) => {
    try {
      const allSteps = await storage.getAllProcessSteps();
      res.json({ success: true, steps: allSteps });
    } catch (error) {
      console.error("Error fetching process steps:", error);
      res.status(500).json({ success: false, message: "Failed to fetch process steps" });
    }
  });

  app.post("/api/process-steps", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProcessStepSchema.parse(req.body);
      const step = await storage.createProcessStep(validatedData);
      res.json({ success: true, step });
    } catch (error) {
      console.error("Error creating process step:", error);
      res.status(400).json({ success: false, message: "Failed to create process step" });
    }
  });

  app.put("/api/process-steps/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateProcessStepSchema.parse(req.body);
      const step = await storage.updateProcessStep(req.params.id, validatedData);
      if (!step) {
        return res.status(404).json({ success: false, message: "Process step not found" });
      }
      res.json({ success: true, step });
    } catch (error) {
      console.error("Error updating process step:", error);
      res.status(400).json({ success: false, message: "Failed to update process step" });
    }
  });

  app.delete("/api/process-steps/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteProcessStep(req.params.id);
      res.json({ success: true, message: "Process step deleted" });
    } catch (error) {
      console.error("Error deleting process step:", error);
      res.status(500).json({ success: false, message: "Failed to delete process step" });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const allTestimonials = await storage.getAllTestimonials();
      res.json({ success: true, testimonials: allTestimonials });
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.json({ success: true, testimonial });
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(400).json({ success: false, message: "Failed to create testimonial" });
    }
  });

  app.put("/api/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateTestimonialSchema.parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, validatedData);
      if (!testimonial) {
        return res.status(404).json({ success: false, message: "Testimonial not found" });
      }
      res.json({ success: true, testimonial });
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(400).json({ success: false, message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteTestimonial(req.params.id);
      res.json({ success: true, message: "Testimonial deleted" });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ success: false, message: "Failed to delete testimonial" });
    }
  });

  // Construction Banner Routes (public GET, admin PUT)
  app.get("/api/construction-banner", async (req, res) => {
    try {
      const banner = await storage.getConstructionBanner();
      res.json({ success: true, banner: banner || null });
    } catch (error) {
      console.error("Error fetching construction banner:", error);
      res.status(500).json({ success: false, message: "Failed to fetch banner settings" });
    }
  });

  app.put("/api/construction-banner", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateConstructionBannerSchema.parse(req.body);
      const banner = await storage.upsertConstructionBanner(validatedData);
      res.json({ success: true, banner });
    } catch (error) {
      console.error("Error updating construction banner:", error);
      res.status(400).json({ success: false, message: "Failed to update banner settings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
