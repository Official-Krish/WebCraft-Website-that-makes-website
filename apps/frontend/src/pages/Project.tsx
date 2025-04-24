import { useEffect, useState } from "react"
import GridBackground from "../components/BackgroundGrid"
import { ChatPanel } from "../components/project/ChatPanel"
import { EditorPanel } from "../components/project/EditorPanel"
import { ResizableLayout } from "../components/project/resizableComponent"
import { Step, StepType } from "../types"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL, WORKER_ORCHASTRATOR_URL, WORKER_URL } from "../config"
import { parseXml, parseXml2 } from "../lib/steps"
import { useRecoilState } from "recoil"
import { filesAtom, llmMessagesAtom, stepsAtom } from "../store/response"
import Cookies from "js-cookie"

export const Project = () => {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [files, setFiles] = useRecoilState(filesAtom);
  const [llmMessages, setLlmMessages] = useRecoilState(llmMessagesAtom);
  const [steps, setSteps] = useRecoilState(stepsAtom);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);


  useEffect(() => {
    const updateFiles = (currentFiles: any[], pathParts: string[], code: string): any[] => {
      if (pathParts.length === 1) {
        // Handle file creation/modification
        const fileName = pathParts[0];
        const existingFileIndex = currentFiles.findIndex(x => x.name === fileName);
        
        if (existingFileIndex === -1) {
          return [
            ...currentFiles,
            {
              name: fileName,
              type: 'file',
              path: `/${fileName}`,
              content: code,
            }
          ];
        } else {
          return currentFiles.map((file, index) => 
            index === existingFileIndex 
              ? { ...file, content: code }
              : file
          );
        }
      } else {
        // Handle nested folder structure
        const [currentPart, ...remainingParts] = pathParts;
        const folderIndex = currentFiles.findIndex(x => x.name === currentPart);
        
        if (folderIndex === -1) {
          return [
            ...currentFiles,
            {
              name: currentPart,
              type: 'folder',
              path: `/${pathParts.join('/')}`,
              children: updateFiles([], remainingParts, code)
            }
          ];
        } else {
          return currentFiles.map((item, index) => 
            index === folderIndex
              ? {
                  ...item,
                  children: updateFiles(item.children || [], remainingParts, code)
                }
              : item
          );
        }
      }
    };
  
    let updateHappened = false;
    let updatedFiles = [...files];
  
    steps
      .filter(({ status }) => status === "pending")
      .forEach((step) => {
        if (step?.type === StepType.CreateFile) {
          updateHappened = true;
          const pathParts = step.path?.split("/").filter(Boolean) ?? [];
          updatedFiles = updateFiles(updatedFiles, pathParts, step?.code!);
        }
      });
  
    if (updateHappened) {
      setFiles(updatedFiles);
      setSteps(steps => steps.map(s => ({
        ...s,
        status: "completed",
      })));
    }
  }, [steps, files, setFiles, setSteps]);


  // Initialize the builder
  async function init() {
    const response = await axios.post(`${BACKEND_URL}/ai/template`, {
      prompt: prompt.trim(),
    },{
      withCredentials: true,
      headers: {
        Authorization: `${Cookies.get("token")}`,
      }
    });

    const { prompts, uiPrompts } = response.data;

    setSteps(
      parseXml(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending",
      }))
    );

    async () => {
      const response = await axios.get(`${WORKER_ORCHASTRATOR_URL}/1234`,{
          headers: {
            Authorization: `${Cookies.get("token")}`,
          }
        }
      );
      setIframeUrl(response.data.ip);
    };

    const stepsResponse = await axios.post(`${WORKER_URL}/AI/chat`,
    {
      prompt: prompt
    }, {
      headers: {
        Authorization: `${Cookies.get("token")}`,
      }
    });

    setSteps((s) => [
      ...s,
      ...parseXml2(stepsResponse.data.message).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);

    const newLLM = [...prompts, prompt].map((content) => ({
      content,
    }));
    setLlmMessages(newLLM);

    setLlmMessages((x) => [
      ...x,
      { content: stepsResponse.data.message },
    ]);
  }

  useEffect(() => {
    init();
  }, []);
    return (
        <div className="h-full w-full">
            <GridBackground>
                <div className="px-4 py-3 w-full h-full">
                  <ResizableLayout
                    leftPanel={<ChatPanel />}
                    rightPanel={<EditorPanel files={files} IFRAME_URL={iframeUrl!}/>}
                    defaultLeftWidth={30}
                    minLeftWidth={20}
                    maxLeftWidth={30}
                  />
                </div>
            </GridBackground>
        </div>
    )
}