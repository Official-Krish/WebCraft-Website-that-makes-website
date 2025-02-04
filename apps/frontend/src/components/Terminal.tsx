import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { WebContainer } from '@webcontainer/api';
import { TerminalIcon } from 'lucide-react';

interface TerminalProps {
  webcontainer: WebContainer; // If you have types from @webcontainer/api
}

export function TerminalComponent({ webcontainer }: TerminalProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const terminalInstance = useRef<Terminal | null>(null);

    useEffect(() => {
        if (!terminalRef.current || !webcontainer) return;

        const terminal = new Terminal({
            convertEol: true,
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff'
            }
        });

        terminalInstance.current = terminal;

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);

        terminal.open(terminalRef.current);
        fitAddon.fit();

        const startShell = async () => {
        try {
                const shellProcess = await webcontainer.spawn('jsh', {
                    terminal: {
                        cols: terminal.cols,
                        rows: terminal.rows,
                    },
                });

                if (shellProcess.output) {
                    shellProcess.output.pipeTo(
                        new WritableStream({
                        write(data) {
                            terminal.write(data);
                        },
                    })
                );
            }

                if (shellProcess.input) {
                const input = shellProcess.input.getWriter();
                terminal.onData((data) => {
                    input.write(data);
                });
            }
            } catch (error) {
                terminal.write(`\r\nError starting shell: ${error}\r\n`);
            }
        };

        // Handle window resize
            const handleResize = () => {
                fitAddon.fit();
                // Optionally update shell process with new dimensions
            };

            window.addEventListener('resize', handleResize);
            startShell();

            return () => {
            window.removeEventListener('resize', handleResize);
            if (terminalInstance.current) {
                terminalInstance.current.dispose();
            }
        };
    }, [webcontainer]);

    return <div className='border border-brown4 w-[950px] h-[148px]'>  
        <div className= 'text-white'>
            <div className='border-b border-brown4 p-2 flex items-center ml-2'>
                {<TerminalIcon size={24} className='text-neutral-400 border border-white p-1 rounded-sm'/>}
                <h1 className='text-2xl font-normal text-neutral-400 pl-2'>Terminal</h1>
            </div>
            <div 
                ref={terminalRef} 
                className='overflow-y-scroll w-full h-[110px]'
            />
        </div>
    </div>

}