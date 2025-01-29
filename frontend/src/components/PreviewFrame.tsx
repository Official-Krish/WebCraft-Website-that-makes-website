// import { WebContainer } from '@webcontainer/api';
// import { useEffect, useState } from 'react';

// interface PreviewFrameProps {
//   files: any[];
//   webContainer: WebContainer;
//   onComponentSelect: (componentName: string) => void;
// }

// export function PreviewFrame({ webContainer, onComponentSelect }: PreviewFrameProps) {
//   const [url, setUrl] = useState("");

//   async function main() {
//     const installProcess = await webContainer.spawn('npm', ['install']);

//     installProcess.output.pipeTo(new WritableStream({
//       write(data) {
//         console.log(data);
//       }
//     }));

//     await webContainer.spawn('npm', ['run', 'dev']);

//     webContainer.on('server-ready', (port, url) => {
//       console.log(url, port);
//       setUrl(url);
//     });
//   }

//   useEffect(() => {
//     main();
//   }, []);

//   return (
//     <div className="h-full flex items-center justify-center text-gray-400 relative">
//       {!url && <div className="text-center">
//         <p className="mb-2">Loading...</p>
//       </div>}
//       {url && (
//         <iframe
//           width={"100%"}
//           height={"100%"}
//           src={url}
//           onLoad={(event) => {
//             const iframe = event.target as HTMLIFrameElement;
//             const iframeDoc = iframe.contentDocument;
//             console.log("iframeDoc", iframeDoc);

//             if (iframeDoc) {
//               iframeDoc.addEventListener("click", (e) => {
//                 const clickedElement = e.target as HTMLElement;
//                 console.log("Clicked Element:", clickedElement); 
//                 console.log("Component Name:", clickedElement.dataset.component);
//                 if (clickedElement.dataset.component) {
//                   onComponentSelect(clickedElement.dataset.component);
//                   console.log(onComponentSelect);
//                 }
//               });
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';

interface PreviewFrameProps {
  webContainer: any; // Replace with the correct type for your web container
  files: any[];
  onComponentHover: (componentName: string | null) => void;
}

export function PreviewFrame({ webContainer, files, onComponentHover }: PreviewFrameProps) {
  const [url, setUrl] = useState("");

  async function main() {
    const installProcess = await webContainer.spawn('npm', ['install']);

    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log(data);
      }
    }));

    await webContainer.spawn('npm', ['run', 'dev']);

    webContainer.on('server-ready', (port: number, url: string) => {
      console.log(url, port);
      setUrl(url);
    });
  }

  useEffect(() => {
    main();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'hover' && event.data.component) {
        // Call the onComponentHover callback with the component name
        onComponentHover(event.data.component);
      } else if (event.data.type === 'unhover') {
        // Call the onComponentHover callback with null to indicate the hover has ended
        onComponentHover(null);
      }
    };

    // Listen for messages from the iframe
    window.addEventListener('message', handleMessage);

    // Clean up the event listener
    return () => window.removeEventListener('message', handleMessage);
  }, [onComponentHover]);

  return (
    <div className="h-full flex items-center justify-center text-gray-400 relative">
      {!url && <div className="text-center">
        <p className="mb-2">Loading...</p>
      </div>}
      {url && (
        <iframe
          width={"100%"}
          height={"100%"}
          src={url}
          onLoad={(event) => {
            const iframe = event.target as HTMLIFrameElement;
            console.log("iframe URL:", iframe.src); // Debugging
          }}
        />
      )}
    </div>
  );
}