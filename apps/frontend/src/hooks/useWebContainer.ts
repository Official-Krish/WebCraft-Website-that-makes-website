import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

    useEffect(() => {
        // Only boot WebContainer if it's not already booted
        if (!webcontainer) {
            const bootWebContainer = async () => {
                try {
                    const webcontainerInstance = await WebContainer.boot();
                    setWebcontainer(webcontainerInstance);
                } catch (error) {
                    console.error("Error booting WebContainer:", error);
                }
            };
            
            bootWebContainer();
        }
    }, [webcontainer]); // Dependency on webcontainer ensures it is booted once

    return webcontainer;
}
