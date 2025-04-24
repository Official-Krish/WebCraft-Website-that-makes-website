import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, MonitorSmartphone } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { useWebContainer } from '../../hooks/useWebContainer';
import { PreviewFrame } from '../PreviewFrame';
import { FileItem } from '../../types';


type ViewMode = 'editor' | 'preview';
export const EditorPanel = ({ files, IFRAME_URL }: { files: FileItem[], IFRAME_URL: string }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const webcontainer = useWebContainer();
  
  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(file.children.map((child) => [child.name, processFile(child, false)]))
              : {},
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || '',
              },
            };
          } else {
            return {
              file: {
                contents: file.content || '',
              },
            };
          }
        }
        return mountStructure[file.name];
      };

      files.forEach((file) => processFile(file, true));
      return mountStructure;
    };

    const mountStructure = createMountStructure(files);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-black rounded-r-lg overflow-hidden shadow-glow"
    >
      <div className="px-4 py-3 flex items-center justify-between ">
        <div className="flex items-center space-x-1 bg-black p-1 rounded-lg">
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
      
      <div className="flex-1 overflow-hidden">
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
              <iframe src={IFRAME_URL} width="980" height="624" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full p-4"
            >
                <PreviewFrame
                    webContainer={webcontainer!}
                    files={files}
                />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};