import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ResizableLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth: number; // Percentage (0-100)
  minLeftWidth?: number; // Percentage (0-100)
  maxLeftWidth?: number; // Percentage (0-100)
}

export const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  leftPanel,
  rightPanel,
  defaultLeftWidth ,
  minLeftWidth,
  maxLeftWidth,
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Calculate new width as percentage
      const newLeftWidth = ((e.clientX - containerRect.left) / containerWidth) * 100;
      
      // Apply constraints
      const clampedWidth = Math.max(
        minLeftWidth!,
        Math.min(maxLeftWidth!, newLeftWidth)
      );

      setLeftWidth(clampedWidth);
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minLeftWidth, maxLeftWidth]);
  
  const handleDragStart = () => {
    isDragging.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div 
      ref={containerRef}
      className="flex h-screen overflow-hidden relative"
    >
      {/* Left Panel */}
      <div 
        className="h-screen overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>
      
      {/* Resizer */}
      <motion.div
        className={cn(
          "absolute top-0 bottom-0 w-1 bg-border cursor-ew-resize z-30",
          "hover:bg-primary hover:w-1"
        )}
        style={{ left: `${leftWidth}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleDragStart}
        whileHover={{ scale: 1.5 }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Right Panel */}
      <div 
        className="h-full overflow-hidden"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
};