import { useEffect, useState } from "react"
import GridBackground from "../components/BackgroundGrid"
import { ChatPanel } from "../components/project/ChatPanel"
import { EditorPanel } from "../components/project/EditorPanel"
import { ResizableLayout } from "../components/project/resizableComponent"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { WORKER_ORCHASTRATOR_URL, WORKER_URL } from "../config"
import Cookies from "js-cookie"


export const Project = () => {
  const location = useLocation();
  const { projectId, prompt } = location.state as { projectId: string, prompt: string };
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)

  async function getIframeUrl() {
    try {
      const res = await axios.get(`${WORKER_ORCHASTRATOR_URL}/${projectId}`, {
        headers: {
          Authorization: `${Cookies.get("token")}`,
        },
      }) 
      setIframeUrl(res.data.ip);
    } catch (error) {
      console.error("Error fetching iframe URL:", error);
      setIframeUrl(null);
    }
    await axios.post(`${WORKER_URL}/AI/chat`, {
      prompt: prompt
    })
  }

  useEffect(() => {
    getIframeUrl()
  })

    return (
        <div className="h-full w-full">
            <GridBackground>
                <div className="px-4 py-3 w-full h-full">
                  <ResizableLayout
                    leftPanel={<ChatPanel projectId={projectId}/>}
                    rightPanel={<EditorPanel IFRAME_URL={iframeUrl!}/>}
                    defaultLeftWidth={30}
                    minLeftWidth={20}
                    maxLeftWidth={30}
                  />
                </div>
            </GridBackground>
        </div>
    )
}