import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const gradientText = "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text";
const glowEffect = "hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-shadow duration-300";

export function AppBar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: "Templates", path: "/templates" },
    { title: "Pricing", path: "/pricing" },
    { title: "About", path: "/about" },
    { title: "Signin", path: "/signin" },
    { title: "Signup", path: "/signup" },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-b from-gray-900/70 to-transparent border-b border-cyan-900/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/90 via-blue-900/90 to-indigo-900/70 opacity-90" />
      <nav className="container mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between">
          <motion.div 
            className="text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className={`${gradientText} text-3xl`}>Pixlr</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            {menuItems.map((item) => (
              <motion.button
                key={item.title}
                className="relative text-gray-300 hover:text-white transition-colors text-lg group overflow-hidden"
                whileHover={{ scale: 1.1 }}
                onClick={() => (item.path)}
              >
                {item.title}
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
                />
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={`px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium ${glowEffect}`}
              onClick={() => ('/create')}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-gray-300 p-2"
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden pt-6 pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-6 bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-lg rounded-lg p-6 border border-cyan-900/30">
              {menuItems.map((item) => (
                <motion.button
                  key={item.title}
                  className="text-gray-300 hover:text-white transition-colors text-left text-lg font-medium"
                  whileHover={{ x: 10 }}
                  onClick={() => {
                    (item.path);
                    setIsOpen(false);
                  }}
                >
                  {item.title}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium ${glowEffect}`}
                onClick={() => {
                  ('/create');
                  setIsOpen(false);
                }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}