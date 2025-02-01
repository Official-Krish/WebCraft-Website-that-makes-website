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

// import { useEffect, useState } from 'react';

// interface PreviewFrameProps {
//   webContainer: any;
//   files: any[];
//   onComponentHover: (componentName: string | null) => void;
// }

// export function PreviewFrame({ webContainer, onComponentHover }: PreviewFrameProps) {
//   const [url, setUrl] = useState("");

//   async function main() {
//     const installProcess = await webContainer.spawn("npm", ["install"]);
//     installProcess.output.pipeTo(new WritableStream({ write(data) { console.log(data); }}));
//     await webContainer.spawn("npm", ["run", "dev"]);

//     webContainer.on("server-ready", (port: number, url: string) => {
//       console.log("WebContainer URL:", url);
//       setUrl(url);
//     });
//   }

//   useEffect(() => {
//     const handleMessage = (event: MessageEvent) => {
//       console.log("Received Message:", event.data); // Debugging
//       if (event.data.type === "hover") {
//         console.log("Component Hovered:", event.data.component); // Debugging
//         const comp = event.data.component || "div";
//         console.log("Comp:", comp); // Debugging
//         onComponentHover(comp);
//       } else if (event.data.type === "unhover") {
//         console.log("Component Unhovered"); // Debugging
//         onComponentHover(null);
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [onComponentHover]);

//   useEffect(() => {
//     main();
//   }, []);

//   return (
//     <div className="h-full flex items-center justify-center text-gray-400 relative">
//       {!url && <p>Loading...</p>}
//       {url && (
//         <iframe
//           width="100%"
//           height="100%"
//           src={url}
//           onLoad={(event) => {
//             const iframe = event.target as HTMLIFrameElement;
//             console.log("iframe Loaded:", iframe.src);

//             // Wait for the iframe's content to be fully ready
//             iframe.contentWindow?.addEventListener('DOMContentLoaded', () => {
//               console.log("iframe DOMContentLoaded");

//               // Inject a script into the iframe to handle hover events
//               const script = `
//                 document.addEventListener("mouseover", (event) => {
//                   const target = event.target;
//                   if (target && target.dataset.component) {
//                     console.log("Hovered over component:", target.dataset.component);
//                     window.parent.postMessage(
//                       { type: "hover", component: target.dataset.component },
//                       "http://localhost:5173"
//                     );
//                   }
//                 });

//                 document.addEventListener("mouseout", (event) => {
//                   const target = event.target;
//                   if (target && target.dataset.component) {
//                     console.log("Unhovered from component:", target.dataset.component);
//                     window.parent.postMessage({ type: "unhover" }, "http://localhost:5173");
//                   }
//                 });
//               `;

//               const scriptElement = document.createElement('script');
//               scriptElement.textContent = script;
//               iframe.contentDocument?.body.appendChild(scriptElement);
//               console.log("Script injected into iframe");
//             });
//           }}
//         />
//       )}
//     </div>
//   );
// }

import { LoaderCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface PreviewFrameProps {
  webContainer: any;
  files: any[];
  onComponentHover: (componentName: string | null) => void;
}

export function PreviewFrame({ webContainer, onComponentHover }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isScriptInjected, setIsScriptInjected] = useState(false);

  async function main() {
    const installProcess = await webContainer.spawn("npm", ["install"]);
    installProcess.output.pipeTo(new WritableStream({ 
      write(data) { console.log(data); }
    }));
    await webContainer.spawn("npm", ["run", "dev"]);

    webContainer.on("server-ready", (port: number, url: string) => {
      console.log("WebContainer URL:", url);
      setUrl(url);
    });
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("Parent received message:", event.data, "from origin:", event.origin);
      
      if (event.data.type === "hover") {
        console.log("Processing hover event for component:", event.data.component);
        const comp = event.data.component || "div";
        onComponentHover(comp);
      } else if (event.data.type === "unhover") {
        console.log("Processing unhover event");
        onComponentHover(null);
      } else if (event.data.type === "scriptLoaded") {
        console.log("Script successfully loaded in iframe");
        setIsScriptInjected(true);
      } else if (event.data.type === "debug") {
        console.log("Debug from iframe:", event.data.message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComponentHover]);

  useEffect(() => {
    main();
  }, []);

  const injectScript = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      // Wait for the iframe to be fully loaded
      if (iframe.contentWindow) {
        console.log("Iframe document ready, injecting script...");
        
        const script = iframe?.contentDocument?.createElement('script');
        if (!script) {
          console.error("Failed to create script element");
          return;
        }  
        script.textContent = `
          (function() {
            console.log("Hover detection script starting...");
            
            function debugLog(message) {
              console.log("iframe debug:", message);
              window.parent.postMessage({ type: "debug", message }, "*");
            }

            debugLog("Script initialized");
            window.parent.postMessage({ type: "scriptLoaded" }, "*");
            
            // Add raw event listeners
            document.addEventListener("mouseover", (e) => {
              debugLog("Raw mouseover event on: " + e.target.tagName);
            }, true);

            document.addEventListener("mouseout", (e) => {
              debugLog("Raw mouseout event on: " + e.target.tagName);
            }, true);

            // Component hover handlers
            function handleHover(event) {
              debugLog("Handling hover event");
              let target = event.target;
              while (target) {
                if (target.dataset?.component) {
                  debugLog("Found component: " + target.dataset.component);
                  window.parent.postMessage({
                    type: "hover",
                    component: target.dataset.component
                  }, "*");
                  break;
                }
                target = target.parentElement;
              }
            }

            function handleUnhover(event) {
              debugLog("Handling unhover event");
              let target = event.target;
              while (target) {
                if (target.dataset?.component) {
                  debugLog("Found component unhover: " + target.dataset.component);
                  window.parent.postMessage({ type: "unhover" }, "*");
                  break;
                }
                target = target.parentElement;
              }
            }

            // Add test element
            const testDiv = document.createElement('div');
            testDiv.setAttribute('data-component', 'TestComponent');
            testDiv.textContent = 'Hover Test Element';
            testDiv.style.cssText = \`
              position: fixed;
              top: 10px;
              left: 10px;
              background-color: blue;
              color: white;
              padding: 10px;
              z-index: 9999;
              cursor: pointer;
            \`;
            document.body.appendChild(testDiv);
            debugLog("Test element created");

            // Add component event listeners
            document.addEventListener("mouseover", handleHover, true);
            document.addEventListener("mouseout", handleUnhover, true);
            
            // Log existing components
            debugLog("Scanning for components...");
            const components = document.querySelectorAll('[data-component]');
            debugLog("Found " + components.length + " components");
            components.forEach(comp => {
              debugLog("Component: " + comp.dataset.component);
            });
          })();
        `;
        
        iframe?.contentDocument?.head.appendChild(script);
        console.log("Script injection completed");
      } else {
        console.log("Document not ready, waiting...");
        setTimeout(injectScript, 100);
      }
    } catch (error) {
      console.error("Error during script injection:", error);
    }
  };

  return (
    <div className='min-h-screen'>
      {!url && <div className='flex items-center justify-center min-h-screen'>
          <LoaderCircle className="animate-spin text-white h-10 w-10" />
        </div>
      }
      <iframe
        ref={iframeRef}
        className='min-h-screen w-full'
        src={url}
        onLoad={() => {
          console.log("Iframe onLoad triggered");
          setTimeout(injectScript, 100); // Give a small delay after load
        }}
      />
      {/* {!isScriptInjected && (
        <div className="absolute bottom-4 left-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded">
          Initializing hover detection...
        </div>
      )} */}
    </div>
  );
}