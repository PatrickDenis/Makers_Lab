import { useQuery } from "@tanstack/react-query";
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
import type { ConstructionBanner } from "@shared/schema";

export default function Home() {
  const { data: bannerData } = useQuery<{ success: boolean; banner: ConstructionBanner | null }>({
    queryKey: ["/api/construction-banner"],
  });

  const banner = bannerData?.banner;
  const showBanner = banner?.enabled;

  return (
    <div className="min-h-screen">
      {/* Construction Banner Overlay */}
      {showBanner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="construction-banner-overlay">
          <Card className="max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold" data-testid="banner-title">{banner.title}</h2>
                <p className="text-muted-foreground" data-testid="banner-subtitle">
                  {banner.subtitle}
                </p>
                {(banner.startDate || banner.endDate) && (
                  <p className="text-sm font-medium text-primary" data-testid="banner-dates">
                    {banner.startDate}{banner.startDate && banner.endDate ? " - " : ""}{banner.endDate}
                  </p>
                )}
              </div>

              {banner.message && (
                <p className="text-sm text-muted-foreground" data-testid="banner-message">
                  {banner.message}
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
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
