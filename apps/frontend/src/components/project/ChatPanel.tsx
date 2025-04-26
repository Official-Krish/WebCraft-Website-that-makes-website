import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, SendHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { WORKER_URL } from '../../config';
import { usePrompts } from '../../hooks/usePrompts';
import Cookies from 'js-cookie';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}


export const ChatPanel = ({projectId}: { projectId: string }) => {
  const [input, setInput] = useState('');
  const prompts = usePrompts(projectId);

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100vh-105px)] bg-panel rounded-l-lg overflow-hidden"
    >
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ scrollbarWidth: 'thin' }}>
        {prompts.filter((prompt) => prompt.type === "USER").map((prompt) => (
          <div key={prompt.id}>
            <span key={prompt.id} className="flex text-lg gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center ml-3">
                <MessageSquare size={16} className="text-white" />
              </div>
              {prompt.content}
            </span>
            {prompt.actions.map((action) => (
              <div key={action.id} className="flex border-2 bg-gray-500/10 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="inline-block rounded-full border dark:border-gray-300/20 p-1 h-fit">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 bg-teal-300 dark:bg-teal-300/30" />
                  </div>
                  <p>{action.content}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            
          }}
          className="flex items-center space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className={cn(
              "flex-1 bg-panel-lighter",
              "focus-within:ring-1 focus-within:ring-primary/50"
            )}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={input.trim() === ''}
            onClick={ async () => {
              await axios.post(`${WORKER_URL}/AI/chat`, {
                prompt: input,
                projectId: projectId
              }, {
                headers: {
                  Authorization: `${Cookies.get("token")}`,
                },
              });
              setInput('');
            }}
          >
            <SendHorizontal size={18} />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};