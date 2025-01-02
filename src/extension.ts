// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import findModifyTargets from './commands/renameCommand';
import lintLatex from './commands/lintLatex';
import { extensionDisplayName } from './constants';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('"latexlint" is now activated.');

	const disposableRenameCommand = vscode.commands.registerCommand('latexlint.renameCommand', findModifyTargets);
	context.subscriptions.push(disposableRenameCommand);

	const diagnosticCollection = vscode.languages.createDiagnosticCollection(extensionDisplayName);
	context.subscriptions.push(diagnosticCollection);

	const disposableLintLatex = vscode.commands.registerCommand('latexlint.lintLatex', () => lintLatex(diagnosticCollection));
	context.subscriptions.push(disposableLintLatex);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('"latexlint" is now deactivated.');
}
