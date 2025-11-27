import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import type { Service } from "@shared/schema";

export default function Services() {
  const { data: servicesData, isLoading } = useQuery<{ success: boolean; services: Service[] }>({
    queryKey: ["/api/services"],
  });

  const services = servicesData?.services || [];

  return (
    <section id="services" className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive fabrication capabilities to bring your vision to life
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: Service, index: number) => {
              const IconComponent = (Icons as any)[service.icon] || Icons.Wrench;
              return (
                <Card 
                  key={service.id} 
                  className="relative overflow-hidden hover-elevate cursor-pointer transition-all min-h-[280px]"
                  data-testid={`card-service-${index}`}
                >
                  {service.imageUrl ? (
                    <>
                      <img 
                        src={service.imageUrl} 
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                      <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                        <div className="mb-4">
                          <div className="w-12 h-12 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                        <p className="text-white/80 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-6">
                      <div className="mb-4">
                        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
