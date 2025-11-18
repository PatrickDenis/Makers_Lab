import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`text-2xl font-bold transition-colors ${
              isScrolled ? "text-foreground" : "text-white"
            }`}
            data-testid="link-logo"
          >
            Maker's Lab
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
            <Button 
              onClick={() => handleNavClick("#contact")}
              data-testid="button-nav-quote"
            >
              Get Quote
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${isScrolled ? "" : "text-white hover:bg-white/10"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left font-medium hover:text-primary transition-colors"
                data-testid={`link-mobile-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
            <Button 
              className="w-full" 
              onClick={() => handleNavClick("#contact")}
              data-testid="button-mobile-quote"
            >
              Get Quote
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
