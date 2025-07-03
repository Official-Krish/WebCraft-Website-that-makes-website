import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar,
  Settings,
  HelpCircle,
  MessageCircle,
  Crown,
  ChevronDown,
  Menu,
  ChevronUp,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Project } from '../types';
import { useNavigate } from 'react-router-dom';

const Sidebar= () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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

    const handleDeleteProject = async (projectId: string) => {
        try {
            await axios.delete(`${BACKEND_URL}/project/${projectId}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setProjects((prev) => prev.filter((project) => project.id !== projectId));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    return (
        <>
            {/* Hover trigger area */}
            <div 
                className="fixed left-0 top-0 w-4 h-full z-40"
                onMouseEnter={() => setIsHovered(true)}
            />
            
            {/* Sidebar */}
            <motion.div 
                className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 z-30 shadow-2xl mt-16"
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
                    {/* Navigation Sections */}
                    <nav className="space-y-6 flex-1">
                        {/* Today */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <ChevronDown 
                                    size={14} 
                                    className={`transform cursor-pointer ${isCollapsed ? 'rotate-180' : ''}`}
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                />
                                <Clock size={14} />
                                Today
                            </div>
                            <motion.div
                                className={`ml-6 space-y-1 ${isCollapsed ? 'hidden' : 'block'}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isCollapsed ? 0 : 1 }}
                                transition={{ duration: 0.2 }}
                            >
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
                                            className="text-sm text-gray-400 hover:text-white p-2 rounded cursor-pointer hover:bg-gray-900"
                                            whileHover={{ x: 4 }}
                                        >
                                            <div className='flex items-center justify-between'>
                                                <span onClick={() => navigate(`/project/${project.id}`)}>
                                                    {project.description}
                                                </span>
                                                <Trash2 
                                                    size={14} 
                                                    className="inline ml-2 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                                                    onClick={() => {
                                                        handleDeleteProject(project.id as string);
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </motion.div>
                        </div>

                        {/* Last 30 Days */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <ChevronUp 
                                    size={14} 
                                    className={`transform cursor-pointer ${isOpen ? 'rotate-180' : ''}`} 
                                    onClick={() => setIsOpen(!isOpen)}
                                />
                                <Calendar size={14} />
                                Last 30 Days
                            </div>

                            <motion.div 
                                className={`ml-6 space-y-1 ${isOpen ? 'block' : 'hidden'}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isOpen ? 1 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
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
                                            <div className='flex items-center justify-between'>
                                                <span onClick={() => navigate(`/project/${project.id}`)}>
                                                    {project.description}
                                                </span>
                                                <Trash2 
                                                    size={14} 
                                                    className="inline ml-2 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                                                    onClick={() => handleDeleteProject(project.id as string)}
                                                />
                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </motion.div>
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