import { motion } from 'framer-motion';
import { Crown, User } from 'lucide-react';
import UserProfileDropdown from './UserDropdown';
import { useState } from 'react';

const Appbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.header 
      className="fixed top-0 right-0 left-0 bg-black/80 backdrop-blur-lg border-b border-gray-800 z-20"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="text-white font-semibold">WebcraftAI</span>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          {/* Profile */}
          <motion.button
            className="p-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (localStorage.getItem("token")){
                setIsProfileOpen(true);
              } else {
                window.location.href = "/signin"; 
              }
            }}
          >
            {localStorage.getItem("token") ? <div className='flex items-center'>
              <User size={20} className='mr-1'/>
              My Account
            </div> : 
              <div>
                SignIn
              </div>
            }
            
          </motion.button>

          <UserProfileDropdown 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
          />
          
          {/* Upgrade Button */}
          <motion.button
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Crown size={14} />
            Upgrade
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
export default Appbar;