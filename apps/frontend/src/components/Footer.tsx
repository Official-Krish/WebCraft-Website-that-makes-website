import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";

const gradientText = "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text";
const iconHoverEffect = "hover:text-cyan-400 transition-colors duration-300";

export const Footer = () => {
  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Templates", "Pricing", "Enterprise"]
    },
    {
      title: "Resources",
      links: ["Documentation", "Guides", "Tutorial", "Blog"]
    },
    {
      title: "Company",
      links: ["About", "Careers", "Contact", "Partners"]
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Security", "Cookies"]
    }
  ];

  return (
    <footer className="bg-black border-t border-cyan-900/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className={`text-lg font-semibold mb-4 ${gradientText}`}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <motion.li 
                    key={link}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <button className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cyan-900/30 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div 
              className="text-xl font-bold"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className={gradientText}>Pixlr</span>
            </motion.div>

            <div className="flex space-x-6">
              <motion.a
                href="#"
                className={iconHoverEffect}
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Github className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="#"
                className={iconHoverEffect}
                whileHover={{ scale: 1.2, rotate: -10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Twitter className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="#"
                className={iconHoverEffect}
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Linkedin className="h-6 w-6" />
              </motion.a>
            </div>

            <div className="text-gray-400 text-sm">
              © 2025 Pixlr. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}