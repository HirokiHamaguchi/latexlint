import * as vscode from 'vscode';
import diagnose from './commands/diagnose';
import addRule from './commands/addRule';
import renameCommand from './commands/renameCommand';
import { extensionDisplayName } from './util/constants';

export function activate(context: vscode.ExtensionContext) {
	console.log('"latexlint" is now activated.');

	const disposableRenameCommand = vscode.commands.registerCommand('latexlint.renameCommand', renameCommand);
	context.subscriptions.push(disposableRenameCommand);

	const disposableAddLLRule = vscode.commands.registerCommand('latexlint.addRule', addRule);
	context.subscriptions.push(disposableAddLLRule);

	const diagnosticsCollection = vscode.languages.createDiagnosticCollection(extensionDisplayName);
	context.subscriptions.push(diagnosticsCollection);

	const disposableLintLaTeX = vscode.commands.registerCommand('latexlint.lintLaTeX', () => diagnose(diagnosticsCollection));
	context.subscriptions.push(disposableLintLaTeX);
}

export function deactivate() {
	console.log('"latexlint" is now deactivated.');
}
