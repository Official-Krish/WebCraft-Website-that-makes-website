import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import UserProfileDropdown from './UserDropdown';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { User as user} from '../types';

const Appbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<user>();

  const isLoggedIn = localStorage.getItem("token");

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/user/getDetails`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                setUser(res.data);
            } catch (e) {
                console.error("Error Fetching User Details", e)
            }
        }
        isLoggedIn && getUserDetails();
        
    }, [])

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
            className="flex items-center gap-2 cursor-pointer" 
            whileHover={{ scale: 1.05 }}
            onClick={() => window.location.href = '/home'}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/90 rounded-md flex items-center justify-center">
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
              <img 
                src={user?.ImageUrl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} 
                alt="Profile" 
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-white font-semibold">{user?.name || "User"}</span>
            </div> : 
              <div>
                SignIn
              </div>
            }
            
          </motion.button>

          <UserProfileDropdown 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
              user={user}
          />
          
          {/* Upgrade Button */}
          <motion.button
            className="group neon-glow bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all"
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