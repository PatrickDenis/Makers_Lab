import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import project1 from "@assets/generated_images/CNC_machined_industrial_part_f29ddd5e.png";
import project2 from "@assets/generated_images/Laser_cut_artistic_panel_cfaed520.png";
import project3 from "@assets/generated_images/3D_printed_prototype_assembly_34122b60.png";
import project4 from "@assets/generated_images/Welded_steel_frame_structure_0594cf3b.png";
import project5 from "@assets/generated_images/Custom_brass_hardware_components_ba9605f9.png";

const projects = [
  {
    image: project1,
    title: "Precision Industrial Components",
    category: "Industrial",
    description: "CNC machined aluminum parts with tight tolerances for aerospace application.",
    tags: ["CNC", "Aluminum", "Aerospace"],
  },
  {
    image: project2,
    title: "Decorative Metal Panel",
    category: "Art",
    description: "Custom laser-cut architectural metalwork for commercial interior design project.",
    tags: ["Laser Cutting", "Art", "Architecture"],
  },
  {
    image: project3,
    title: "Functional Prototype Assembly",
    category: "Prototype",
    description: "3D printed mechanical assembly for product development testing and validation.",
    tags: ["3D Printing", "Prototype", "Engineering"],
  },
  {
    image: project4,
    title: "Structural Steel Framework",
    category: "Industrial",
    description: "Heavy-duty welded steel frame for industrial machinery installation.",
    tags: ["Welding", "Steel", "Heavy Fabrication"],
  },
  {
    image: project5,
    title: "Custom Brass Hardware",
    category: "Art",
    description: "Precision-machined brass and copper components for luxury furniture line.",
    tags: ["CNC", "Brass", "Luxury"],
  },
];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <>
      <section id="portfolio" className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Featured Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Showcasing our precision craftsmanship across industrial, artistic, and prototype work
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={index}
                className="overflow-hidden hover-elevate cursor-pointer transition-all group"
                onClick={() => setSelectedProject(project)}
                data-testid={`card-project-${index}`}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" data-testid={`badge-category-${index}`}>
                      {project.category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl" data-testid="dialog-project-detail">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProject?.title}</DialogTitle>
            <DialogDescription>{selectedProject?.category}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <img 
              src={selectedProject?.image} 
              alt={selectedProject?.title}
              className="w-full rounded-md mb-4"
            />
            <p className="text-base mb-4">{selectedProject?.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedProject?.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
