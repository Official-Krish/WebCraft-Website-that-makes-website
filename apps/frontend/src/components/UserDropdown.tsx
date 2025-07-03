import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Crown } from 'lucide-react';
import { User as user} from '../types';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user?: user;
}


const UserProfileDropdown = ({ isOpen, onClose, user }: UserProfileDropdownProps) => {
    const dropdownVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
            visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { duration: 0.2, ease: "easeOut" }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95, 
            y: -10,
            transition: { duration: 0.15 }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
        onClose();
    };

    const isLoggedIn = localStorage.getItem("token");

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-30" 
                        onClick={onClose}
                    />
                    
                    {/* Dropdown */}
                    <motion.div
                        className="absolute right-0 top-full mt-2 w-64 bg-[#050505de] border border-gray-700 rounded-lg shadow-xl z-40"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {isLoggedIn ? (
                            <div className="p-4">
                                {/* User Info */}
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                                    <img 
                                        src={user?.ImageUrl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} 
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="text-white font-medium">{user?.name}</div>
                                        <div className="text-gray-400 text-sm">{user?.email}</div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="space-y-1">
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
                                    <User size={16} />
                                    Profile
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
                                    <Settings size={16} />
                                    Settings
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
                                    <Crown size={16} />
                                    Upgrade to Pro
                                </button>
                                <hr className="border-gray-700 my-2" />
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-md transition-colors"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                                </div>
                            </div>
                            ) : (
                            <div className="p-4">
                                <div className="text-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User size={24} className="text-white" />
                                </div>
                                <h3 className="text-white font-medium mb-2">Welcome to WebcraftAI</h3>
                                <p className="text-gray-400 text-sm">Sign in to access your projects and settings</p>
                                </div>
                                
                                <div className="space-y-2">
                                <button 
                                    onClick={() => window.location.href = "/signin"}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    Sign In
                                </button>
                                <button 
                                    onClick={() => window.location.href = "/signup"}
                                    className="w-full border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-4 py-2 rounded-lg transition-all"
                                >
                                    Create Account
                                </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserProfileDropdown;