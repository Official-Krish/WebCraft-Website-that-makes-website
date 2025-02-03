import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PreviewFrameProps {
  webContainer: any;
  files: any[];
  onComponentHover: (componentName: string | null) => void;
}

export function PreviewFrame({ webContainer, onComponentHover }: PreviewFrameProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      console.log("MouseEnter Target:", target); // Debugging
      if (target) {
        console.log("Sending Hover:", target.dataset.component); // Debugging
        window.parent.postMessage(
          { type: "hover", component: target.dataset.component },
          "*"
        );
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      console.log("MouseLeave Target:", target); // Debugging
      window.parent.postMessage({ type: "unhover" }, "*");
    };

    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
    };
  }, []);


  async function main() {
    const installProcess = await webContainer.spawn("npm", ["install"]);

    installProcess.output.pipeTo(new WritableStream({ write(data) { console.log(data); }}));

    await webContainer.spawn("npm", ["run", "dev"]);

    webContainer.on("server-ready", (port: number, url: string) => {
      console.log("WebContainer URL:", url);
      setUrl(url);
    });
  }

  useEffect(() => {
    main();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("Received Message:", event.data); // Debugging
      if (event.data.type === "hover" && event.data.component === undefined) {
        event.data.component = "Title";
      }
      if (event.data.type === "hover" && event.data.component ) {
        console.log("Component Hovered:", event.data.component); 
        onComponentHover(event.data.component);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComponentHover]);

  return (
    <div className='min-h-screen'>
      {!url && <div className='flex items-center justify-center min-h-screen'>
          <LoaderCircle className="animate-spin text-white h-10 w-10" />
        </div>
      }
      <iframe
        className='min-h-screen w-full'
        src={url}
        onLoad={(event) => {
          const iframe = event.target as HTMLIFrameElement;
          console.log("iframe Loaded:", iframe.src);
        }}
      />
    </div>
  );
}
