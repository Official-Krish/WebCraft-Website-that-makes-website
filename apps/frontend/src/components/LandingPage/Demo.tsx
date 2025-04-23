import { useState, useRef, useEffect } from 'react';
import { Play, Pause, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const demoRef = useRef<HTMLDivElement>(null);
  
  const steps = [
    { title: "Describe Your Website", content: "Just tell us what you want in plain English." },
    { title: "AI Generates Options", content: "Multiple design options created in seconds." },
    { title: "Customize & Refine", content: "Fine-tune your selection with simple commands." },
    { title: "Launch Your Site", content: "Publish instantly with one click." }
  ];
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentStep((prev) => (prev % steps.length) + 1);
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, steps.length]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );
    
    if (demoRef.current) {
      observer.observe(demoRef.current);
    }
    
    return () => {
      if (demoRef.current) {
        observer.unobserve(demoRef.current);
      }
    };
  }, []);

  return (
    <section id="demo" className="py-16 md:py-24 relative" ref={demoRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-gradient">
            See WebCraft AI in Action
          </h2>
          <p className="text-lg text-gray-400">
            Watch how our platform turns your ideas into stunning websites in just a few simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex gap-4 p-4 rounded-lg transition-all duration-300 ${
                    currentStep === index + 1 
                      ? 'bg-gray-800/60 border border-gray-700' 
                      : 'bg-transparent'
                  }`}
                >
                  <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium ${
                    currentStep === index + 1 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className={`font-medium text-lg ${
                      currentStep === index + 1 ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`${
                      currentStep === index + 1 ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {step.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center px-3 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Play
                  </>
                )}
              </button>
              
              <Button className="group">
                Try It Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-1 shadow-xl shadow-purple-900/10">
              <div className="bg-gray-950 rounded-lg overflow-hidden">
                <div className="aspect-[16/9] relative">
                  {/* Demo content based on current step */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="w-full max-w-md px-4">
                      {currentStep === 1 && (
                        <div className="space-y-5 animate-fade-in">
                          <h4 className="text-xl text-center text-purple-400 font-medium">Step 1: Describe Your Website</h4>
                          <div className="bg-gray-800 rounded-lg p-4 text-gray-300">
                            <p className="typewriter-text">
                              "I need a professional portfolio website for a photographer with a dark theme, image gallery, and contact form."
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {currentStep === 2 && (
                        <div className="space-y-5 animate-fade-in">
                          <h4 className="text-xl text-center text-cyan-400 font-medium">Step 2: AI Generates Options</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((item) => (
                              <div key={item} className="aspect-video bg-gray-800 rounded-md border border-gray-700 flex items-center justify-center">
                                <span className="text-xs text-gray-400">Design {item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {currentStep === 3 && (
                        <div className="space-y-5 animate-fade-in">
                          <h4 className="text-xl text-center text-pink-400 font-medium">Step 3: Customize & Refine</h4>
                          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                            <div className="flex gap-2 pt-2">
                              <div className="h-6 w-6 rounded-full bg-purple-500"></div>
                              <div className="h-6 w-6 rounded-full bg-indigo-500"></div>
                              <div className="h-6 w-6 rounded-full bg-pink-500"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {currentStep === 4 && (
                        <div className="space-y-5 animate-fade-in">
                          <h4 className="text-xl text-center text-green-400 font-medium">Step 4: Launch Your Site</h4>
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-3">
                              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="text-green-400 font-medium">Website Successfully Launched!</p>
                            <p className="text-sm text-gray-400">yourwebsite.com is now live</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex items-center">
                  <div className="flex space-x-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="mx-auto text-sm text-gray-400">
                    WebCraft AI Platform
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;