import * as vscode from 'vscode';
import addRule from './commands/addRule';
import askWolframAlpha from './commands/askWolframAlpha';
import diagnose from './commands/diagnose';
import registerException from './commands/registerException';
import renameCommand from './commands/renameCommand';
import selectRules from './commands/selectRules';
import toggleLinting from './commands/toggleLinting';
import showCommands from './commands/showCommands';
import { extensionDisplayName } from './util/constants';
import getEditor from './util/getEditor';
import detailsFoldingRangeProvider from './util/detailsFoldingRangeProvider';

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

	const disposableShowCommands = vscode.commands.registerCommand('latexlint.showCommands', showCommands);
	context.subscriptions.push(disposableShowCommands);

	// For md files. Folding ranges for details.
	context.subscriptions.push(vscode.languages.registerFoldingRangeProvider("markdown", new detailsFoldingRangeProvider()));

	// Only once on activation. Diagnose all open documents.
	vscode.workspace.textDocuments.forEach((document) => {
		if (document.languageId !== 'latex' && document.languageId !== 'markdown') return;
		if (isEnabled) diagnose(document, diagnosticsCollection, false);
	});

	// Register events.
	let debounceTimeout: NodeJS.Timeout | undefined = undefined;
	vscode.workspace.onDidSaveTextDocument(() => {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			const editor = getEditor(false, isEnabled);
			if (!editor) return;
			diagnose(editor.document, diagnosticsCollection, false);
		}, 500);
	});
	vscode.workspace.onDidSaveNotebookDocument((notebook) => {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			if (notebook.cellCount === 0) return;
			const cellDoc = notebook.cellAt(0).document;
			diagnose(cellDoc, diagnosticsCollection, false);
		}, 500);
	});

	// vscode.workspace.onDidCloseTextDocument and
	// vscode.workspace.onDidCloseNotebookDocument
	// will not work as expected. Thus, we use the following event.
	vscode.window.onDidChangeVisibleTextEditors(() => {
		const validURIs = [];
		for (const editor of vscode.window.visibleTextEditors)
			if (editor.document.languageId === 'latex' || editor.document.languageId === 'markdown') validURIs.push(editor.document.uri);
		for (const [uri, _] of diagnosticsCollection) {
			if (uri.scheme !== 'file') continue;
			if (!validURIs.includes(uri)) diagnosticsCollection.delete(uri);
		}
		for (const editor of vscode.window.visibleTextEditors)
			diagnose(editor.document, diagnosticsCollection, false);
	});

	vscode.window.onDidChangeVisibleNotebookEditors(() => {
		const validCellURIs = [];
		for (const editor of vscode.window.visibleNotebookEditors)
			for (const cell of editor.notebook.getCells())
				if (cell.document.languageId === 'markdown') validCellURIs.push(cell.document.uri);
		for (const [uri, _] of diagnosticsCollection) {
			if (uri.scheme !== 'vscode-notebook-cell') continue;
			if (!validCellURIs.includes(uri)) diagnosticsCollection.delete(uri);
		}
		for (const editor of vscode.window.visibleNotebookEditors) {
			if (editor.notebook.cellCount === 0) continue;
			const cellDoc = editor.notebook.cellAt(0).document;
			diagnose(cellDoc, diagnosticsCollection, false);
		}
	});
}

export function deactivate() {
	console.log('"latexlint" is now deactivated.');
}
