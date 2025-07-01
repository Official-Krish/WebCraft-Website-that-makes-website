import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight, Paperclip, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';

const Hero = () => {
    const [prompt, setPrompt] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1
            }
        }
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const inputVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { duration: 0.6, delay: 0.5 }
        }
    };

    const floatingElements = Array.from({ length: 6 }, (_, i) => i);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!localStorage.getItem("token")){
            navigate('/signin');
            return;
        }
        if (!prompt) {
            alert("Please enter a prompt");
            return;
        }

        const res = await axios.post(`${BACKEND_URL}/project/create`, { prompt }, {
            headers: {
                Authorization: `${localStorage.getItem("token")}`,
            },
        });
       if (res.status === 200) {
            navigate(`/project/${res.data.projectId}?prompt=${prompt}`), {
                state: { projectId: res.data.projectId, prompt: prompt },
            };
        }
        else {
            alert("Error creating project");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 relative max-w-6xl mx-auto">
            {/* Floating Elements */}
            {floatingElements.map((element) => (
                <motion.div
                    key={element}
                    className={`absolute ${
                        element % 2 === 0 ? 'text-purple-500' : 'text-orange-500'
                    } opacity-20`}
                    style={{
                        left: `${20 + (element * 12)}%`,
                        top: `${25 + (element * 8)}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 360],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 4 + element,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: element * 0.5
                    }}
                >
                    {element % 3 === 0 ? <Sparkles size={20} /> : element % 3 === 1 ? <Zap size={16} /> : <ArrowRight size={18} />}
                </motion.div>
            ))}

            {/* Main Title */}
            <motion.div
                className="text-center mb-12"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 className="text-6xl md:text-8xl font-bold text-white mb-6 flex flex-wrap justify-center gap-2">
                    {"Create without limits".split("").map((letter, index) => (
                        <motion.span
                            key={index}
                            variants={letterVariants}
                            whileHover={{ 
                                scale: 1.1, 
                                color: "#A855F7",
                                textShadow: "0 0 20px rgba(168, 85, 247, 0.5)"
                            }}
                            className="cursor-pointer"
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                    ))}
                </motion.h1>
                
                <motion.p 
                    className="text-gray-400 text-xl md:text-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    Build Fullstack web apps by prompting
                </motion.p>
            </motion.div>

            {/* Search Input */}
            <motion.div
                className="w-full max-w-4xl relative mb-16"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="relative">
                    <motion.div
                        className={`relative bg-gray-900/80 backdrop-blur-lg rounded-2xl border transition-all duration-300 ${
                        isFocused ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'
                        }`}
                        animate={{
                        boxShadow: isFocused 
                            ? "0 0 30px rgba(168, 85, 247, 0.3)" 
                            : "0 0 0px rgba(168, 85, 247, 0)"
                        }}
                    >
                        <div className="flex items-center px-6 py-4">
                            <motion.div
                                animate={{ rotate: isFocused ? 360 : 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Search className="text-gray-400 mr-4" size={24} />
                            </motion.div>
                        
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="build a habit tracking app with streak visualization and social fea"
                                className="flex-1 bg-transparent text-white placeholder-gray-500 text-lg outline-none"
                            />
                            
                            <div className="flex items-center gap-3 ml-4">
                                <motion.button
                                    className="text-gray-400 hover:text-white transition-colors"
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Paperclip size={20} />
                                </motion.button>
                                
                                <motion.div 
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSubmit}
                                >
                                    <span>Agentic</span>
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded">max</span>
                                    <ArrowRight size={16} />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Input glow effect */}
                    <AnimatePresence>
                        {isFocused && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl -z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Floating suggestion pills */}
                <motion.div
                    className="flex justify-center gap-4 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                >
                    {['AI Dashboard', 'E-commerce', 'Social Media'].map((suggestion, index) => (
                        <motion.button
                            key={suggestion}
                            className="bg-gray-800/50 backdrop-blur-sm text-gray-300 px-4 py-2 rounded-full text-sm hover:bg-gray-700/50 transition-colors border border-gray-700"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: index * 0.5,
                                ease: "easeInOut"
                            }}
                        >
                            {suggestion}
                        </motion.button>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;