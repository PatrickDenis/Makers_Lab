import { MessageSquare, Pencil, Wrench, Truck } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Consultation",
    description: "Discuss your project requirements, materials, timeline, and budget with our team.",
  },
  {
    icon: Pencil,
    title: "Design",
    description: "We review your designs or help create technical drawings optimized for fabrication.",
  },
  {
    icon: Wrench,
    title: "Fabrication",
    description: "Your project comes to life using precision equipment and expert craftsmanship.",
  },
  {
    icon: Truck,
    title: "Delivery",
    description: "Quality inspection, finishing touches, and delivery to your specifications.",
  },
];

export default function Process() {
  return (
    <section className="py-16 lg:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Our Process</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From concept to completion in four streamlined steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative" data-testid={`step-${index}`}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                    <Icon className="w-8 h-8 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
