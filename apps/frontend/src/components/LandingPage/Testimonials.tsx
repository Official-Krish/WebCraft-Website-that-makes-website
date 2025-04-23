import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Richardson",
    role: "Startup Founder",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    content: "SiteForge AI saved us thousands in development costs. Our new website was generated in 10 minutes and looks more professional than what our previous agency delivered.",
    stars: 5,
  },
  {
    name: "Sophia Chen",
    role: "Marketing Director",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "I was skeptical about AI-generated websites, but SiteForge exceeded all expectations. The customization options are incredibly intuitive, and the designs are stunning.",
    stars: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Freelance Designer",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    content: "As a designer, I use SiteForge to rapidly prototype ideas for clients. It gives me a huge head start and lets me focus on the creative aspects rather than coding.",
    stars: 4,
  },
  {
    name: "Emma Patel",
    role: "E-commerce Owner",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    content: "Our online store was built entirely with SiteForge. The AI understood exactly what we needed, and the built-in conversion optimization has increased our sales by 37%.",
    stars: 5,
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext();
    }
    
    if (touchStart - touchEnd < -75) {
      handlePrev();
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-black">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up opacity-0 [animation-delay:100ms]">
            Loved by <span className="text-gradient">creators worldwide</span>
          </h2>
          <p className="text-muted-foreground text-lg animate-slide-up opacity-0 [animation-delay:300ms]">
            Join thousands of satisfied customers who are building beautiful websites with SiteForge AI.
          </p>
        </div>
        
        <div 
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="glass-card rounded-xl p-8 h-full">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border border-primary/30">
                      <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="flex ml-auto">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < testimonial.stars ? "text-primary fill-primary" : "text-gray-500"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-lg">"{testimonial.content}"</blockquote>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="absolute top-1/2 left-4 transform -translate-y-1/2 h-10 w-10 rounded-full bg-black/80 backdrop-blur-sm border border-primary/20 flex items-center justify-center text-white hover:bg-primary/20 transition-colors"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 h-10 w-10 rounded-full bg-black/80 backdrop-blur-sm border border-primary/20 flex items-center justify-center text-white hover:bg-primary/20 transition-colors"
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === activeIndex ? "bg-primary" : "bg-white/20 hover:bg-white/40"
                )}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
