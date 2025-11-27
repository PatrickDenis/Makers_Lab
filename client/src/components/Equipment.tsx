import { Card } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Equipment as EquipmentType } from "@shared/schema";

import equipment1 from "@assets/generated_images/Laser_cutter_machine_equipment_00668cbf.png";
import equipment2 from "@assets/generated_images/CNC_milling_machine_equipment_c5559442.png";
import equipment3 from "@assets/generated_images/3D_printer_farm_equipment_fc60a112.png";

const defaultEquipmentImages = [equipment1, equipment2, equipment3];

export default function Equipment() {
  const { data, isLoading } = useQuery<{ success: boolean; equipment: EquipmentType[] }>({
    queryKey: ["/api/equipment"]
  });

  const capabilities = data?.equipment || [];
  const [currentImage, setCurrentImage] = useState(0);

  const equipmentImages = useMemo(() => {
    const imagesFromData = capabilities
      .filter(cap => cap.imageUrl)
      .map(cap => cap.imageUrl as string);
    
    return imagesFromData.length > 0 ? imagesFromData : defaultEquipmentImages;
  }, [capabilities]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % equipmentImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + equipmentImages.length) % equipmentImages.length);
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Equipment & Capabilities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            State-of-the-art machinery and expert craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted">
                <img 
                  src={equipmentImages[currentImage]} 
                  alt="Equipment"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="secondary"
                size="icon"
                className="ml-4 bg-background/90 backdrop-blur-sm"
                onClick={prevImage}
                data-testid="button-prev-equipment"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="secondary"
                size="icon"
                className="mr-4 bg-background/90 backdrop-blur-sm"
                onClick={nextImage}
                data-testid="button-next-equipment"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {equipmentImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImage ? "bg-primary w-8" : "bg-muted-foreground/30"
                  }`}
                  onClick={() => setCurrentImage(idx)}
                  data-testid={`button-carousel-dot-${idx}`}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
            {isLoading ? (
              <p className="text-muted-foreground">Loading capabilities...</p>
            ) : (
              <div className="space-y-4">
                {capabilities.map((cap, idx) => (
                  <div key={cap.id} className="flex justify-between items-start pb-4 border-b border-border">
                    <span className="font-semibold text-base">{cap.label}</span>
                    <span className="font-mono text-sm text-muted-foreground text-right">{cap.spec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
