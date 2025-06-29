import React, { useRef } from 'react';

interface ProjectLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({
  leftPanel,
  rightPanel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="flex relative mt-5"
    >
      {/* Left Panel */}
      <div 
        className="h-[730px] overflow-hidden"
        style={{ width: 400 }}
      >
        {leftPanel}
      </div>
      
      
      {/* Right Panel */}
      <div 
        className="h-full overflow-hidden"
        style={{ width: 1000 }}
      >
        {rightPanel}
      </div>
    </div>
  );
};