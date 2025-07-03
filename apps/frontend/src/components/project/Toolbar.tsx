import { RefreshCcw, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ToolbarProps {
    externalLinkUrl?: string;
    setFullScreen: (arg0: boolean) => void;
    fullScreen: boolean;
}

export const Toolbar = ({ externalLinkUrl, setFullScreen, fullScreen }: ToolbarProps) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Force iframe refresh by updating its src
        const iframe = document.querySelector('iframe[src*="' + externalLinkUrl + '"]') as HTMLIFrameElement;
        if (iframe) {
            const currentSrc = iframe.src;
            iframe.src = '';
            setTimeout(() => {
                iframe.src = currentSrc;
            }, 100);
        }
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleExternalLink = () => {
        if (!externalLinkUrl) {
            console.warn("No external link URL provided.");
            return;
        }
        window.open(externalLinkUrl, "_blank");
    };

    const toggleMaximize = () => {
        setFullScreen(!fullScreen);
    };

    // Handle escape key to exit fullscreen
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && fullScreen) {
                setFullScreen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [fullScreen, setFullScreen]);

    return (
        <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-3 justify-between">
            {/* Refresh Button */}
            <button
                onClick={handleRefresh}
                className="p-2 hover:bg-[#2f2f2f] rounded transition-all duration-200 group hover:scale-105"
                title="Refresh"
            >
                <RefreshCcw 
                    size={16} 
                    className={`text-gray-300 group-hover:text-white transition-all duration-200 ${
                        isRefreshing ? 'animate-spin' : ''
                    }`} 
                />
            </button>
            
            <div className="flex items-center gap-3">
                <div className="bg-black text-gray-300 w-[800px] py-1 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
                    <input
                        type="text"
                        className="w-full bg-black text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-1 rounded-3xl transition-colors duration-200"
                        defaultValue={"/"}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const inputValue = e.currentTarget.value;
                                console.log('New URL:', externalLinkUrl + inputValue);
                                
                                // Optional: Force iframe refresh
                                const iframe = document.querySelector('iframe[src*="' + externalLinkUrl + '"]') as HTMLIFrameElement;
                                if (iframe) {
                                    iframe.src = externalLinkUrl + inputValue;
                                }
                            }
                        }}
                    />
                </div>
                <div className="h-4 w-px bg-gray-600"></div>
            </div>


            {/* Action Buttons */}
            <div className="flex items-center gap-1">
                <button
                    onClick={handleExternalLink}
                    className="p-2 hover:bg-[#2f2f2f] rounded transition-all duration-200 group hover:scale-105"
                    title="Open in new tab"
                >
                    <ExternalLink 
                        size={16} 
                        className="text-gray-300 group-hover:text-white transition-colors duration-200" 
                    />
                </button>

                {/* Maximize/Minimize Button */}
                <button
                    onClick={toggleMaximize}
                    className="p-2 hover:bg-[#2f2f2f] rounded transition-all duration-200 group hover:scale-105"
                    title={fullScreen ? "Exit fullscreen (ESC)" : "Enter fullscreen"}
                >
                    {fullScreen ? (
                        <Minimize2 
                            size={16} 
                            className="text-gray-300 group-hover:text-white transition-all duration-200" 
                        />
                    ) : (
                        <Maximize2 
                            size={16} 
                            className="text-gray-300 group-hover:text-white transition-all duration-200" 
                        />
                    )}
                </button>
            </div>
        </div>
    );
};