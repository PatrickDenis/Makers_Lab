import { db, pool } from "./db";
import { eq } from "drizzle-orm";
import { services, projects, equipment, processSteps, testimonials } from "@shared/schema";

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

const initialProjects = [
  {
    title: "Precision Industrial Components",
    category: "Industrial",
    description: "CNC machined aluminum parts with tight tolerances for aerospace application.",
    tags: ["CNC", "Aluminum", "Aerospace"],
    imageUrl: "/seed-images/CNC_machined_industrial_part_f29ddd5e.png",
    order: "1"
  },
  {
    title: "Decorative Metal Panel",
    category: "Art",
    description: "Custom laser-cut architectural metalwork for commercial interior design project.",
    tags: ["Laser Cutting", "Art", "Architecture"],
    imageUrl: "/seed-images/Laser_cut_artistic_panel_cfaed520.png",
    order: "2"
  },
  {
    title: "Functional Prototype Assembly",
    category: "Prototype",
    description: "3D printed mechanical assembly for product development testing and validation.",
    tags: ["3D Printing", "Prototype", "Engineering"],
    imageUrl: "/seed-images/3D_printed_prototype_assembly_34122b60.png",
    order: "3"
  },
  {
    title: "Structural Steel Framework",
    category: "Industrial",
    description: "Heavy-duty welded steel frame for industrial machinery installation.",
    tags: ["Welding", "Steel", "Heavy Fabrication"],
    imageUrl: "/seed-images/Welded_steel_frame_structure_0594cf3b.png",
    order: "4"
  },
  {
    title: "Custom Brass Hardware",
    category: "Art",
    description: "Precision-machined brass and copper components for luxury furniture line.",
    tags: ["CNC", "Brass", "Luxury"],
    imageUrl: "/seed-images/Custom_brass_hardware_components_ba9605f9.png",
    order: "5"
  }
];

const initialEquipment = [
  { label: "Laser Cutting", spec: "Up to 1/2\" steel, 1\" acrylic", order: "1" },
  { label: "CNC Precision", spec: "±0.001\" tolerance", order: "2" },
  { label: "3D Print Volume", spec: "12\" x 12\" x 16\"", order: "3" },
  { label: "Materials", spec: "Metal, plastic, wood, composites", order: "4" },
  { label: "Welding", spec: "MIG, TIG, Stick certified", order: "5" },
  { label: "Finishing", spec: "Powder coat, anodize, polish", order: "6" }
];

const initialProcessSteps = [
  {
    title: "Consultation",
    description: "Discuss your project requirements, materials, timeline, and budget with our team.",
    icon: "MessageSquare",
    order: "1"
  },
  {
    title: "Design",
    description: "We review your designs or help create technical drawings optimized for fabrication.",
    icon: "Pencil",
    order: "2"
  },
  {
    title: "Fabrication",
    description: "Your project comes to life using precision equipment and expert craftsmanship.",
    icon: "Wrench",
    order: "3"
  },
  {
    title: "Delivery",
    description: "Quality inspection, finishing touches, and delivery to your specifications.",
    icon: "Truck",
    order: "4"
  }
];

const initialTestimonials = [
  {
    quote: "The precision and attention to detail on our aerospace components exceeded our stringent requirements. Maker's Lab delivered flawless parts on time.",
    author: "Sarah Chen",
    company: "AeroTech Industries",
    project: "Aerospace Components",
    order: "1"
  },
  {
    quote: "Their laser cutting transformed our architectural vision into reality. The custom metalwork added the perfect industrial elegance to our space.",
    author: "Michael Rodriguez",
    company: "Studio AR",
    project: "Commercial Interior",
    order: "2"
  },
  {
    quote: "From rapid prototyping to final production parts, the team's expertise in 3D printing saved us months of development time. Exceptional service.",
    author: "Jennifer Walsh",
    company: "InnovateTech",
    project: "Product Development",
    order: "3"
  },
  {
    quote: "Outstanding craftsmanship on our custom furniture hardware. The brass and copper work is museum-quality. Highly recommend for luxury projects.",
    author: "David Kim",
    company: "Artisan Furniture Co.",
    project: "Luxury Hardware",
    order: "4"
  }
];

async function migrateImageUrls() {
  // Fix old image URLs that pointed to attached_assets
  await pool.query(`
    UPDATE projects 
    SET image_url = REPLACE(image_url, '/attached_assets/generated_images/', '/seed-images/') 
    WHERE image_url LIKE '/attached_assets/generated_images/%'
  `);
}

async function cleanupDuplicates() {
  console.log("Cleaning up any duplicate entries...");
  
  // Clean duplicate services (keep first occurrence by title)
  const allServices = await db.select().from(services);
  const seenServiceTitles = new Set<string>();
  for (const service of allServices) {
    if (seenServiceTitles.has(service.title)) {
      await db.delete(services).where(eq(services.id, service.id));
    } else {
      seenServiceTitles.add(service.title);
    }
  }
  
  // Clean duplicate projects (keep first occurrence by title)
  const allProjects = await db.select().from(projects);
  const seenProjectTitles = new Set<string>();
  for (const project of allProjects) {
    if (seenProjectTitles.has(project.title)) {
      await db.delete(projects).where(eq(projects.id, project.id));
    } else {
      seenProjectTitles.add(project.title);
    }
  }
  
  // Clean duplicate equipment (keep first occurrence by label)
  const allEquipment = await db.select().from(equipment);
  const seenEquipmentLabels = new Set<string>();
  for (const equip of allEquipment) {
    if (seenEquipmentLabels.has(equip.label)) {
      await db.delete(equipment).where(eq(equipment.id, equip.id));
    } else {
      seenEquipmentLabels.add(equip.label);
    }
  }
  
  // Clean duplicate process steps (keep first occurrence by title)
  const allProcessSteps = await db.select().from(processSteps);
  const seenStepTitles = new Set<string>();
  for (const step of allProcessSteps) {
    if (seenStepTitles.has(step.title)) {
      await db.delete(processSteps).where(eq(processSteps.id, step.id));
    } else {
      seenStepTitles.add(step.title);
    }
  }
  
  // Clean duplicate testimonials (keep first occurrence by author)
  const allTestimonials = await db.select().from(testimonials);
  const seenTestimonialAuthors = new Set<string>();
  for (const testimonial of allTestimonials) {
    if (seenTestimonialAuthors.has(testimonial.author)) {
      await db.delete(testimonials).where(eq(testimonials.id, testimonial.id));
    } else {
      seenTestimonialAuthors.add(testimonial.author);
    }
  }
  
  console.log("Duplicate cleanup complete!");
}

export async function seedDatabase() {
  try {
    console.log("Checking database for initial content...");
    
    // Migrate any old image URLs first
    await migrateImageUrls();
    
    // Always cleanup duplicates
    await cleanupDuplicates();
    
    // Create seed_log table if it doesn't exist (using raw SQL to avoid migration issues)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seed_log (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        seeded_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    
    // Check if already seeded using seed_log table
    const seedResult = await pool.query("SELECT * FROM seed_log LIMIT 1");
    if (seedResult.rows.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }
    
    // Mark as seeded FIRST to prevent race conditions with multiple instances
    await pool.query("INSERT INTO seed_log (id) VALUES (gen_random_uuid())");
    console.log("Starting initial seed...");
    
    const existingServices = await db.select().from(services);
    if (existingServices.length === 0) {
      await db.insert(services).values(initialServices);
      console.log("Services seeded!");
    }
    
    const existingProjects = await db.select().from(projects);
    if (existingProjects.length === 0) {
      await db.insert(projects).values(initialProjects);
      console.log("Projects seeded!");
    }
    
    const existingEquipment = await db.select().from(equipment);
    if (existingEquipment.length === 0) {
      await db.insert(equipment).values(initialEquipment);
      console.log("Equipment seeded!");
    }
    
    const existingProcessSteps = await db.select().from(processSteps);
    if (existingProcessSteps.length === 0) {
      await db.insert(processSteps).values(initialProcessSteps);
      console.log("Process steps seeded!");
    }
    
    const existingTestimonials = await db.select().from(testimonials);
    if (existingTestimonials.length === 0) {
      await db.insert(testimonials).values(initialTestimonials);
      console.log("Testimonials seeded!");
    }
    
    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Allow running directly with: npx tsx server/seed.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
