// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WebSocket } from 'ws';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let ws = initWS(context);

	ws.onerror = (error) => {
		console.log("Error connecting to WS, reconnecting...", error);
		initWS(context);
	};

	const aiTerninal = vscode.window.createTerminal({
		name: "AI Terminal",
		hideFromUser: true,
	});

	context.globalState.update("aiTerminalId", aiTerninal.processId);

	aiTerninal.show();

	vscode.commands.executeCommand('workbench.action.terminal.focus');

	let sendToAiTerminal = vscode.commands.registerCommand('extension.sendToAiTerminal', async (text) => {
		const terminalId = context.globalState.get('aiTerminalId');
		const terminals = vscode.window.terminals;
		const aiTerm = terminals.find(t => t.processId === terminalId);
		
		if (aiTerm) {
		  aiTerm.sendText(text);
		} else {
		  	vscode.window.showErrorMessage('AI Terminal not found. It may have been closed.');
	  
			const aiTerminal = vscode.window.createTerminal({
				name: "AI Terminal",
				hideFromUser: false
			});
			context.globalState.update('aiTerminalId', aiTerminal.processId);
			aiTerminal.show();
			aiTerminal.sendText(text);
		}
	});

	context.subscriptions.push(sendToAiTerminal);

	const disposable = vscode.commands.registerCommand('Pixlr-listener.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Pixlr-listener!');
		vscode.commands.executeCommand("workbench.action.terminal.new");
		vscode.commands.executeCommand("workbench.action.terminal.sendSequence", {text: "npm run build"});
		vscode.commands.executeCommand("workbench.action.terminal.sendSequence", {text: "\r"});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function initWS(context: vscode.ExtensionContext) {
	const ws = new WebSocket(process.env.WS_RELAYER_URL || "ws://ws-relayer:9093");

	ws.onopen = () => {
		ws.send(JSON.stringify({
			event: "subscribe",
			data: null
		}));
	};

	ws.onmessage = async (event: any) => {
		const data: any = JSON.parse(event.data);

		console.log(data);

		if (data.type === "command"){
			vscode.commands.executeCommand('extension.sendToAiTerminal', data.content);
		}

		if (data.type === "update-file"){
			const fileUri = await ensureFileExists(data.path, data.content);
			const doc = await vscode.workspace.openTextDocument(fileUri);
			await vscode.window.showTextDocument(doc);

			const edit = new vscode.WorkspaceEdit();
			const range = new vscode.Range(
				new vscode.Position(0, 0),
				new vscode.Position(doc.lineCount, 0)
			)

			edit.replace(doc.uri, range, data.content);
			await vscode.workspace.applyEdit(edit);
		}

		if (data.type === "prompt-start"){
			const terminals = vscode.window.terminals;
			if (terminals.length > 0) {
				const activeTerminal = vscode.window.activeTerminal;
				activeTerminal?.sendText('0x3');
			}
		}

		if (data.type === "prompt-end"){
			console.log("prompt-end");
			vscode.commands.executeCommand('extension.sendToAiTerminal', 'npm run dev');
		}
	}

	return ws;
}

async function ensureFileExists(filePath: string, fileContent: string = '') {
	try{
		const uri = vscode.Uri.file(filePath);

		const dirPath = path.dirname(filePath);

		try {
			await vscode.workspace.fs.stat(vscode.Uri.file(dirPath));
		} catch {
			await vscode.workspace.fs.createDirectory(vscode.Uri.file(dirPath));
		}

		try {
			await vscode.workspace.fs.stat(uri);
		} catch {
			await vscode.workspace.fs.writeFile(uri, Buffer.from(fileContent, 'utf8'));
		}

		return uri;
	} catch (e) {
		console.log("File does not exist");
		vscode.window.showErrorMessage(`Error ensuring file exists: ${e}`);
	  	throw e;
	}
}