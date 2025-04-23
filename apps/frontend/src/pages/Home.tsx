import GridBackground from "../components/BackgroundGrid";
import Footer from "../components/Footer";
import DemoSection from "../components/LandingPage/Demo";
import FeaturesSection from "../components/LandingPage/Feature";
import HeroSection from "../components/LandingPage/Hero";
import PricingSection from "../components/LandingPage/Pricing";
import TestimonialsSection from "../components/LandingPage/Testimonials";

export default function Home() {
  return (
    <div className="h-full">
      <GridBackground>
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <TestimonialsSection />
        <PricingSection />
        <Footer />
      </GridBackground>
    </div>
  );
}

