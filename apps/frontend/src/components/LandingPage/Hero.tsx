import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-40" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px]" />
      
      <div className="container relative max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div>
              <span className="inline-flex animate-fade-in opacity-0 [animation-delay:200ms] items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm neon-glow">
                <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse mr-2"></span>
                Just launched v1.0
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in opacity-0 [animation-delay:400ms]">
              Build beautiful websites
              <span className="text-gradient"> with AI</span> in seconds
            </h1>
            
            <p className="text-xl text-muted-foreground animate-fade-in opacity-0 [animation-delay:600ms]">
              Stop wasting time with complicated tools. WebCraft AI generates fully-functional, 
              stunning websites based on your description. No coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in opacity-0 [animation-delay:800ms]">
              <Button size="lg" className="group neon-glow bg-primary hover:bg-primary/90" onClick={() => window.location.href = "/"}>
                Build Your Site Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/10 hover:bg-white/5" onClick={() => window.location.href = "#demo"}>
                <Sparkles className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="flex-1 rounded-xl overflow-hidden animate-fade-in opacity-0 [animation-delay:1000ms]">
            <div className="relative bg-dark-100 p-2 rounded-xl border border-primary/20 shadow-xl neon-glow">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <div className="flex items-center gap-1.5 pb-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="ml-2 h-6 bg-dark-300 rounded flex-1 flex items-center justify-center text-xs text-white/40">WebCraft.ai</div>
              </div>
              <div className="rounded-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
                  alt="AI Website Builder Interface" 
                  className="w-full h-auto object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 flex flex-wrap justify-center gap-x-16 gap-y-8 grayscale animate-fade-in opacity-0 [animation-delay:1200ms]">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/272px-Google_2015_logo.svg.png" alt="Google" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" alt="Amazon" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png" alt="Netflix" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_logo.svg/2560px-Microsoft_logo.svg.png" alt="Microsoft" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/2560px-Meta-Logo.png" alt="Meta" className="h-6" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;