import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  description: string;
}

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData & { budget: string; timeline: string }) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Quote request received!",
        description: "We'll get back to you within 24 hours.",
      });
      reset();
      setBudget("");
      setTimeline("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate({
      ...data,
      budget,
      timeline,
    });
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to start your project? Fill out the form below for a free quote
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: true })}
                  placeholder="John Doe"
                  className="mt-2"
                  data-testid="input-name"
                  disabled={contactMutation.isPending}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">Name is required</p>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="john@example.com"
                  className="mt-2"
                  data-testid="input-email"
                  disabled={contactMutation.isPending}
                />
                {errors.email && <p className="text-sm text-destructive mt-1">Email is required</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="(555) 123-4567"
                  className="mt-2"
                  data-testid="input-phone"
                  disabled={contactMutation.isPending}
                />
              </div>

              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={budget} onValueChange={setBudget} disabled={contactMutation.isPending}>
                  <SelectTrigger className="mt-2" data-testid="select-budget">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1k">Under $1,000</SelectItem>
                    <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                    <SelectItem value="over-10k">Over $10,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Select value={timeline} onValueChange={setTimeline} disabled={contactMutation.isPending}>
                  <SelectTrigger className="mt-2" data-testid="select-timeline">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">ASAP (Rush)</SelectItem>
                    <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                    <SelectItem value="1month">1 month</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: true })}
                  placeholder="Tell us about your project requirements..."
                  className="mt-2 min-h-32"
                  data-testid="textarea-description"
                  disabled={contactMutation.isPending}
                />
                {errors.description && <p className="text-sm text-destructive mt-1">Description is required</p>}
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                data-testid="button-submit-quote"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? "Submitting..." : "Request Quote"}
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Industrial Way<br />
                    Maker City, MC 12345
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Phone</h3>
                  <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">info@makerslab.com</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 8am - 6pm<br />
                    Saturday: 9am - 2pm<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <p className="text-sm font-medium">
                <span className="text-primary">Fast Response:</span> We typically respond to quote requests within 24 hours during business days.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
