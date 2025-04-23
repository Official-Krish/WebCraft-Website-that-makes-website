import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for trying out SiteForge",
    features: [
      "1 website",
      "Basic AI design templates",
      "Export to HTML/CSS",
      "Community support",
      "SiteForge branding",
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Everything you need for professional websites",
    features: [
      "10 websites",
      "Advanced AI design options",
      "Custom code export",
      "Priority support",
      "No SiteForge branding",
      "Custom domains",
      "Analytics dashboard",
    ],
    cta: "Get Pro",
    popular: true,
  },
  {
    name: "Agency",
    price: "$79",
    period: "/month",
    description: "For teams and businesses",
    features: [
      "Unlimited websites",
      "Premium AI designs",
      "White-label solution",
      "Dedicated support",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Advanced analytics",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-black">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up opacity-0 [animation-delay:100ms]">
            Simple, <span className="text-gradient">transparent pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg animate-slide-up opacity-0 [animation-delay:300ms]">
            Choose the plan that's right for you and start creating beautiful websites today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={cn(
                "relative rounded-xl border transition-all duration-300 animate-scale-in opacity-0",
                plan.popular ? 
                  "border-primary/50 bg-primary/5 neon-glow" : 
                  "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.075]"
              )}
              style={{ animationDelay: `${(index + 3) * 200}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-1 mb-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                
                <Button 
                  className={cn(
                    "w-full mb-8",
                    plan.popular ? "bg-primary hover:bg-primary/90 neon-glow" : ""
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
