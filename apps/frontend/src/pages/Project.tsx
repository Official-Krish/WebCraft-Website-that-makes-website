import { useEffect, useState } from "react"
import GridBackground from "../components/BackgroundGrid"
import { ChatPanel } from "../components/project/ChatPanel"
import { EditorPanel } from "../components/project/EditorPanel"
import { ResizableLayout } from "../components/project/resizableComponent"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { K8S_ORCHASTRATOR_URL } from "../config"
import Cookies from "js-cookie"


export const Project = () => {
  const location = useLocation();
  const { projectId, prompt } = location.state as { projectId: string, prompt: string };
  const [workerUrl, setWorkerUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sessionUrl, setSessionUrl] = useState<string | null>(null)

  async function getIframeUrl() {
    try {
      const res = await axios.get(`${K8S_ORCHASTRATOR_URL}/worker/${projectId}`, {
        headers: {
          Authorization: `${Cookies.get("token")}`,
        },
      }) 
      setSessionUrl(res.data.sessionUrl);
      setPreviewUrl(res.data.previewUrl);
      setWorkerUrl(res.data.workerUrl);
    } catch (error) {
      console.error("Error fetching iframe URL:", error);
    }
  }

  useEffect(() => {
    getIframeUrl()
  })

    return (
        <div className="h-full w-full">
            <GridBackground>
                <div className="px-4 py-3 w-full h-full">
                  <ResizableLayout
                    leftPanel={<ChatPanel projectId={projectId} workerUrl={workerUrl!}/>}
                    rightPanel={<EditorPanel sessionUrl={sessionUrl!} previewUrl={previewUrl!} />}
                    defaultLeftWidth={30}
                    minLeftWidth={20}
                    maxLeftWidth={30}
                  />
                </div>
            </GridBackground>
        </div>
    )
}