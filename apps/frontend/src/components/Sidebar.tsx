import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderPlus, 
  Clock, 
  Calendar,
  Star,
  Settings,
  HelpCircle,
  MessageCircle,
  Crown,
  ChevronDown,
  Menu
} from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Project } from '../types';

const Sidebar= () => {
    const [isHovered, setIsHovered] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);

    const sidebarVariants = {
        collapsed: { 
            x: -200,
            opacity: 0.3,
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        expanded: { 
            x: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeInOut" }
        }
    };

    const contentVariants = {
            collapsed: { 
            opacity: 0,
            transition: { duration: 0.2 }
        },
        expanded: { 
            opacity: 1,
            transition: { duration: 0.3, delay: 0.1 }
        }
    };

    useEffect(() => {
        const getProjects = async () => {
            try{
                const res = await axios.get(`${BACKEND_URL}/project/projects`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setProjects(res.data);
            } catch(e){
                console.log("Error Fetching data", e);
            }
        }
        getProjects();
    }, [])


    return (
        <>
            {/* Hover trigger area */}
            <div 
                className="fixed left-0 top-0 w-4 h-full z-40"
                onMouseEnter={() => setIsHovered(true)}
            />
            
            {/* Sidebar */}
            <motion.div 
                className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 z-30 shadow-2xl"
                variants={sidebarVariants}
                animate={isHovered ? "expanded" : "collapsed"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div 
                    className="p-4 h-full flex flex-col"
                    variants={contentVariants}
                    animate={isHovered ? "expanded" : "collapsed"}
                >
                {/* Logo */}
                    <motion.div 
                        className="flex items-center gap-2 mb-8"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="text-white font-semibold text-lg">same</span>
                    </motion.div>

                    {/* New Project Button */}
                    <motion.button
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center gap-2 mb-6 transition-colors border border-gray-800"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FolderPlus size={16} />
                        New Project
                    </motion.button>

                    {/* Navigation Sections */}
                    <nav className="space-y-6 flex-1">
                        {/* Today */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <ChevronDown size={14} />
                                <Clock size={14} />
                                Today
                            </div>
                            <div className="ml-6 space-y-1">
                                {projects
                                    .filter((project) => {
                                        const today = new Date();
                                        const projectDate = new Date(project.updatedAt);
                                        return (
                                            projectDate.getDate() === today.getDate() &&
                                            projectDate.getMonth() === today.getMonth() &&
                                            projectDate.getFullYear() === today.getFullYear()
                                        );
                                    })
                                    .map((project, index) => (
                                        <motion.div
                                            key={index}
                                            className={`text-sm p-2 rounded cursor-pointer ${
                                                'text-gray-400 hover:text-white hover:bg-gray-900'
                                            }`}
                                            whileHover={{ x: 4 }}
                                        >
                                            {project.description}
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Last 30 Days */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <ChevronDown size={14} />
                                <Calendar size={14} />
                                Last 30 Days
                            </div>
                            <div className="ml-6 space-y-1">
                                {projects
                                    .filter((project) => {
                                        const today = new Date();
                                        const projectDate = new Date(project.updatedAt);
                                        const thirtyDaysAgo = new Date();
                                        thirtyDaysAgo.setDate(today.getDate() - 30);
                                        return projectDate >= thirtyDaysAgo && projectDate <= today;
                                    })
                                    .map((project, index) => (
                                        <motion.div
                                            key={index}
                                            className="text-sm text-gray-400 hover:text-white p-2 rounded cursor-pointer hover:bg-gray-900"
                                            whileHover={{ x: 4 }}
                                        >
                                            {project.description}
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* All Projects */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <Star size={14} />
                                All projects
                            </div>
                            <div className="ml-6 space-y-1">
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={index}
                                        className="text-sm text-gray-400 hover:text-white p-2 rounded cursor-pointer hover:bg-gray-900"
                                        whileHover={{ x: 4 }}
                                    >
                                        {project.description}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </nav>

                    {/* Bottom Section */}
                    <div className="space-y-2 mt-auto">
                        <motion.button
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Crown size={16} className="inline mr-2" />
                            Upgrade Tier
                        </motion.button>
                        
                        <div className="text-gray-400 text-xs">
                            Feedback? DM us!
                        </div>
                        
                        <div className="flex gap-2">
                            <MessageCircle size={16} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <HelpCircle size={16} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Settings size={16} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Collapsed sidebar indicator */}
            <motion.div
                className="fixed left-2 top-1/2 transform -translate-y-1/2 z-20 bg-gray-900 p-2 rounded-full border border-gray-800"
                animate={{
                    opacity: isHovered ? 0 : 1,
                    scale: isHovered ? 0.8 : 1
                }}
                transition={{ duration: 0.2 }}
            >
                <Menu size={16} className="text-gray-400" />
            </motion.div>
        </>
    );
};

export default Sidebar;