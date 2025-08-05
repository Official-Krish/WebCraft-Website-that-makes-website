import { useEffect, useState } from "react"
import GridBackground from "../components/BackgroundGrid"
import { ChatPanel } from "../components/project/ChatPanel"
import { EditorPanel } from "../components/project/EditorPanel"
import { ProjectLayout } from "../components/project/resizableComponent"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { K8S_ORCHASTRATOR_URL } from "../config"
import { useParams, useSearchParams } from 'react-router-dom';
import AppBar from "../components/project/Appbar"
import { toast } from "react-toastify"


export const Project = () => {
  const location = useLocation();
  const [workerUrl, setWorkerUrl] = useState<string | null>("http://localhost:4000");
  const [previewUrl, setPreviewUrl] = useState<string | null>("http://localhost:5174")
  const [sessionUrl, setSessionUrl] = useState<string | null>("http://localhost:8080");
  const [Loading, setLoading] = useState(false);
  const [hideChat, setHideChat] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  
  const { projectId: urlProjectId } = useParams(); 
  const [searchParams] = useSearchParams();
  const promptParam = searchParams.get('prompt');
  
  const projectId = location.state?.projectId || urlProjectId;
  const prompt = location.state?.prompt || promptParam;

  async function GetURLs() {
    try {
      if (!projectId) {
        alert("Project ID is not provided.");
        return;
      }
      setLoading(true);
      const res = await axios.get(`${K8S_ORCHASTRATOR_URL}/worker/${projectId}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }) 
      const { sessionUrl, previewUrl, workerUrl } = res.data;
      setSessionUrl(sessionUrl);
      setPreviewUrl(previewUrl);
      setWorkerUrl(workerUrl);

      if(!workerUrl || !sessionUrl || !previewUrl) {
        alert("Worker URL, Session URL, or Preview URL is not available.");
        return;
      }
      if(prompt){
        try {
          const res = await axios.post(`${workerUrl}/api/v1/AI/chat`, {
            prompt: prompt,
            projectId: projectId,
          }, {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          })  
          setFiles(res.data.response)
        } catch (error) {
          console.error("Error sending prompt to worker:", error);
          toast.error("Failed to send prompt to worker. Please try again later.", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch URLs. Please try again later.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      setWorkerUrl(null);
      setSessionUrl(null);
      setPreviewUrl(null);
      console.error("Error fetching iframe URL:", error);
      // window.location.href = "/";
    }
  }

  useEffect(() => {
    GetURLs();
  },[]);

  return (
      <div>
          <GridBackground>
              <div>
                {!hideChat && <AppBar title={prompt || "WebcraftAI Project"} files={files}/> }
                {Loading && <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full border-t-2 border-b-2 border-primary/50 h-24 w-24 border-solid"></div>
                </div>}
                {!Loading && 
                  <ProjectLayout
                    hideChat={hideChat}
                    leftPanel={!hideChat ? <ChatPanel projectId={projectId} workerUrl={workerUrl!}/> : null}
                    rightPanel={<EditorPanel sessionUrl={sessionUrl!} previewUrl={previewUrl!} setHideChat={setHideChat} hidechat={hideChat}/>}
                  />
                }
                
              </div>
          </GridBackground>
      </div>
  )
}