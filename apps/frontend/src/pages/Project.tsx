import { useEffect, useState } from "react"
import GridBackground from "../components/BackgroundGrid"
import { ChatPanel } from "../components/project/ChatPanel"
import { EditorPanel } from "../components/project/EditorPanel"
import { ResizableLayout } from "../components/project/resizableComponent"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { K8S_ORCHASTRATOR_URL } from "../config"
import { useParams, useSearchParams } from 'react-router-dom';



export const Project = () => {
  const location = useLocation();
  const [workerUrl, setWorkerUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sessionUrl, setSessionUrl] = useState<string | null>(null)
  const [Loading, setLoading] = useState(false);
  
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
      const worker = axios.post(`${workerUrl}/api/v1/AI/chat`, {
        prompt: prompt,
        projectId: projectId,
      }, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      if (!worker) {
        alert("Worker is not available.");
        return;
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching iframe URL:", error);
    }
  }

  useEffect(() => {
    GetURLs();
  },[]);

  return (
      <div className="h-full w-full">
          <GridBackground>
              <div className="px-4 py-3 w-full h-full">
                {Loading && <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full border-t-2 border-b-2 border-primary/50 h-24 w-24 border-solid"></div>
                </div>}
                {!Loading && 
                  <ResizableLayout
                    leftPanel={<ChatPanel projectId={projectId} workerUrl={workerUrl!}/>}
                    rightPanel={<EditorPanel sessionUrl={sessionUrl!} previewUrl={previewUrl!} />}
                    defaultLeftWidth={30}
                    minLeftWidth={20}
                    maxLeftWidth={30}
                  />
                }
                
              </div>
          </GridBackground>
      </div>
  )
}