import { Card } from "@/components/ui/card";
import { Zap, Box, Wrench, Boxes, Sparkles, Cog } from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Laser Cutting",
    description: "Precision laser cutting for metal, wood, and acrylic with tolerances down to 0.1mm. Perfect for intricate designs and clean edges.",
  },
  {
    icon: Cog,
    title: "CNC Machining",
    description: "Multi-axis CNC milling and turning for complex metal and plastic parts. From prototypes to production runs.",
  },
  {
    icon: Box,
    title: "3D Printing",
    description: "Rapid prototyping and production with FDM and SLA technologies. Multiple materials available including engineering-grade plastics.",
  },
  {
    icon: Wrench,
    title: "Welding & Fabrication",
    description: "Expert MIG, TIG, and stick welding for steel, aluminum, and stainless steel. Custom metal fabrication for any application.",
  },
  {
    icon: Boxes,
    title: "Assembly & Finishing",
    description: "Complete assembly services, powder coating, anodizing, and finishing to bring your project to perfection.",
  },
  {
    icon: Sparkles,
    title: "Design Consultation",
    description: "Work with our team to optimize your designs for manufacturability, cost-efficiency, and performance.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive fabrication capabilities to bring your vision to life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="p-6 hover-elevate cursor-pointer transition-all"
                data-testid={`card-service-${index}`}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
