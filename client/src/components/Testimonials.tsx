import { Card } from "@/components/ui/card";
import { Star, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Testimonials() {
  const { data, isLoading } = useQuery<{ success: boolean; testimonials: Testimonial[] }>({
    queryKey: ["/api/testimonials"]
  });

  const testimonials = data?.testimonials || [];
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Client Testimonials</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What our clients say about working with us
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading testimonials...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="p-6" data-testid={`card-testimonial-${index}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-base leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-border pt-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {testimonial.avatarUrl ? (
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.author} />
                    ) : null}
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-base">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      Project: {testimonial.project}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
