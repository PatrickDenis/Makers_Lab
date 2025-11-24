import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Equipment from "@/components/Equipment";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Construction Banner Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Site Under Construction</h2>
              <p className="text-muted-foreground">
                We're making some improvements to serve you better!
              </p>
              <p className="text-sm font-medium text-primary">
                November 21 - November 30, 2024
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Some features may be temporarily unavailable during this time. We appreciate your patience.
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content (blurred in background) */}
      <Navigation />
      <Hero />
      <Services />
      <Portfolio />
      <Equipment />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
