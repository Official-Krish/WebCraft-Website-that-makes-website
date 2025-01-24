import { useState } from "react";
import { useNavigate } from "react-router-dom";
import website from '../assets/website.png';
import Export from '../assets/Export.png';

export const Prompt2 = () => {
    const [prompt, setPrompt] = useState("");
    const navigate = useNavigate();

    const steps = [
        { id: 1, title: "Type Your Prompt", description: "Describe your website in natural language", bgColor: "bg-blue-600" },
        { id: 2, title: "AI Generation", description: "Our AI creates your custom website design", bgColor: "bg-purple-600" },
        { id: 3, title: "Instant Preview", description: "See your website come to life instantly", bgColor: "bg-green-600" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
          navigate('/builder', { state: { prompt } });
        }
    };

    return (
        <div className="bg-brown3">
            <div className="min-h-screen bg-brown3 flex flex-col text-center px-4 relative">
                <div className="mt-24">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Build Stunning Websites with AI
                    </h1>
                    <div className="flex flex-col justify-center items-center mt-4">
                        <p className="text-gray-400 text-lg">
                            Transform your ideas into beautiful websites instantly. Just describe what you want, and our AI will create it for you.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center items-center mt-8">
                        <div className="mt-8 flex items-center bg-gray-800 p-4 rounded-lg shadow-lg max-w-xl w-full">
                            <input
                                type="text"
                                placeholder="Describe your website idea... (e.g., 'Create a modern website for a coffee shop with a dark theme')"
                                className="flex-grow bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <button
                                className="ml-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-2 rounded-lg font-medium flex items-center"
                                onClick={handleSubmit}
                            >
                                Generate
                                <span className="ml-2">→</span>
                            </button>
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
                                    <div className="bg-brown text-white rounded-xl p-4">
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
                                <div className="flex w-full bg-brown3 p-4 rounded-lg shadow-lg">
                                    <input
                                        type="text"
                                        placeholder="Describe your website idea... (e.g., 'Create a modern website for a coffee shop with a dark theme')"
                                        className="flex-grow bg-brown2 text-gray-300 placeholder-gray-500 focus:outline-none rounded-lg p-3"
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                    <button
                                        className="ml-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-0.5 rounded-lg font-medium flex items-center"
                                        onClick={handleSubmit}
                                    >
                                        Generate
                                        <span className="ml-2">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    );
};
