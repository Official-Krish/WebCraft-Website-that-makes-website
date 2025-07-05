export class ArtifactProcessor {
    public currentArtifact: string;
    private onFileContent: (filePath: string, fileContent: string) => void;
    private onShellCommand: (shellCommand: string) => void;
    private processedUpTo: number = 0;
    private onDescription: (description: string) => void;
    private lastDescriptionEndIndex: number = 0;

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
        // First process any completed actions
        this.processCompletedActions();
        
        // Then handle any ongoing action
        this.processOngoingAction();
        
        // Then look for new actions that might have started
        this.detectNewAction();
        
        // Finally process any remaining descriptive text (only complete descriptions)
        this.processDescriptiveText();
    }

    private processDescriptiveText(): void {
        // Find the next boltAction tag in the unprocessed content (not boltArtifact)
        const nextTagIndex = this.currentArtifact.indexOf('<boltAction', this.lastDescriptionEndIndex);
        
        // If there's a next boltAction tag, process description up to that tag
        if (nextTagIndex !== -1) {
            if (nextTagIndex > this.lastDescriptionEndIndex) {
                const description = this.currentArtifact.slice(this.lastDescriptionEndIndex, nextTagIndex).trim();
                if (description.length > 0) {
                    this.onDescription(description);
                }
                this.lastDescriptionEndIndex = nextTagIndex;
            }
            return;
        }
        
        // If no more boltAction tags found, we need to check if we're at the end of the stream
        // This will be handled in forceProcessRemaining() when the stream is complete
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
            
            // Process any description before this action (excluding boltArtifact tags)
            if (startIndex > this.lastDescriptionEndIndex) {
                const potentialDescription = content.slice(this.lastDescriptionEndIndex, startIndex).trim();
                const filteredDescription = this.filterOutBoltArtifactTags(potentialDescription);
                
                if (filteredDescription.length > 0) {
                    this.onDescription(filteredDescription);
                }
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
            
            // Update processedUpTo and lastDescriptionEndIndex to the end of the matched action
            const endIndex = startIndex + fullMatch.length;
            this.processedUpTo = endIndex;
            this.lastDescriptionEndIndex = endIndex;
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
                
                const endIndex = closingTagIndex + '</boltAction>'.length;
                this.processedUpTo = endIndex;
                this.lastDescriptionEndIndex = endIndex;
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
        
        // Process any description before this action starts (excluding boltArtifact tags)
        if (actionStartIndex > this.lastDescriptionEndIndex) {
            const potentialDescription = this.currentArtifact.slice(this.lastDescriptionEndIndex, actionStartIndex).trim();
            
            // Filter out boltArtifact tags from description
            const filteredDescription = this.filterOutBoltArtifactTags(potentialDescription);
            
            if (filteredDescription.length > 0) {
                this.onDescription(filteredDescription);
            }
            this.lastDescriptionEndIndex = actionStartIndex;
        }
        
        const contentStartIndex = actionStartIndex + openingTagMatch[0].length;
        
        this.currentAction = {
            type: attributes.type,
            filePath: attributes.filePath,
            contentStartIndex,
            lastSentIndex: contentStartIndex,
            accumulatedContent: ''
        };
    }

    private filterOutBoltArtifactTags(text: string): string {
        // Remove boltArtifact opening tags and closing tags
        return text
            .replace(/<boltArtifact[^>]*>/g, '')
            .replace(/<\/boltArtifact>/g, '')
            .trim();
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
        
        // Process any remaining descriptive text (now that we know the stream is complete)
        if (this.lastDescriptionEndIndex < this.currentArtifact.length) {
            const potentialDescription = this.currentArtifact.slice(this.lastDescriptionEndIndex).trim();
            const filteredDescription = this.filterOutBoltArtifactTags(potentialDescription);
            
            if (filteredDescription.length > 0) {
                this.onDescription(filteredDescription);
            }
        }
        
        this.currentArtifact = '';
        this.processedUpTo = 0;
        this.lastDescriptionEndIndex = 0;
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
        this.lastDescriptionEndIndex = 0;
        this.currentAction = null;
    }

    public reset() {
        this.processedUpTo = 0;
        this.lastDescriptionEndIndex = 0;
        this.currentAction = null;
    }

    public getDebugInfo() {
        return {
            totalLength: this.currentArtifact.length,
            processedUpTo: this.processedUpTo,
            lastDescriptionEndIndex: this.lastDescriptionEndIndex,
            currentAction: this.getCurrentAction(),
            pendingContent: this.getPendingContent()
        };
    }
}