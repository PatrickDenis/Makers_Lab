import { SiInstagram, SiFacebook, SiLinkedin } from "react-icons/si";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const footerLinks = {
  services: [
    "Laser Cutting",
    "CNC Machining",
    "3D Printing",
    "Welding",
    "Finishing",
  ],
  company: [
    "About Us",
    "Our Team",
    "Careers",
    "Contact",
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/newsletter", { email });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "You'll receive fabrication tips and inspiration.",
      });
      setEmail("");
    },
    onError: (error: any) => {
      const message = error?.message?.includes("already subscribed") 
        ? "This email is already subscribed." 
        : "Failed to subscribe. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      newsletterMutation.mutate(email);
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">Maker's Lab</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Precision fabrication meets creative vision. Serving makers and businesses since 2015.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-linkedin"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-service-${index}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-company-${index}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get fabrication tips & project inspiration
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
                data-testid="input-newsletter"
                disabled={newsletterMutation.isPending}
              />
              <Button 
                type="submit" 
                size="icon" 
                data-testid="button-newsletter"
                disabled={newsletterMutation.isPending}
              >
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Maker's Lab. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
