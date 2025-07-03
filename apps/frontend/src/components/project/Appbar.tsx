import { motion } from 'framer-motion';
import { Lock, Settings, Rocket } from 'lucide-react';
import { CiExport } from "react-icons/ci";


const AppBar = ({ title }: {title:  string}) => {
    return (
        <motion.div 
            className="bg-black border-b border-gray-800 z-50"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 0.95 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between px-6 py-2">
                {/* Left Section - Logo */}
                <div className="flex items-center gap-4">
                    <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="text-white font-bold text-xl italic">
                        WebcraftAI
                        </div>
                    </motion.div>
                </div>

                {/* Center Section - Project Info */}
                <div className="flex items-center gap-3 flex-1 justify-center">
                    <span className="text-white font-medium">{title}</span>
                    <motion.div
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                    >
                        <Lock size={16} />
                    </motion.div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-3">
                {/* Integrations */}
                    <motion.button
                        className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Settings size={16} />
                        <span className="text-sm">Integrations</span>
                    </motion.button>

                    {/* Export */}
                    <motion.button
                        className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CiExport size={16} />
                        <span className="text-sm">Export</span>
                    </motion.button>

                    {/* Deploy */}
                    <motion.button
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Rocket size={16} />
                        <span className="text-sm">Deploy</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default AppBar;