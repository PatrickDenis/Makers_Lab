import { db } from "./db";
import { services } from "@shared/schema";

const initialServices = [
  {
    title: "Laser Cutting",
    description: "Precision laser cutting for metal, acrylic, and wood. Perfect for intricate designs and clean edges.",
    icon: "Scissors",
    order: "1"
  },
  {
    title: "CNC Machining",
    description: "Computer-controlled precision machining for complex parts and prototypes.",
    icon: "Cog",
    order: "2"
  },
  {
    title: "3D Printing",
    description: "Rapid prototyping and custom parts using advanced 3D printing technology.",
    icon: "Box",
    order: "3"
  },
  {
    title: "Welding & Fabrication",
    description: "Professional welding services for structural and decorative metalwork.",
    icon: "Flame",
    order: "4"
  },
  {
    title: "Metal Finishing",
    description: "Powder coating, anodizing, and polishing for perfect surface treatments.",
    icon: "Sparkles",
    order: "5"
  },
  {
    title: "Custom Design",
    description: "Work with our team to bring your unique ideas to life with expert design assistance.",
    icon: "Pencil",
    order: "6"
  }
];

async function seed() {
  try {
    console.log("Seeding database...");
    
    const existingServices = await db.select().from(services);
    if (existingServices.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    await db.insert(services).values(initialServices);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed().then(() => process.exit(0)).catch(() => process.exit(1));
