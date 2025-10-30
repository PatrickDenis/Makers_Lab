import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_laser_cutting_action_31c4acae.png";

export default function Hero() {
  const handleGetQuote = () => {
    console.log("Navigate to contact form");
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewPortfolio = () => {
    console.log("Navigate to portfolio");
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
            Precision Fabrication Meets Creative Vision
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-8 font-medium">
            Transform your ideas into reality with professional laser cutting, CNC machining, 3D printing, and custom metalwork.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={handleGetQuote}
              data-testid="button-get-quote"
            >
              Request a Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              onClick={handleViewPortfolio}
              data-testid="button-view-portfolio"
            >
              View Portfolio
            </Button>
          </div>
          <p className="text-white/80 mt-8 text-sm font-medium">
            Serving makers since 2015 • 500+ Projects Completed
          </p>
        </div>
      </div>
    </section>
  );
}
