// import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { StepsList } from '../components/StepsList';
// import { FileExplorer } from '../components/FileExplorer';
// import { TabView } from '../components/TabView';
// import { CodeEditor } from '../components/CodeEditor';
// import { PreviewFrame } from '../components/PreviewFrame';
// import { Step, FileItem, StepType } from '../types';
// import axios from 'axios';
// import { BACKEND_URL } from '../config';
// import { parseXml, parseXml2 } from '../lib/steps';
// import { useWebContainer } from '../hooks/useWebContainer';
// import { Loader2 } from 'lucide-react';
// import { Chatbox } from '../components/chatbox';

// export function Builder() {
//   const location = useLocation();
//   const { prompt } = location.state as { prompt: string };
//   const [userPrompt, setPrompt] = useState("");
//   const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [templateSet, setTemplateSet] = useState(false);
//   const webcontainer = useWebContainer();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
//   const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
//   const [steps, setSteps] = useState<Step[]>([]);

//   const [files, setFiles] = useState<FileItem[]>([]);
//   const [selectedComponent, setSelectedComponent] = useState<string | null>(null);


//   useEffect(() => {
//     let originalFiles = [...files];
//     let updateHappened = false;
//     steps.filter(({status}) => status === "pending").map(step => {
//       updateHappened = true;
//       if (step?.type === StepType.CreateFile) {
//         let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
//         let currentFileStructure = [...originalFiles]; // {}
//         let finalAnswerRef = currentFileStructure;
  
//         let currentFolder = ""
//         while(parsedPath.length) {
//           currentFolder =  `${currentFolder}/${parsedPath[0]}`;
//           let currentFolderName = parsedPath[0];
//           parsedPath = parsedPath.slice(1);
  
//           if (!parsedPath.length) {
//             // final file
//             let file = currentFileStructure.find(x => x.path === currentFolder)
//             if (!file) {
//               currentFileStructure.push({
//                 name: currentFolderName,
//                 type: 'file',
//                 path: currentFolder,
//                 content: step.code
//               })
//             } else {
//               file.content = step.code;
//             }
//           } else {
//             /// in a folder
//             let folder = currentFileStructure.find(x => x.path === currentFolder)
//             if (!folder) {
//               // create the folder
//               currentFileStructure.push({
//                 name: currentFolderName,
//                 type: 'folder',
//                 path: currentFolder,
//                 children: []
//               })
//             }
  
//             currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
//           }
//         }
//         originalFiles = finalAnswerRef;
//       }

//     })

//     if (updateHappened) {

//       setFiles(originalFiles)
//       setSteps(steps => steps.map((s: Step) => {
//         return {
//           ...s,
//           status: "completed"
//         }
        
//       }))
//     }
//   }, [steps, files]);

//   useEffect(() => {
//     const createMountStructure = (files: FileItem[]): Record<string, any> => {
//       const mountStructure: Record<string, any> = {};
  
//       const processFile = (file: FileItem, isRootFolder: boolean) => {  
//         if (file.type === 'folder') {
//           // For folders, create a directory entry
//           mountStructure[file.name] = {
//             directory: file.children ? 
//               Object.fromEntries(
//                 file.children.map(child => [child.name, processFile(child, false)])
//               ) 
//               : {}
//           };
//         } else if (file.type === 'file') {
//           if (isRootFolder) {
//             mountStructure[file.name] = {
//               file: {
//                 contents: file.content || ''
//               }
//             };
//           } else {
//             // For files, create a file entry with contents
//             return {
//               file: {
//                 contents: file.content || ''
//               }
//             };
//           }
//         }
  
//         return mountStructure[file.name];
//       };
  
//       // Process each top-level file/folder
//       files.forEach(file => processFile(file, true));
  
//       return mountStructure;
//     };
  
//     const mountStructure = createMountStructure(files);
  
//     webcontainer?.mount(mountStructure);
//   }, [files, webcontainer]);

//   async function init() {
//     const response = await axios.post(`${BACKEND_URL}/ai/template`, {
//       prompt: prompt.trim()
//     });
//     setTemplateSet(true);
    
//     const {prompts, uiPrompts} = response.data;

//     setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
//       ...x,
//       status: "pending"
//     })));

//     setLoading(true);
//     const stepsResponse = await axios.post(`${BACKEND_URL}/ai/chat`, {
//       prompt: [...prompts, prompt].map(content => ({
//         content
//       }))
//     })

//     setLoading(false);
//     setSteps(s => [...s, ...parseXml2(stepsResponse.data.message).map(x => ({
//       ...x,
//       status: "pending" as "pending"
//     }))]);

//     setLlmMessages([...prompts, prompt].map(content => ({
//       role: "user",
//       content
//     })));

//     setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data}])
//   }

//   useEffect(() => {
//     init();
//   }, [])


//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col">
//       <div className="flex-1 overflow-hidden">
//         <div className="h-full grid grid-cols-4 gap-6 p-6">
//           <div className="col-span-1 space-y-6 overflow-auto">
//             <div>
//               <div className="max-h-[75vh] overflow-scroll">
//                 <StepsList
//                   steps={steps}
//                   currentStep={currentStep}
//                   onStepClick={setCurrentStep}
//                 />
//               </div>
//               <div>
//                 <div className='flex'>
//                   <br />
//                   {(loading || !templateSet) && <Loader2 className='text-white animate-spin'/>}
//                   {!(loading || !templateSet) && <div className='flex'>
//                     <textarea value={userPrompt} onChange={(e) => {
//                     setPrompt(e.target.value)
//                   }} className='p-2 w-full'></textarea>
//                   <button onClick={async () => {
//                     const newMessage = {
//                       role: "user" as "user",
//                       content: userPrompt
//                     };

//                     setLoading(true);
//                     const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
//                       messages: [...llmMessages, newMessage]
//                     });
//                     setLoading(false);

//                     setLlmMessages(x => [...x, newMessage]);
//                     setLlmMessages(x => [...x, {
//                       role: "assistant",
//                       content: stepsResponse.data.response
//                     }]);
                    
//                     setSteps(s => [...s, ...parseXml2(stepsResponse.data.message).map(x => ({
//                       ...x,
//                       status: "pending" as "pending"
//                     }))]);

//                   }} className='bg-purple-400 px-4'>Send</button>
//                   </div>}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-span-1">
//               <FileExplorer 
//                 files={files} 
//                 onFileSelect={setSelectedFile}
//               />
//             </div>
//           <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
//             <TabView activeTab={activeTab} onTabChange={setActiveTab} />
//             <div className="h-[calc(100%-4rem)]">
//               {activeTab === 'code' ? (
//                 <CodeEditor file={selectedFile} />
//               ) : (
//                 <PreviewFrame webContainer={webcontainer!} files={files} onComponentSelect={setSelectedComponent}/>
//               )}
//             </div>
//             {selectedComponent && (
//             <Chatbox
//               componentName={selectedComponent}
//               onClose={() => setSelectedComponent(null)}
//               onApplyChanges={(updatedCode) => {
//                 setFiles((prevFiles) =>
//                   prevFiles.map((file) =>
//                     file.name === selectedComponent ? { ...file, content: updatedCode } : file
//                   )
//                 );
//               }}
//             />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml, parseXml2 } from '../lib/steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader2 } from 'lucide-react';
import { Chatbox } from "../components/chatbox";
import { testing } from '../components/lib/constants';

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  // Handle file updates when steps change
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;

    steps
      .filter(({ status }) => status === "pending")
      .forEach((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          const parsedPath = step.path?.split("/") ?? [];
          let currentFileStructure = [...originalFiles];
          let finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            const currentFolderName = parsedPath[0];
            parsedPath.shift();

            if (!parsedPath.length) {
              // Final file
              const file = currentFileStructure.find((x) => x.path === currentFolder);
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: 'file',
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              // In a folder
              const folder = currentFileStructure.find((x) => x.path === currentFolder);
              if (!folder) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: 'folder',
                  path: currentFolder,
                  children: [],
                });
              }
              currentFileStructure = currentFileStructure.find((x) => x.path === currentFolder)!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s) => ({
          ...s,
          status: "completed",
        }))
      );
    }
  }, [steps, files]);

  // Mount files to WebContainer
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

  // Initialize the builder
  async function init() {
    const response = await axios.post(`${BACKEND_URL}/ai/template`, {
      prompt: prompt.trim(),
    });
    setTemplateSet(true);

    const { prompts, uiPrompts } = response.data;

    setSteps(
      parseXml(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending",
      }))
    );

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/ai/chat`, {
      prompt: [...prompts, prompt].map((content) => ({
        content,
      })),
    });

    setLoading(false);
    setSteps((s) => [
      ...s,
      ...parseXml(testing).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);

    setLlmMessages(
      [...prompts, prompt].map((content) => ({
        role: "user",
        content,
      }))
    );

    setLlmMessages((x) => [
      ...x,
      { role: "assistant", content: testing },
    ]);
  }

  useEffect(() => {
    init();
  }, []);

  // Handle component-specific editing
  const handleApplyChanges = async (componentName: string, updatedCode: string) => {
    // Update the file in the WebContainer
    const filePath = `/src/components/${componentName}.jsx`; // Adjust the path as needed
    await webcontainer?.fs.writeFile(filePath, updatedCode);

    // Reload the iframe
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = iframe.src; // Reload the iframe
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div>
              <div className="max-h-[75vh] overflow-scroll">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              <div>
                <div className="flex">
                  <br />
                  {(loading || !templateSet) && <Loader2 className="text-white animate-spin" />}
                  {!(loading || !templateSet) && (
                    <div className="flex">
                      <textarea
                        value={userPrompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="p-2 w-full"
                      />
                      <button
                        onClick={async () => {
                          const newMessage = {
                            role: "user" as "user",
                            content: userPrompt,
                          };

                          setLoading(true);
                          const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                            messages: [...llmMessages, newMessage],
                          });
                          setLoading(false);

                          setLlmMessages((x) => [...x, newMessage]);
                          setLlmMessages((x) => [
                            ...x,
                            { role: "assistant", content: stepsResponse.data.response },
                          ]);

                          setSteps((s) => [
                            ...s,
                            ...parseXml2(stepsResponse.data.message).map((x) => ({
                              ...x,
                              status: "pending" as "pending",
                            })),
                          ]);
                        }}
                        className="bg-purple-400 px-4"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <FileExplorer files={files} onFileSelect={setSelectedFile} />
          </div>
          <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <PreviewFrame
                  webContainer={webcontainer!}
                  files={files}
                  onComponentHover={setHoveredComponent}
                />
              )}
            </div>
            {hoveredComponent && (
              <Chatbox
                componentName={hoveredComponent}
                onClose={() => setHoveredComponent(null)}
                onApplyChanges={(updatedCode) => {
                  handleApplyChanges(hoveredComponent, updatedCode);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}