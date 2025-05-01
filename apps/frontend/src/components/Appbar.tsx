import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { Menu } from "lucide-react";
import { UserDropdown } from "./DropDown";

const Appbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-8 border-b border-white/20",
        isScrolled ? "bg-black/80 backdrop-blur-lg border-b border-white/5" : "bg-transparent"
      )}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href = "/home"}>
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center neon-glow">
            <span className="font-bold text-white">AI</span>
          </div>
          <span className="text-lg font-bold">WebCraft</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Features</a>
          <a href="#demo" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Demo</a>
          <a href="#testimonials" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Testimonials</a>
          <a href="#pricing" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Pricing</a>
        </nav>
        {localStorage.getItem("token") ? <UserDropdown /> : 
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden md:flex hover:bg-white/5" onClick={() => window.location.href = "/signin"}>
              Sign In
            </Button>
            <Button size="sm" className="neon-glow hover:bg-primary/90">
              Try For Free
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        }
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/5 animate-fade-in">
          <nav className="container max-w-7xl mx-auto py-4 px-6 flex flex-col space-y-4">
            <a href="#features" className="text-sm py-2 text-foreground/70 hover:text-foreground transition-colors">Features</a>
            <a href="#demo" className="text-sm py-2 text-foreground/70 hover:text-foreground transition-colors">Demo</a>
            <a href="#testimonials" className="text-sm py-2 text-foreground/70 hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm py-2 text-foreground/70 hover:text-foreground transition-colors">Pricing</a>
            <Button variant="outline" size="sm" className="w-full mt-2 hover:bg-white/5">
              Sign In
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Appbar;