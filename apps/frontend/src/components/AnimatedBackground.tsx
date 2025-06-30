import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    const particles = Array.from({ length: 15 }, (_, i) => i);
    const floatingShapes = Array.from({ length: 6 }, (_, i) => i);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-black" />
            
                {/* Subtle Grid Pattern */}
            <div 
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}
            />
        
            {/* Animated Particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    transition={{
                        duration: Math.random() * 20 + 15,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                    }}
                />
            ))}

            {/* Floating Geometric Shapes */}
            {floatingShapes.map((shape) => (
                <motion.div
                    key={shape}
                    className={`absolute ${
                        shape % 3 === 0 
                        ? 'w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500' 
                        : shape % 3 === 1
                        ? 'w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full'
                        : 'w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 transform rotate-45'
                    } opacity-20`}
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: window.innerHeight + 100,
                        rotate: 0,
                    }}
                    animate={{
                        x: Math.random() * window.innerWidth,
                        y: -100,
                        rotate: 360,
                    }}
                    transition={{
                        duration: Math.random() * 20 + 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Glowing Orbs */}
            <motion.div
                className="absolute w-96 h-96 bg-purple-500 rounded-full opacity-5 blur-3xl"
                animate={{
                    x: [100, 400, 100],
                    y: [200, 500, 200],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        
            <motion.div
                className="absolute w-64 h-64 bg-orange-500 rounded-full opacity-5 blur-3xl right-0"
                animate={{
                    x: [-50, -250, -50],
                    y: [300, 100, 300],
                    scale: [1, 1.4, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
};

export default AnimatedBackground;