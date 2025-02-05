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
import { MoveRight } from 'lucide-react';
import { Chatbox } from "../components/chatbox";
import { useNavigate } from "react-router-dom";
import Logo from '../assets/Logo.png';
import { TerminalComponent } from '../components/Terminal';

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{ content: string; }[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const [fileLoaded, setFilesLoaded] = useState(false);
  const webcontainer = useWebContainer();
  const navigate = useNavigate();

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
    }, {
      withCredentials: true,
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
      ...parseXml2(stepsResponse.data.message).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);

    setLlmMessages(
      [...prompts, prompt].map((content) => ({
        content,
      }))
    );

    setLlmMessages((x) => [
      ...x,
      { content: stepsResponse.data.message },
    ]);
    setFilesLoaded(true);
  }

  useEffect(() => {
    init();
  }, []);

  // Handle component-specific editing
  const handleApplyChanges = async (updatedCode: string) => {
    console.log("Updated Code:", updatedCode);
    setLlmMessages((x) => [
      ...x,
      { content: updatedCode },
    ]);

    setSteps((s) => [
      ...s,
      ...parseXml2(updatedCode).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);
    // Reload the iframe
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = iframe.src; // Reload the iframe
    }
  };

  return <div className='min-h-screen'>
    <div className="bg-brown3 flex justify-around items-center shadow-lg border-b-2 border-brown2">
        <div className="flex">
          <img src={Logo} className="h-8 w-auto rounded-full pr-2" />
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-3xl font-bold text-transparent bg-clip-text" onClick={() => navigate("/home")}
              >
              Pixlr
          </button>
        </div>
        <div className="flex justify-between text-gray-400 text-md font-medium space-x-10">
          {prompt.split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
          }
        </div>
        <div className='mt-4'>
          <TabView activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    </div>
    <div className="min-h-screen bg-brown3 min-w-screen">
      {activeTab === "preview" && 
        <PreviewFrame
        webContainer={webcontainer!}
        files={files}
        onComponentHover={setHoveredComponent}
        />
      }

      {activeTab === "preview" && hoveredComponent &&
        <Chatbox
          componentName={hoveredComponent}
          llmMessages={llmMessages}
          onClose={() => setHoveredComponent(null)}
          onApplyChanges={(updatedCode) => {
            handleApplyChanges(updatedCode);
          }}
        />
      }

      {activeTab === "code" &&
        <div className={`${fileLoaded ? "flex-1 overflow-hidden pl-8 ": ""}`}>
          <div className={`${fileLoaded ? "h-full grid grid-cols-4 gap-6 p-4" : ""}`}>
            <div className={`${fileLoaded ? "col-span-1 space-y-3 overflow-auto" : "flex justify-center items-center min-h-screen mt-[-10px]"}`}>
              <div>
                <div className="max-h-[70vh] overflow-scroll border border-brown4 rounded-lg">
                  <StepsList
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                    filesLoaded={fileLoaded}
                  />
                </div>
                <div>
                  <br />
                  {!(loading || !templateSet) && (
                    <div className="flex items-center bg-brown p-2 rounded-lg w-full max-w-lg border border-brown4 h-[120px]">
                      <input
                        value={userPrompt}
                        placeholder="How can Pixlr help you today?"
                        onChange={(e) => setPrompt(e.target.value)}
                        className="bg-transparent text-white placeholder-gray-400 flex-1 outline-none px-2 h-full overflow-y-scroll"
                      />
                      {userPrompt.length > 0 &&
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-lg"
                          onClick={async () => {
                            const newMessage = {
                              content: userPrompt,
                            };

                            setLoading(true);
                            const stepsResponse = await axios.post(`${BACKEND_URL}/ai/chat`, {
                              prompt: [...llmMessages, newMessage],
                            }, {
                              withCredentials: true,
                            });
                            setLoading(false);

                            setLlmMessages((x) => [...x, newMessage]);
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
                          }}
                        >
                          {<MoveRight className="w-4 h-4" />}
                        </button>
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
            {fileLoaded && 
              <div>
                <div className='flex ml-16'>
                  <div className='w-full min-w-[300px] h-[calc(100vh-15rem)] border border-brown4'>
                    <FileExplorer files={files} onFileSelect={setSelectedFile} />
                  </div>
                  <div className=" bg-brown2 p-4 min-w-[650px] h-[calc(100vh-15rem)] border border-brown4">
                    <CodeEditor file={selectedFile} />
                  </div>
                </div>
                <div className='ml-16'>
                  <TerminalComponent webcontainer={webcontainer!} />
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  </div>
}