import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { MessageSquare, Bot } from 'lucide-react';

export interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className="flex items-start max-w-[80%]">
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
            <Bot size={18} className="text-white" />
          </div>
        )}
        
        <div className={cn(
          'flex flex-col rounded-xl px-4 py-3',
          isUser 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-secondary text-secondary-foreground rounded-tl-none'
        )}>
          <div className="text-sm">{message}</div>
          <div className="text-[10px] mt-1 opacity-70 self-end">
            {timestamp}
          </div>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center ml-3">
            <MessageSquare size={16} className="text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
};