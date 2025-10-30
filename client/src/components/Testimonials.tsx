import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "The precision and attention to detail on our aerospace components exceeded our stringent requirements. Maker's Lab delivered flawless parts on time.",
    author: "Sarah Chen",
    company: "AeroTech Industries",
    project: "Aerospace Components",
  },
  {
    quote: "Their laser cutting transformed our architectural vision into reality. The custom metalwork added the perfect industrial elegance to our space.",
    author: "Michael Rodriguez",
    company: "Studio AR",
    project: "Commercial Interior",
  },
  {
    quote: "From rapid prototyping to final production parts, the team's expertise in 3D printing saved us months of development time. Exceptional service.",
    author: "Jennifer Walsh",
    company: "InnovateTech",
    project: "Product Development",
  },
  {
    quote: "Outstanding craftsmanship on our custom furniture hardware. The brass and copper work is museum-quality. Highly recommend for luxury projects.",
    author: "David Kim",
    company: "Artisan Furniture Co.",
    project: "Luxury Hardware",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Client Testimonials</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What our clients say about working with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6" data-testid={`card-testimonial-${index}`}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-base leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-base">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Project: {testimonial.project}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
