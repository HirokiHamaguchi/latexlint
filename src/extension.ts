import * as vscode from 'vscode';
import renameCommand from './commands/renameCommand';
import diagnose from './commands/diagnose';
import { extensionDisplayName } from './util/constants';

export function activate(context: vscode.ExtensionContext) {
	console.log('"latexlint" is now activated.');

	const disposableRenameCommand = vscode.commands.registerCommand('latexlint.renameCommand', renameCommand);
	context.subscriptions.push(disposableRenameCommand);

	const diagnosticsCollection = vscode.languages.createDiagnosticCollection(extensionDisplayName);
	context.subscriptions.push(diagnosticsCollection);

	const disposableLintLaTeX = vscode.commands.registerCommand('latexlint.lintLaTeX', () => diagnose(diagnosticsCollection));
	context.subscriptions.push(disposableLintLaTeX);
}

export function deactivate() {
	console.log('"latexlint" is now deactivated.');
}
