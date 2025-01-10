import * as vscode from 'vscode';
import addRule from './commands/addRule';
import askWolframAlpha from './commands/askWolframAlpha';
import diagnose from './commands/diagnose';
import renameCommand from './commands/renameCommand';
import toggleLinting from './commands/toggleLinting';
import { extensionDisplayName } from './util/constants';

function getEditor(showMessage: boolean, isEnabled: boolean): vscode.TextEditor | null {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		if (showMessage) vscode.window.showErrorMessage('No active editor.');
		return null;
	}
	if (editor.document.languageId !== 'latex' && editor.document.languageId !== 'markdown') {
		if (showMessage) vscode.window.showErrorMessage('This command is only available for LaTeX and Markdown files.');
		return null;
	}
	if (!isEnabled) {
		if (showMessage) vscode.window.showErrorMessage("Linting is off. Click the 'L' button on the Editor Toolbar to enable it.");
		return null;
	}
	return editor;
}

export function activate(context: vscode.ExtensionContext) {
	console.log('"latexlint" is now activated.');

	const diagnosticsCollection = vscode.languages.createDiagnosticCollection(extensionDisplayName);
	context.subscriptions.push(diagnosticsCollection);

	let isEnabled = true;
	const disposableToggleLinting = vscode.commands.registerCommand('latexlint.toggleLinting', () => {
		const editor = getEditor(true, true);
		if (!editor) return;
		isEnabled = !isEnabled;
		toggleLinting(editor.document, diagnosticsCollection, isEnabled);
	});
	context.subscriptions.push(disposableToggleLinting);

	const disposableDiagnose = vscode.commands.registerCommand('latexlint.diagnose', () => {
		const editor = getEditor(true, isEnabled);
		if (!editor) return;
		diagnose(editor.document, diagnosticsCollection, true);
	});
	context.subscriptions.push(disposableDiagnose);

	const disposableAddLLRule = vscode.commands.registerCommand('latexlint.addRule', () => {
		const editor = getEditor(true, isEnabled);
		if (!editor) return;
		addRule(editor, diagnosticsCollection);
	});
	context.subscriptions.push(disposableAddLLRule);

	const disposableRenameCommand = vscode.commands.registerCommand('latexlint.renameCommand', () => {
		const editor = getEditor(true, true);
		if (!editor) return;
		renameCommand(editor);
	});
	context.subscriptions.push(disposableRenameCommand);

	const disposableAskWolframAlpha = vscode.commands.registerCommand('latexlint.askWolframAlpha', () => {
		const editor = getEditor(true, true);
		if (!editor) return;
		askWolframAlpha(editor);
	});
	context.subscriptions.push(disposableAskWolframAlpha);

	vscode.workspace.onDidSaveTextDocument(() => {
		const editor = getEditor(false, isEnabled);
		if (!editor) return;
		diagnose(editor.document, diagnosticsCollection, false);
	});
}

export function deactivate() {
	console.log('"latexlint" is now deactivated.');
}
