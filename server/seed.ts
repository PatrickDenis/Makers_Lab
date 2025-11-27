import { db } from "./db";
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

// Track if we've already attempted to seed this process
let seedAttempted = false;

export async function seedDatabase() {
  try {
    // Only attempt once per process to avoid redundant operations
    if (seedAttempted) {
      return;
    }
    seedAttempted = true;
    
    // Check if services table already has data
    // If it does, we preserve existing custom data and don't seed
    const existingCount = await db.select().from(services).limit(1);
    if (existingCount.length > 0) {
      console.log("Database already contains services, preserving existing data...");
      return;
    }
    
    console.log("Seeding database with default content...");
    
    // Only seed if table is empty
    await db.insert(services).values(initialServices);
    console.log("✓ Services seeded");
    
    await db.insert(projects).values(initialProjects);
    console.log("✓ Projects seeded");
    
    await db.insert(equipment).values(initialEquipment);
    console.log("✓ Equipment seeded");
    
    await db.insert(processSteps).values(initialProcessSteps);
    console.log("✓ Process steps seeded");
    
    await db.insert(testimonials).values(initialTestimonials);
    console.log("✓ Testimonials seeded");
    
    console.log("✓ Database seeding complete");
  } catch (error) {
    console.error("Error during database seed:", error);
    // Don't throw - let the app continue
  }
}

// Allow running directly with: npx tsx server/seed.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
