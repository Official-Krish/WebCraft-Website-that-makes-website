import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, MonitorSmartphone } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Toolbar } from './Toolbar';
import { TbLayoutSidebar, TbLayoutSidebarFilled } from "react-icons/tb";

type ViewMode = 'editor' | 'preview';

export const EditorPanel = ({ sessionUrl, previewUrl, setHideChat, hidechat }: { sessionUrl: string, previewUrl: string, hidechat: boolean, setHideChat: (arg0: boolean) => void }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-black rounded-r-lg overflow-hidden shadow-glow w-full"
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-black p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setHideChat(!hidechat)}
            className={cn(
              "relative px-2 py-1 transition-all duration-200 hover:bg-[#2f2f2f]",
            )}
          > 
            {!hidechat && <TbLayoutSidebarFilled />}
            {hidechat && <TbLayoutSidebar />}
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setViewMode('editor')}
            className={cn(
              "relative px-4 py-2 transition-all duration-200",
              viewMode === 'editor' && "bg-white text-black",
              viewMode != "editor" && " text-white"
            )}
          >
            <Code size={16} className="mr-2" />
            Editor
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setViewMode('preview')}
            className={cn(
              "relative px-4 py-2 transition-all duration-200",
              viewMode === 'preview' && "bg-white text-black",
              viewMode != "preview" && " text-white"
            )}
          >
            <MonitorSmartphone size={16} className="mr-2" />
            Preview
          </Button>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {viewMode === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full p-4"
            >
              <iframe 
                src={sessionUrl} 
                className="w-full h-full border-0 rounded"
                style={{ 
                  minWidth: hidechat ? '100%' : '980px',
                  minHeight: '624px'
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <Toolbar externalLinkUrl={previewUrl} setFullScreen={setFullScreen} fullScreen={fullScreen}/>
              <div className="min-h-0 flex items-center justify-center p-4">
                <iframe
                  src={previewUrl}
                  className="shadow-xl rounded border w-full h-full"
                  style={{ 
                    minWidth: hidechat ? '100%' : '994px',
                    minHeight: '624px',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Fullscreen Overlay */}
        <AnimatePresence>
          {fullScreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col mt-5"
              style={{ top: '48px' }}
            >
              {/* Animated backdrop */}
              <motion.div 
                className="absolute inset-0 backdrop-blur-md"
                initial={{ backdropFilter: "blur(0px)" }}
                animate={{ backdropFilter: "blur(8px)" }}
                exit={{ backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.3 }}
              />

              {/* Toolbar */}
              <motion.div 
                className="relative z-50"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Toolbar externalLinkUrl={previewUrl} setFullScreen={setFullScreen} fullScreen={fullScreen}/>
              </motion.div>

              <motion.div 
                className="relative z-40 flex-1 flex items-center justify-center p-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              >
                <iframe
                  src={previewUrl}
                  className="shadow-2xl rounded-lg border border-gray-600"
                  style={{ 
                    width: '95vw', 
                    height: 'calc(85vh - 48px)',
                    maxWidth: '1920px',
                    maxHeight: '1080px'
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};