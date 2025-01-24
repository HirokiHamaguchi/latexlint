import * as vscode from 'vscode';
import addRule from './commands/addRule';
import askWolframAlpha from './commands/askWolframAlpha';
import diagnose from './commands/diagnose';
import registerException from './commands/registerException';
import renameCommand from './commands/renameCommand';
import selectRules from './commands/selectRules';
import toggleLinting from './commands/toggleLinting';
import { extensionDisplayName } from './util/constants';
import getEditor from './util/getEditor';

export function activate(context: vscode.ExtensionContext) {
	console.log('"latexlint" is now activated.');

	let isEnabled = true;

	const diagnosticsCollection = vscode.languages.createDiagnosticCollection(extensionDisplayName);
	context.subscriptions.push(diagnosticsCollection);

	const disposableAddLLRule = vscode.commands.registerCommand('latexlint.addRule', () => {
		addRule(isEnabled, diagnosticsCollection);
	});
	context.subscriptions.push(disposableAddLLRule);

	const disposableAskWolframAlpha = vscode.commands.registerCommand('latexlint.askWolframAlpha', askWolframAlpha);
	context.subscriptions.push(disposableAskWolframAlpha);

	const disposableDiagnose = vscode.commands.registerCommand('latexlint.diagnose', () => {
		const editor = getEditor(true, isEnabled);
		if (!editor) return;
		diagnose(editor.document, diagnosticsCollection, true);
	});
	context.subscriptions.push(disposableDiagnose);

	const disposableRegisterException = vscode.commands.registerCommand('latexlint.registerException', () => {
		registerException(isEnabled, diagnosticsCollection);
	});
	context.subscriptions.push(disposableRegisterException);

	const disposableSelectRules = vscode.commands.registerCommand('latexlint.selectRules', selectRules);
	context.subscriptions.push(disposableSelectRules);

	const disposableRenameCommand = vscode.commands.registerCommand('latexlint.renameCommand', renameCommand);
	context.subscriptions.push(disposableRenameCommand);

	const disposableToggleLinting = vscode.commands.registerCommand('latexlint.toggleLinting', () => {
		isEnabled = toggleLinting(diagnosticsCollection, isEnabled);
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
		if (isEnabled) diagnose(document, diagnosticsCollection, false);
	});

	vscode.workspace.onDidOpenTextDocument((document) => {
		if (document.languageId !== 'latex' && document.languageId !== 'markdown') return;
		if (isEnabled) diagnose(document, diagnosticsCollection, false);
	});

	vscode.workspace.onDidCloseTextDocument((document) => {
		diagnosticsCollection.delete(document.uri);
	});
}

export function deactivate() {
	console.log('"latexlint" is now deactivated.');
}
