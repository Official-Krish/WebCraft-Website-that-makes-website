import { useState } from 'react';
import { motion } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';
import { ChatMessage } from './chatMessage';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { WORKER_URL } from '../../config';
import { llmMessagesAtom, stepsAtom } from '../../store/response';
import { useRecoilState } from 'recoil';
import { parseXml2 } from '../../lib/steps';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! How can I help with your web development today?',
    isUser: false,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [llmMessages, setLlmMessages] = useRecoilState(llmMessagesAtom);
  const [steps, setSteps] = useRecoilState(stepsAtom);
  
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const newMessage = {
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botMessage1: Message = {
      id: (Date.now() + 1).toString(),
      text: "I'm working on your request. Let me generate some code for you.",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, botMessage1]);

    setLoading(true);
    console.log("Sending message to AI:", newMessage);
    const stepsResponse = await axios.post(`${WORKER_URL}/AI/chat`, {
      prompt: [...llmMessages, newMessage],
    }, {
      withCredentials: true,
    });
    setLoading(false);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "Code Generated Successfully",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, botMessage]);

    setLlmMessages((x) => [...x, { content: userMessage.text }]);
    setLlmMessages((x) => [
      ...x,
      { content: stepsResponse.data.response },
    ]);

    setSteps((s) => [
      ...s,
      ...parseXml2(stepsResponse.data.message).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);
  };

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100vh-105px)] bg-panel rounded-l-lg overflow-hidden"
    >
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
      </div>
      
      <div>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
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
            disabled={input.trim() === '' || loading}
          >
            <SendHorizontal size={18} />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};