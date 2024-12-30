
import { motion } from "framer-motion";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const featureCardVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } }
};

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-3.5rem)] bg-black text-gray-200">
      {/* Hero Section */}
      <motion.section 
        className="flex-1 w-full py-12 md:py-24 lg:py-32 xl:py-48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <motion.div 
              className="space-y-4 max-w-3xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                Generate Beautiful Websites with AI
              </h1>
              <motion.p 
                className="mx-auto max-w-[700px] text-gray-400 md:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Turn your ideas into production-ready websites in seconds. Powered by AI, built with modern technologies.
              </motion.p>
            </motion.div>
            <motion.div 
              className="space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button size="lg" onClick={() => navigate('/create')} className="group">
                Start Creating 
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Button>
              <Button variant="outline" size="lg" onClick={() => console.log('Examples clicked')} className="text-black">
                View Examples
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="w-full py-12 md:py-24 lg:py-32 border-t border-gray-800 bg-black"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div className="grid gap-12 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Sparkles className="h-8 w-8 text-blue-500" />,
                title: "AI-Powered Generation",
                description: "Describe your website in plain English and watch as AI transforms your words into beautiful, functional code."
              },
              {
                icon: <Code2 className="h-8 w-8 text-blue-500" />,
                title: "Modern Tech Stack",
                description: "Built with React, Tailwind CSS, and shadcn/ui. Your websites are fast, responsive, and accessible by default."
              },
              {
                icon: <Zap className="h-8 w-8 text-blue-500" />,
                title: "Instant Deploy",
                description: "Deploy your generated website with a single click. Go from idea to production in minutes."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-4 text-center"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h2 className="text-xl font-bold text-white">{feature.title}</h2>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Examples Section */}
      <motion.section 
        className="w-full py-12 md:py-24 lg:py-32 bg-black"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center"
            variants={fadeIn}
          >
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
                Example Templates
              </h2>
              <p className="max-w-[900px] text-gray-400 md:text-xl">
                Get started with our pre-built templates or create your own custom design.
              </p>
            </div>
          </motion.div>
          <motion.div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.button
                  onClick={() => console.log(`Template ${example.title} clicked`)}
                  className="w-full text-left rounded-lg border border-gray-800 p-6 hover:border-gray-600 bg-black/50 transition-all"
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold tracking-tight text-white">
                      {example.title}
                    </h3>
                    <p className="text-sm text-gray-400">{example.description}</p>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="w-full py-12 md:py-24 lg:py-32 border-t border-gray-800 bg-black"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto"
            variants={fadeIn}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
                Ready to Get Started?
              </h2>
              <p className="max-w-[600px] text-gray-400 md:text-xl">
                Join thousands of developers creating amazing websites with our AI-powered platform.
              </p>
            </div>
            <motion.div 
              className="space-x-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button size="lg" onClick={() => console.log('Create Website clicked')}>
                Create Your Website
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

const examples = [
  {
    title: "Landing Page",
    description: "A modern landing page with hero section, features, and CTA.",
  },
  {
    title: "Dashboard",
    description: "Admin dashboard with charts, tables, and authentication.",
  },
  {
    title: "E-commerce",
    description: "Online store with product listings and shopping cart.",
  },
  {
    title: "Blog",
    description: "Personal blog with articles and categories.",
  },
  {
    title: "Portfolio",
    description: "Showcase your work with this beautiful portfolio template.",
  },
  {
    title: "Documentation",
    description: "Technical documentation site with search and navigation.",
  },
];