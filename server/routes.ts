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
  updateConstructionBannerSchema,
  updateContactSectionSchema,
  insertContactCardSchema,
  updateContactCardSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

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
      
      // Send email notification
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          const budgetLabels: Record<string, string> = {
            'under-1k': 'Under $1,000',
            '1k-5k': '$1,000 - $5,000',
            '5k-10k': '$5,000 - $10,000',
            'over-10k': 'Over $10,000',
          };

          const timelineLabels: Record<string, string> = {
            'urgent': 'ASAP (Rush)',
            '1-2weeks': '1-2 weeks',
            '1month': '1 month',
            'flexible': 'Flexible',
          };

          const emailHtml = `
            <h2>New Quote Request from Makers Lab Website</h2>
            <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(submission.phone || 'Not provided')}</p>
            <p><strong>Budget Range:</strong> ${escapeHtml(budgetLabels[submission.budget || ''] || submission.budget || 'Not specified')}</p>
            <p><strong>Timeline:</strong> ${escapeHtml(timelineLabels[submission.timeline || ''] || submission.timeline || 'Not specified')}</p>
            <h3>Project Description:</h3>
            <p>${escapeHtml(submission.description)}</p>
            <hr>
            <p><small>Submitted on ${new Date(submission.createdAt).toLocaleString()}</small></p>
          `;

          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: 'info@makers-lab.net',
            subject: `New Quote Request from ${submission.name}`,
            html: emailHtml,
          });
          
          console.log('Quote request email sent successfully');
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Don't fail the request if email fails
        }
      } else {
        console.log('SMTP credentials not configured, skipping email notification');
      }
      
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

  // Image Upload Routes - uses object storage for production persistence
  app.post("/api/upload", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const objectStorageService = new ObjectStorageService();
      
      // Get signed upload URL from object storage
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      
      // Read the temp file
      const fileBuffer = fs.readFileSync(req.file.path);
      
      // Upload to object storage
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: fileBuffer,
        headers: {
          'Content-Type': req.file.mimetype,
        },
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to object storage');
      }
      
      // Clean up temp file
      fs.unlinkSync(req.file.path);
      
      // Extract the object path from the signed URL
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      
      res.json({ success: true, imageUrl: objectPath });
    } catch (error) {
      console.error("Error uploading file:", error);
      // Clean up temp file on error
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Serve files from object storage
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "File not found" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Legacy: Serve uploaded files from local storage (for backward compatibility)
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

  // Contact Section Routes (public GET, admin PUT)
  app.get("/api/contact-section", async (req, res) => {
    try {
      const section = await storage.getContactSection();
      res.json({ success: true, section: section || null });
    } catch (error) {
      console.error("Error fetching contact section:", error);
      res.status(500).json({ success: false, message: "Failed to fetch contact section" });
    }
  });

  app.put("/api/contact-section", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateContactSectionSchema.parse(req.body);
      const section = await storage.upsertContactSection(validatedData);
      res.json({ success: true, section });
    } catch (error) {
      console.error("Error updating contact section:", error);
      res.status(400).json({ success: false, message: "Failed to update contact section" });
    }
  });

  // Contact Cards Routes
  app.get("/api/contact-cards", async (req, res) => {
    try {
      const cards = await storage.getAllContactCards();
      res.json({ success: true, cards });
    } catch (error) {
      console.error("Error fetching contact cards:", error);
      res.status(500).json({ success: false, message: "Failed to fetch contact cards" });
    }
  });

  app.post("/api/contact-cards", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertContactCardSchema.parse(req.body);
      const card = await storage.createContactCard(validatedData);
      res.json({ success: true, card });
    } catch (error) {
      console.error("Error creating contact card:", error);
      res.status(400).json({ success: false, message: "Failed to create contact card" });
    }
  });

  app.put("/api/contact-cards/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateContactCardSchema.parse(req.body);
      const card = await storage.updateContactCard(req.params.id, validatedData);
      if (!card) {
        return res.status(404).json({ success: false, message: "Contact card not found" });
      }
      res.json({ success: true, card });
    } catch (error) {
      console.error("Error updating contact card:", error);
      res.status(400).json({ success: false, message: "Failed to update contact card" });
    }
  });

  app.delete("/api/contact-cards/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteContactCard(req.params.id);
      res.json({ success: true, message: "Contact card deleted" });
    } catch (error) {
      console.error("Error deleting contact card:", error);
      res.status(500).json({ success: false, message: "Failed to delete contact card" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
