export class ArtifactProcessor {
    public currentArtifact: string;
    private onFileContent: (filePath: string, content: string) => void;
    private onShellCommand: (command: string) => void;

    constructor(currentArtifact: string, onFileContent: (filePath: string, content: string) => void, onShellCommand: (command: string) => void) {
        this.currentArtifact = currentArtifact;
        this.onFileContent = onFileContent;
        this.onShellCommand = onShellCommand;
    }

    append(artifact: string) {
        this.currentArtifact += artifact;
    }

    parse() {
        const matches = this.currentArtifact.match(/```html\s*([\s\S]*?)```/);
        if (!matches || !matches[1]) {
            console.log("No valid bolt artifact content found");
            return;
        }

        const artifactContent = matches[1].trim();
        if (!artifactContent) {
            console.log("No artifact content found");
            return;
        }
        
        const latestActionStart = artifactContent.split("\n").findIndex((line) => line.includes("<boltAction type="));

        const latestActionEnd = artifactContent.split("\n").findIndex((line) => line.includes("</boltAction>")) ?? (artifactContent.split("\n").length - 1);

        if (latestActionStart === - 1){
            console.log("No valid bolt action found");
            return;
        }

        const latestActionType = artifactContent?.split("\n")[latestActionStart]?.split("type=")[1]?.split(" ")[0]!.split(">")[0];

       const latestActionContent = artifactContent.split("\n").slice(latestActionStart, latestActionEnd + 1).join("\n");

        try{
            if (latestActionType === "\"shell\"") {
                let shellCommand = latestActionContent.split('\n').slice(1).join('\n');

                if (shellCommand.includes("</boltAction>")) {
                    shellCommand = shellCommand.split("</boltAction>")[0]!;
                    this.currentArtifact = artifactContent.split(latestActionContent)[1]!;
                    this.onShellCommand(shellCommand);
                }
            } else if (latestActionType === "\"file\"") {
                const filePath = artifactContent.split("\n")[latestActionStart]!.split("filePath=")[1]!.split(">")[0];
                let fileContent = latestActionContent.split("\n").slice(1).join("\n");
                    if (fileContent.includes("</boltAction>")) {
                        fileContent = fileContent.split("</boltAction>")[0]!;
                        this.currentArtifact = artifactContent.split(latestActionContent)[1]!;
                        this.onFileContent(filePath?.split("\"")[1]!, fileContent);
                    }
                }
        } catch (e) {
            console.log("Error parsing bolt action: ", e);
        }

    }
}