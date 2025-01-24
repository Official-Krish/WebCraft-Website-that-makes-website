import { ChevronUp, Copy, Image, Proportions, ShieldCheck, Zap } from "lucide-react";
import  Template1 from "../../assets/Template1.png";
import  Template2 from "../../assets/Template2.png";
import  Template3 from "../../assets/Template3.png";
import  Netflix from "../../assets/Netflix.png";
import  Slack from "../../assets/Slack.png";

export const steps = [
    { id: 1, title: "Type Your Prompt", description: "Describe your website in natural language", bgColor: "bg-blue-600" },
    { id: 2, title: "AI Generation", description: "Our AI creates your custom website design", bgColor: "bg-purple-600" },
    { id: 3, title: "Instant Preview", description: "See your website come to life instantly", bgColor: "bg-green-600" },
];

export const features = [
    {
      title: "AI-Powered Generation",
      description: "Transform your ideas into stunning websites with our advanced AI technology",
      icon: Zap,
    },
    {
      title: "Responsive Design",
      description: "Automatically optimized for all devices and screen sizes",
      icon: Proportions,
    },
    {
      title: "Custom Styles",
      description: "Personalize colors, fonts, and layouts to match your brand",
      icon: Image,
    },
    {
      title: "Instant Export",
      description: "Download your website code and assets with one click",
      icon: Copy,
    },
    {
      title: "SEO Optimized",
      description: "Built-in SEO best practices for better visibility",
      icon: ShieldCheck,
    },
    {
      title: "Fast Performance",
      description: "Optimized code for lightning-fast loading speeds",
      icon: ChevronUp,
    },
];


export const ChooseTemplates = [
    {
      step: "1",
      title: "Describe your vision",
      description:
        "Start by providing a basic prompt of the website you want to create. Our AI understands your ideas in any language.",
      image: Template1, 
    },
    {
      step: "2",
      title: "Refine and Regenerate",
      description:
        "Your website is ready. Select a section to request changes, and it will update instantly.",
      image: Template2, 
    },
    {
      step: "3",
      title: "Export your website",
      description:
        "Happy with your creation? Export your fully functional website and launch your online presence in minutes.",
      image: Template3, 
    },
];

export const Examples = [
    {
        image: Netflix,
        Prompt: "Generate Website for Netflix in modern style..."
    },
    {
        image: Slack,
        Prompt: "Generate Website for Slack in modern style..."
    }
]

export const gradientText = "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text";
export const glowEffect = "hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-shadow duration-300";