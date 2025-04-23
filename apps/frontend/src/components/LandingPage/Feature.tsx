import { Zap, Code, Globe, Clock } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "AI-Powered Design",
    description: "Our advanced AI analyzes thousands of award-winning websites to generate beautiful designs tailored to your brand.",
  },
  {
    icon: <Code className="h-6 w-6 text-primary" />,
    title: "Clean Code Export",
    description: "Download production-ready code that's optimized for performance and SEO with full ownership of your site.",
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: "Instant Publishing",
    description: "Deploy to our global CDN with a single click for blazing-fast load times and 99.9% uptime guarantee.",
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Save Time & Money",
    description: "Create in minutes what would take designers and developers weeks, at a fraction of the cost.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-dark-100 to-90%" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-20" />
      
      <div className="container relative max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in opacity-0 [animation-delay:100ms]">
            Everything you need to create <span className="text-gradient">amazing websites</span>
          </h2>
          <p className="text-muted-foreground text-lg animate-fade-in opacity-0 [animation-delay:300ms]">
            WebCraftAI combines the creativity of AI with the precision of professional design tools to give you the best of both worlds.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card p-8 rounded-xl animate-fade-in opacity-0 transition-all duration-300 hover:neon-border"
              style={{ animationDelay: `${(index + 3) * 200}ms` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
