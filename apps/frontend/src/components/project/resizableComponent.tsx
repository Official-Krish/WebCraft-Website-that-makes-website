import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectLayoutProps {
  leftPanel?: React.ReactNode;
  rightPanel: React.ReactNode;
  hideChat: boolean;
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({
  leftPanel,
  rightPanel,
  hideChat
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="flex relative mt-5"
    >
      {/* Left Panel */}
      <AnimatePresence>
        {!hideChat && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut",
              opacity: { duration: 0.2 }
            }}
            className="h-[730px] overflow-hidden"
          >
            {leftPanel}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Right Panel */}
      <motion.div 
        initial={false}
        animate={{ 
          width: hideChat ? '100%' : 1000,
          marginLeft: hideChat ? 0 : 0
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut" 
        }}
        className="h-full overflow-hidden"
      >
        {rightPanel}
      </motion.div>
    </div>
  );
};