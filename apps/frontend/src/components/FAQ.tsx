import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const questions = [
    "What is Webcraft?",
    "How does Webcraft work?",
    "Do I need coding skills to use Webcraft?",
    "How fast can I create a website with Webcraft?",
  ];

  const answers = [
    "Webcraft is a platform that simplifies web design using AI.",
    "Webcraft works by leveraging AI to generate customized website designs based on user preferences.",
    "No, you don't need coding skills. Webcraft is designed to be user-friendly for everyone.",
    "With Webcraft, you can create a website in minutes, depending on your requirements.",
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 45 }
  };

  return (
    <div className="w-full space-y-4">
      {questions.map((question, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
          className="bg-brown2 rounded-lg overflow-hidden shadow-lg"
        >
          <button
            className="w-full text-left px-4 py-3 text-white flex justify-between items-center"
            onClick={() => toggleAccordion(index)}
          >
            <span>{question}</span>
            <motion.span
              variants={iconVariants}
              animate={activeIndex === index ? "open" : "closed"}
              transition={{ duration: 0.2 }}
            >
              {activeIndex === index ? "+" : "+"}
            </motion.span>
          </button>
          <AnimatePresence>
            {activeIndex === index && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="px-4 py-3 bg-brown4 text-gray-300"
              >
                {answers[index]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};