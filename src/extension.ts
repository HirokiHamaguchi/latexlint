// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import renameCommand from './commands/renameCommand';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('"latexlint" is now activated.');

	const disposable = vscode.commands.registerCommand('latexlint.renameCommand', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) {
			console.log('No active text editor.');
			return;
		}

		const res = renameCommand(editor);
		if (res === undefined) {
			console.log('No changes were made.');
			return;
		}

		const newText = await vscode.window.showInputBox({
			title: 'Enter the new argument for the command.',
			value: res.originalText,
		});
		if (newText === undefined) return;


		const updatedText = res.s1 + newText + res.s2 + newText + res.s3;
		await editor.edit((editBuilder) => {
			editBuilder.replace(
				new vscode.Range(
					new vscode.Position(0, 0),
					editor.document.lineAt(editor.document.lineCount - 1).range.end
				),
				updatedText
			);
		});

		let cursorPos = res.cursorPos + res.newTextCountForCursor * newText.length;
		editor.selection = new vscode.Selection(
			editor.document.positionAt(cursorPos),
			editor.document.positionAt(cursorPos)
		);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('"latexlint" is now deactivated.');
}
