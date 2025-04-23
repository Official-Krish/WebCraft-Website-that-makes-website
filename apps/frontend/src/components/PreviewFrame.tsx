import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PreviewFrameProps {
  webContainer: any;
  files: any[];
}

export function PreviewFrame({ webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  async function main() {
    const installProcess = await webContainer.spawn("npm", ["install"]);

    installProcess.output.pipeTo(new WritableStream({ write(data) { console.log(data); }}));

    await webContainer.spawn("npm", ["run", "dev"]);

    webContainer.on("server-ready", (port: number, url: string) => {
      console.log("WebContainer URL:", url, port);
      setUrl(url);
    });
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <div className='min-h-screen'>
      {!url && <div className='flex items-center justify-center min-h-screen'>
          <LoaderCircle className="animate-spin text-white h-10 w-10" />
        </div>
      }
      <iframe
        className='min-h-screen w-full'
        src={url}
      />
    </div>
  );
}
