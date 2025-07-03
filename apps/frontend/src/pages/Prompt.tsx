import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import Hero from "../components/Hero";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Appbar from "../components/Appbar";

export const Prompt = () => {
    return (
        <div>
            <div className="min-h-screen bg-black text-white">
                <Appbar />
                <AnimatedBackground />
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative z-10"
                >
                    <Sidebar />
                    
                    <main className="pt-16">
                        <div className="grid grid-cols-1 min-h-screen">
                            <Hero />
                        </div>
                    </main>
                </motion.div>
            </div>
        
            <Footer/>
        </div>
    )
}