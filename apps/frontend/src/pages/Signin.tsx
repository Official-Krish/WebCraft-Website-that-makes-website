import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Chrome, Github } from 'lucide-react';

export const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const reponse = await axios.post(`${BACKEND_URL}/user/login`, {
                email,
                password
            },{
                withCredentials: true
            })
            if (reponse.status === 200) {
                localStorage.setItem("token", `Bearer ${reponse.data.token}`);
                localStorage.setItem("name", reponse.data.name);
                navigate ('/');
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    return <div>
        <div className="min-h-screen flex">
            {/* Left Side - Content */}
            <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-8 relative overflow-hidden">
                <motion.div
                    className="text-center text-white relative z-10"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 max-w-md border border-white/10">
                        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
                        <p className="text-gray-300 mb-6">
                        Continue building amazing projects with our AI-powered development platform.
                        </p>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-sm text-gray-300">Access your projects</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-sm text-gray-300">Continue where you left off</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-sm text-gray-300">Collaborate with your team</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                    className="absolute top-20 right-20 w-4 h-4 bg-white/10 rounded-full"
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-32 left-32 w-6 h-6 bg-white/10 rounded-full"
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 bg-black flex items-center justify-center p-8">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Sign in to your account</h1>
                        <p className="text-gray-400">Welcome back! Please enter your details</p>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3 mb-6">
                        <motion.button
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-900 border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Chrome size={18} />
                            Continue with Google
                        </motion.button>
                        
                        <motion.button
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-900 border border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Github size={18} />
                            Continue with GitHub
                        </motion.button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center mb-6">
                        <div className="flex-1 border-t border-gray-800"></div>
                        <span className="px-4 text-sm text-gray-500">OR</span>
                        <div className="flex-1 border-t border-gray-800"></div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors pr-12"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-gray-600 bg-gray-900 border-gray-700 rounded focus:ring-gray-500 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-400">Remember me</span>
                            </label>
                            <Link to="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                        >
                            {isLoading ? (
                                <motion.div
                                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mx-auto"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            ) : (
                                'Sign in'
                            )}
                        </motion.button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-white hover:text-gray-300 font-medium transition-colors underline">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
}