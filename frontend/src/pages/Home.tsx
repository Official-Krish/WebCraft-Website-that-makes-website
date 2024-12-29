import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-3.5rem)] bg-black text-gray-200">
      {/* Hero Section */}
      <section className="flex-1 w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                Generate Beautiful Websites with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                Turn your ideas into production-ready websites in seconds. Powered by AI, built with modern technologies.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link to="/create">
                  Start Creating <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/examples" className="text-black">View Examples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t border-gray-800 bg-black">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                <Sparkles className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-white">AI-Powered Generation</h2>
              <p className="text-gray-400">
                Describe your website in plain English and watch as AI transforms your words into beautiful, functional code.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                <Code2 className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Modern Tech Stack</h2>
              <p className="text-gray-400">
                Built with Reactjs, Tailwind CSS, Nodejs, Express, and shadcn/ui. Your websites are fast, responsive, and accessible by default.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Instant Deploy</h2>
              <p className="text-gray-400">
                Deploy your generated website to Vercel with a single click. Go from idea to production in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
                Example Templates
              </h2>
              <p className="max-w-[900px] text-gray-400 md:text-xl">
                Get started with our pre-built templates or create your own custom design.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
            {examples.map((example, index) => (
              <Link
                key={index}
                to={example.href}
                className="group relative rounded-lg border border-gray-800 p-6 hover:border-gray-600 bg-black/50 transition-all"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold tracking-tight text-white">
                    {example.title}
                  </h3>
                  <p className="text-sm text-gray-400">{example.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t border-gray-800 bg-black">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
                Ready to Get Started?
              </h2>
              <p className="max-w-[600px] text-gray-400 md:text-xl">
                Join thousands of developers creating amazing websites with our AI-powered platform.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link to="/create">Create Your Website</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const examples = [
  {
    title: "Landing Page",
    description: "A modern landing page with hero section, features, and CTA.",
    href: "/templates/landing",
  },
  {
    title: "Dashboard",
    description: "Admin dashboard with charts, tables, and authentication.",
    href: "/templates/dashboard",
  },
  {
    title: "E-commerce",
    description: "Online store with product listings and shopping cart.",
    href: "/templates/ecommerce",
  },
  {
    title: "Blog",
    description: "Personal blog with articles and categories.",
    href: "/templates/blog",
  },
  {
    title: "Portfolio",
    description: "Showcase your work with this beautiful portfolio template.",
    href: "/templates/portfolio",
  },
  {
    title: "Documentation",
    description: "Technical documentation site with search and navigation.",
    href: "/templates/docs",
  },
];