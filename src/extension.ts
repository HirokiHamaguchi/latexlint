import * as vscode from 'vscode';
import addRule from './commands/addRule';
import askWolframAlpha from './commands/askWolframAlpha';
import diagnose from './commands/diagnose';
import renameCommand from './commands/renameCommand';
import toggleLinting from './commands/toggleLinting';
import { extensionDisplayName } from './util/constants';
import getEditor from './util/getEditor';
import removeRule from './commands/removeRule';

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

	// Not shown in the command palette
	const disposableRemoveRule = vscode.commands.registerCommand('latexlint.removeRule', removeRule);
	context.subscriptions.push(disposableRemoveRule);

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
		}, 300);
	});

	// context.subscriptions.push(
	// 	vscode.languages.registerCodeActionsProvider(
	// 		{ scheme: 'file', language: 'latex' },
	// 		{
	// 			provideCodeActions: (document, range, context, token) => {
	// 				const editor = getEditor(true, isEnabled);
	// 				if (!editor) return [];
	// 				const actions = [];
	// 				const diagnostics = diagnosticsCollection.get(editor.document.uri);
	// 				if (!diagnostics) return [];
	// 				for (const diagnostic of diagnostics)
	// 					if (diagnostic.range.intersection(range)) {
	// 						const action = new vscode.CodeAction(
	// 							`Suppress "${diagnostic.message}"`,
	// 							vscode.CodeActionKind.QuickFix,
	// 						);
	// 						action.command = {
	// 							command: 'latexlint.addToConfig',
	// 							title: 'Suppress',
	// 							arguments: [editor, diagnostic.range, diagnostic.message],
	// 						};
	// 						actions.push(action);
	// 					}
	// 				return actions;
	// 			},
	// 		},
	// 	));
}

export function deactivate() {
	console.log('"latexlint" is now deactivated.');
}
