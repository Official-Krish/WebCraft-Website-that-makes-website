import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Code, Loader2, MessageSquare, SendHorizontal, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import axios from 'axios';

import { BACKEND_URL } from '../../config';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}


interface Prompt {
  id: string;
  content: string;
  type: "USER"| "SYSTEM";
  createdAt: Date;
  actions: Action[]
}

interface Action {
  id: string;
  createdAt: Date;
  content: string;
}


export const ChatPanel = ({ projectId, workerUrl }: { projectId: string, workerUrl: string }) => {
  const [input, setInput] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [prompts]);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const res = await axios.get(`${BACKEND_URL}/project/${projectId}`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        setPrompts(res.data);
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      }
    }
    
    fetchPrompts();
    const interval = setInterval(fetchPrompts, 3000);
    return () => clearInterval(interval);
  }, [projectId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      await axios.post(`${workerUrl}/api/v1/AI/chat`, {
        prompt: userMessage,
        projectId: projectId
      }, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        },
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'completed':
        return <Code className="w-3 h-3" />;
      case 'error':
        return <div className="w-3 h-3 rounded-full bg-red-500" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-emerald-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border border-b">
      {/* Messages Area */}
      <div className="flex-1 relative overflow-y-scroll">
        {prompts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex items-center justify-center h-full"
          >
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-primary/60" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Ready to build</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Describe what you want to create and I'll help you build it step by step.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="text-xs">React</Badge>
                <Badge variant="outline" className="text-xs">TypeScript</Badge>
                <Badge variant="outline" className="text-xs">Tailwind</Badge>
              </div>
            </div>
          </motion.div>
        ) : (
          <ScrollArea className="" ref={scrollAreaRef}>
            <div className="p-4 space-y-6">
              <div className='h-[650px] overflow-y-auto'>
                <AnimatePresence mode="popLayout">
                  {prompts.filter(prompt => prompt.type === "USER").map((prompt, index) => (
                    <motion.div
                      key={prompt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-4"
                    >
                      {/* User Message */}
                      <div className="flex gap-3 pt-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">You</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(prompt.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-sm leading-relaxed">
                            {prompt.content}
                          </div>
                        </div>
                      </div>

                      {/* AI Response & Actions */}
                      {prompt.actions.length > 0 && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">WebcraftAI</span>
                              <Badge variant="secondary" className="text-xs">
                                {prompt.actions.length} action{prompt.actions.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {prompt.actions.map((action) => (
                                <motion.div
                                  key={action.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg hover:bg-muted/30 transition-colors"
                                >
                                  <div className="flex items-center justify-center mt-0.5">
                                    {getStatusIcon(action.content)}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm leading-relaxed">{action.content}</p>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(action.createdAt).toLocaleTimeString()}
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-1 p-3 bg-muted/30 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">WebcraftAI is thinking...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef as unknown as React.RefObject<HTMLTextAreaElement>}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (inputRef.current) {
                    inputRef.current.style.height = 'auto'; 
                    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Describe what you want to build..."
                rows={1}
                className={cn(
                  "min-h-[44px] max-h-60 w-full resize-none pr-12 bg-muted/50",
                  "border border-border/50",
                  "rounded-md px-3 py-2 text-sm font-normal leading-relaxed text-foreground"
                )}
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              size="icon"
              disabled={input.trim() === '' || isLoading}
              className="h-[44px] w-[44px] shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SendHorizontal className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <span>{input.length}/2000</span>
          </div>
        </form>
      </div>
    </div>
  );
};
