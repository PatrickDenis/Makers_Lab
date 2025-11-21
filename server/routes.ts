import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertNewsletterSignupSchema, insertServiceSchema, updateServiceSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);

  return httpServer;
}
