import * as vscode from 'vscode';
import addRule from './commands/addRule';
import askWolframAlpha from './commands/askWolframAlpha';
import diagnose from './commands/diagnose';
import renameCommand from './commands/renameCommand';
import toggleLinting from './commands/toggleLinting';
import { extensionDisplayName } from './util/constants';
import getEditor from './util/getEditor';
import selectRule from './commands/selectRule';
import registerException from './commands/registerException';

export function activate(context: vscode.ExtensionContext) {
	console.log('"latexlint" is now activated.');

	const diagnosticsCollection = vscode.languages.createDiagnosticCollection(extensionDisplayName);
	context.subscriptions.push(diagnosticsCollection);
	let isEnabled = true;

	const disposableAddLLRule = vscode.commands.registerCommand('latexlint.addRule', () => {
		const editor = getEditor(true, isEnabled);
		if (!editor) return;
		addRule(editor, diagnosticsCollection);
	});
	context.subscriptions.push(disposableAddLLRule);

	const disposableAskWolframAlpha = vscode.commands.registerCommand('latexlint.askWolframAlpha', () => {
		const editor = getEditor(true, true);
		if (!editor) return;
		askWolframAlpha(editor);
	});
	context.subscriptions.push(disposableAskWolframAlpha);

	const disposableDiagnose = vscode.commands.registerCommand('latexlint.diagnose', () => {
		const editor = getEditor(true, isEnabled);
		if (!editor) return;
		diagnose(editor.document, diagnosticsCollection, true);
	});
	context.subscriptions.push(disposableDiagnose);

	const disposableRegisterException = vscode.commands.registerCommand('latexlint.registerException', () => {
		const editor = getEditor(true, isEnabled);
		if (!editor) return;
		registerException(editor, diagnosticsCollection);
	});
	context.subscriptions.push(disposableRegisterException);

	const disposableSelectRule = vscode.commands.registerCommand('latexlint.selectRule', selectRule);
	context.subscriptions.push(disposableSelectRule);

	const disposableRenameCommand = vscode.commands.registerCommand('latexlint.renameCommand', () => {
		const editor = getEditor(true, true);
		if (!editor) return;
		renameCommand(editor);
	});
	context.subscriptions.push(disposableRenameCommand);

	const disposableToggleLinting = vscode.commands.registerCommand('latexlint.toggleLinting', () => {
		const editor = getEditor(true, true);
		if (!editor) return;
		isEnabled = !isEnabled;
		toggleLinting(editor.document, diagnosticsCollection, isEnabled);
	});
	context.subscriptions.push(disposableToggleLinting);

	let debounceTimeout: NodeJS.Timeout | undefined = undefined;
	vscode.workspace.onDidSaveTextDocument(() => {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			const editor = getEditor(false, isEnabled);
			if (!editor) return;
			diagnose(editor.document, diagnosticsCollection, false);
		}, 500);
	});

	// Only once on activation. Diagnose all open documents.
	vscode.workspace.textDocuments.forEach((document) => {
		if (document.languageId !== 'latex' && document.languageId !== 'markdown') return;
		diagnose(document, diagnosticsCollection, false);
	});

	vscode.workspace.onDidOpenTextDocument((document) => {
		if (document.languageId !== 'latex' && document.languageId !== 'markdown') return;
		diagnose(document, diagnosticsCollection, false);
	});
}

export function deactivate() {
	console.log('"latexlint" is now deactivated.');
}
