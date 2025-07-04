export class ArtifactProcessor {
    public currentArtifact: string;
    private onFileContent: (filePath: string, fileContent: string) => void;
    private onShellCommand: (shellCommand: string) => void;
    private processedUpTo: number = 0;
    private onDescription: (description: string) => void;

    private currentAction: {
        type: string;
        filePath?: string;
        contentStartIndex: number;
        lastSentIndex: number;
        accumulatedContent: string;
    } | null = null;

    constructor(
        currentArtifact: string, 
        onFileContent: (filePath: string, fileContent: string) => void, 
        onShellCommand: (shellCommand: string) => void,
        onDescription: (description: string) => void 
    ) {
        this.currentArtifact = currentArtifact;
        this.onFileContent = onFileContent;
        this.onShellCommand = onShellCommand;
        this.onDescription = onDescription;
    }

    append(artifact: string): void {
        this.currentArtifact += artifact;
        this.parse();
    }

    parse(): void {
        // Process the descriptive text first
        this.processDescriptiveText();

        // First process any completed actions
        this.processCompletedActions();
        
        // Then handle any ongoing action
        this.processOngoingAction();
        
        // Finally look for new actions that might have started
        this.detectNewAction();
    }

    private processDescriptiveText(): void {
        // Find the first tag in the content
        const firstTagIndex = this.currentArtifact.indexOf('<bolt');
        
        // If there's text before the first tag, process it as description
        if (firstTagIndex > this.processedUpTo) {
            const description = this.currentArtifact.slice(this.processedUpTo, firstTagIndex)
                .trim();
                
            if (description.length > 0) {
                this.onDescription(description);
            }
            
            this.processedUpTo = firstTagIndex;
        }
        // If no tags found but we have content, process it all as description
        else if (firstTagIndex === -1 && this.currentArtifact.length > this.processedUpTo) {
            const description = this.currentArtifact.slice(this.processedUpTo).trim();
            if (description.length > 0) {
                this.onDescription(description);
            }
            this.processedUpTo = this.currentArtifact.length;
        }
    }

    private processCompletedActions(): void {
        const content = this.currentArtifact;
        const actionRegex = /<boltAction\s+([^>]+?)>([\s\S]*?)<\/boltAction>/g;
        actionRegex.lastIndex = this.processedUpTo;
        
        let match;
        while ((match = actionRegex.exec(content)) !== null) {
            const [fullMatch, attributesStr, innerContent] = match;
            const startIndex = match.index;
            
            // Skip if we've already processed this part
            if (startIndex < this.processedUpTo) {
                continue;
            }
            
            const attributes = this.parseAttributes(attributesStr);
            const type = attributes.type;
            
            try {
                if (type === 'shell') {
                    const commands = innerContent.split('\n')
                        .map(cmd => cmd.trim())
                        .filter(cmd => cmd.length > 0);
                    
                    commands.forEach(cmd => {
                        this.onShellCommand(cmd);
                    });
                } else if (type === 'file' && attributes.filePath) {
                    this.onFileContent(attributes.filePath, innerContent);
                }
            } catch (error) {
                console.error('Error processing completed action:', error);
            }
            
            this.processedUpTo = startIndex + fullMatch.length;
        }
    }
    
    private processOngoingAction(): void {
        if (!this.currentAction) return;
        
        const content = this.currentArtifact;
        const closingTagIndex = content.indexOf('</boltAction>', this.currentAction.contentStartIndex);
        
        if (closingTagIndex !== -1) {
            // Only process if we haven't already processed this action
            if (closingTagIndex + '</boltAction>'.length > this.processedUpTo) {
                const actionContent = content.slice(
                    this.currentAction.contentStartIndex,
                    closingTagIndex
                );
                
                if (this.currentAction.type === 'shell') {
                    const commands = actionContent.split('\n')
                        .map(cmd => cmd.trim())
                        .filter(cmd => cmd.length > 0);
                    
                    commands.forEach(cmd => {
                        this.onShellCommand(cmd);
                    });
                } else if (this.currentAction.type === 'file' && this.currentAction.filePath) {
                    this.onFileContent(this.currentAction.filePath, actionContent);
                }
                
                this.processedUpTo = closingTagIndex + '</boltAction>'.length;
            }
            this.currentAction = null;
        }
    }

    private detectNewAction(): void {
        if (this.currentAction) return;
        
        const content = this.currentArtifact.slice(this.processedUpTo);
        const openingTagMatch = content.match(/<boltAction\s+([^>]+?)>/);
        
        if (!openingTagMatch) return;
        
        const attributes = this.parseAttributes(openingTagMatch[1]);
        if (!attributes.type) return;
        
        const actionStartIndex = this.processedUpTo + content.indexOf(openingTagMatch[0]);
        const contentStartIndex = actionStartIndex + openingTagMatch[0].length;
        
        this.currentAction = {
            type: attributes.type,
            filePath: attributes.filePath,
            contentStartIndex,
            lastSentIndex: contentStartIndex,
            accumulatedContent: ''
        };
    }

    private parseAttributes(attributesStr: string): Record<string, string> {
        const attributes: Record<string, string> = {};
        const attrRegex = /(\w+)="([^"]*)"/g;
        let match;
        
        while ((match = attrRegex.exec(attributesStr)) !== null) {
            attributes[match[1]] = match[2];
        }
        
        return attributes;
    }

    public forceProcessRemaining(): void {
        // Process any remaining complete actions
        this.processCompletedActions();
        
        // Try to process the current ongoing action if it exists
        if (this.currentAction) {
            const content = this.currentArtifact.slice(this.currentAction.contentStartIndex);
            
            if (this.currentAction.type === 'shell') {
                const commands = content.split('\n')
                    .map(cmd => cmd.trim())
                    .filter(cmd => cmd.length > 0);
                
                commands.forEach(cmd => {
                    this.onShellCommand(cmd);
                });
            } else if (this.currentAction.type === 'file' && this.currentAction.filePath) {
                this.onFileContent(this.currentAction.filePath, content);
            }
            
            this.currentAction = null;
        }
        
        this.currentArtifact = '';
        this.processedUpTo = 0;
    }

    // Original utility methods remain unchanged
    public getCurrentAction() {
        return this.currentAction ? {
            type: this.currentAction.type,
            filePath: this.currentAction.filePath,
            accumulatedContent: this.currentAction.accumulatedContent
        } : null;
    }

    public getPendingContent() {
        return this.currentArtifact.slice(this.processedUpTo);
    }

    public getProcessedLength() {
        return this.processedUpTo;
    }

    public clear() {
        this.currentArtifact = '';
        this.processedUpTo = 0;
        this.currentAction = null;
    }

    public reset() {
        this.processedUpTo = 0;
        this.currentAction = null;
    }

    public getDebugInfo() {
        return {
            totalLength: this.currentArtifact.length,
            processedUpTo: this.processedUpTo,
            currentAction: this.getCurrentAction(),
            pendingContent: this.getPendingContent()
        };
    }
}