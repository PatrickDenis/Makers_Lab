import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertNewsletterSignupSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
