import { useState } from "react";
import { useNavigate } from "react-router-dom";
import website from '../assets/website.png';
import Export from '../assets/Export.png';
import { ChooseTemplates, Examples, features, steps } from "./lib/constants";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Pricing } from "./Pricing";
import { FAQ } from "./FAQ";
import Cookies  from "js-cookie";

export const Prompt2 = () => {
    const [prompt, setPrompt] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!Cookies.get("token")){
            navigate('/signin');
            return;
        }
        if (prompt.trim()) {
          navigate('/project', { state: { prompt } });
        }
    };

    return (
        <div className="bg-brown3">
            <div className="min-h-screen bg-brown3 flex flex-col text-center px-4 relative">
                <div className="mt-24">
                    <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Build Stunning Websites with AI
                    </h1>
                    <div className="flex flex-col justify-center items-center mt-4">
                        <p className="text-gray-400 text-lg max-w-xl">
                            Transform your ideas into beautiful websites instantly. Just describe what you want, and our AI will create it for you.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center items-center mt-8">
                        <div className="p-6 rounded-lg bg-brown2 max-w-[800px] w-full">
                            <motion.div className="flex items-center bg-brown4 p-6 rounded-lg shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <input
                                    type="text"
                                    placeholder="Describe your website idea... (e.g., 'Create a modern website for a coffee shop with a dark theme')"
                                    className="flex-grow bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <button
                                    className={`ml-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-2 rounded-lg font-medium flex items-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600`}
                                    onClick={handleSubmit}
                                >
                                    Generate
                                    <motion.span
                                        className="inline-block ml-2"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        <span className="ml-2">→</span>
                                    </motion.span>
                                    
                                </button>
                            </motion.div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center m-8">
                        <div className="mt-8 rounded-md p-4 max-w-3xl bg-brown">
                            <img src={website} className="mt-16 rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <a className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-2 rounded-full font-medium flex items-center">
                        Powered by Advanced AI
                    </a>
                </div>
            </div>
            <div className="bg-brown2 min-h-screen mt-6">
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-4">
                    <div className="flex col col-span-2">
                        <div>
                            <img src={Export} className="rounded-lg shadow-lg h-[580px] w-[580px]" />
                        </div>
                        <div className="px-10">
                            <div className="flex flex-col justify-center items-center px-5 max-w-xl">
                                <div className="text-4xl font-bold text-white">
                                    Generate Your Website with Simple Prompts
                                </div>
                            </div>
                            {steps.map((step) => (
                                <div className="py-4 px-5">
                                    <div className="bg-brown4 text-white rounded-xl p-4">
                                        <div key={step.id} className="space-y-2">
                                            <div className="flex items-center space-x-4">
                                                <div className={`flex items-center justify-center ${step.bgColor} w-8 h-8 rounded-full text-white font-bold`}>
                                                    {step.id}
                                                </div>
                                                <h2 className="text-md font-bold">{step.title}</h2>
                                            </div>
                                            <p className="text-gray-300 ml-12">{step.description}</p> 
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="py-4 px-5">
                                <motion.div className="flex w-full bg-brown3 p-4 rounded-lg shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Describe your website idea... (e.g., 'Create a modern website for a coffee shop with a dark theme')"
                                        className="flex-grow bg-brown2 text-gray-300 placeholder-gray-500 focus:outline-none rounded-lg p-3"
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                    <button
                                        className="ml-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-0.5 rounded-lg font-medium flex items-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
                                        onClick={handleSubmit}
                                    >
                                        Generate
                                        <motion.span
                                            className="inline-block ml-2"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <span className="ml-2">→</span>
                                        </motion.span>
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-[80vh]">
                <div className="flex flex-col items-center justify-center p-4 mt-20">
                    <p className="text-4xl font-bold text-white">
                        Powerful Features for Your Website
                    </p>
                    <div className="text-gray-400 text-md max-w-xl py-4">
                        Everything you need to create and customize your perfect website
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-brown2 p-7 rounded-xl shadow-lg transition delay-150 duration-300 ease-out hover:-translate-y-1 hover:scale-110"
                            >
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl rounded-lg">
                                    {typeof feature.icon === 'string' ? feature.icon : <feature.icon />}
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                                    <p className="text-gray-400 mt-2 max-w-[320px]">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-brown2 min-h-screen">
                <div className="flex flex-col items-center justify-center p-4">
                    <h1 className="text-4xl font-bold text-white mt-20">
                        Create your website in 3 simple steps
                    </h1>
                    <a className="text-gray-400 text-md max-w-xl py-4">
                        From idea to live website within just a few minutes
                    </a>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                        {ChooseTemplates.map((step, index) => (
                        <div
                            key={index}
                            className="bg-black2 p-6 rounded-xl shadow-lg flex flex-col transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                        >
                            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-bold mb-6">
                                {step.step}
                            </div>
                            <img src={step.image} className="mb-6 h-[200px]" />
                            <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                            <p className="text-gray-400 mt-4 max-w-[340px]">{step.description}</p>
                        </div>
                        ))}
                    </div>
                    <div className="text-center my-12">
                        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg shadow-lg hover:opacity-90 transition">
                            Start Creating Now
                            <motion.span
                                className="inline-block ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <span className="ml-2">→</span>
                            </motion.span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="min-h-screen">
                <div className="flex flex-col items-center justify-center p-4">
                    <h1 className="text-4xl font-bold text-white mt-20">
                        Website Examples
                    </h1>
                    <a className="text-gray-400 text-md max-w-xl py-4">
                        See what our AI can create with simple prompts
                    </a>
                    <div className="flex col cols-2 md:grid-cols-3 gap-8 py-8">
                        {Examples.map((example, index) => (
                            <div className="bg-brown2 p-6 rounded-xl shadow-lg w-full h-full">
                                <div
                                    key={index}
                                    className="flex flex-col items-center justify-center w-full h-full"
                                >
                                    <img src={example.image} className="mb-6 h-[300px]" />
                                </div>
                                <div className="p-4 bg-brown4 rounded-xl">
                                     <p className="text-gray-400 text-md">Prompt: "{example.Prompt}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="flex text-white py-3 px-6 rounded-lg shadow-lg hover:opacity-90 transition p-4 bg-brown2">
                        Load More Examples
                        <ChevronDown />
                    </button>
                </div>
            </div>

            <div className="bg-brown2 min-h-[90vh]">
                <div className="flex flex-col items-center justify-center p-4">
                    <h1 className="text-white text-4xl font-semibold mt-14">
                        Pricing that fits your vision
                    </h1>
                    <a className="text-gray-400 text-md font-medium max-w-xl py-4">
                        Unlock the power of AI-driven web design with plans tailored for everyone
                    </a>
                    <Pricing />
                </div>
            </div>
            
            <div className="bg-brown min-h-[70vh]">
                <div className="flex flex-col items-center justify-center p-4">
                    <h1 className="text-white text-4xl font-semibold mt-14">
                        Frequently Asked Questions
                    </h1>
                    <a className="text-gray-400 text-md font-medium max-w-xl py-4">
                        Answers to some of the Most Important Questions
                    </a>
                </div>
                <div className="mx-60 my-14">
                    <FAQ/>
                </div>
            </div>  
        </div>
    );
};
