import * as vscode from 'vscode';
import toggleLinting from './commands/toggleLinting';
import diagnose from './commands/diagnose';
import hide from './commands/hide';
import addRule from './commands/addRule';
import renameCommand from './commands/renameCommand';
import { extensionDisplayName } from './util/constants';

export function activate(context: vscode.ExtensionContext) {
	console.log('"latexlint" is now activated.');

	const diagnosticsCollection = vscode.languages.createDiagnosticCollection(extensionDisplayName);
	context.subscriptions.push(diagnosticsCollection);

	const disposableToggleLinting = vscode.commands.registerCommand('latexlint.toggleLinting', () => toggleLinting(diagnosticsCollection));
	context.subscriptions.push(disposableToggleLinting);

	const disposableDiagnose = vscode.commands.registerCommand('latexlint.diagnose', () => diagnose(diagnosticsCollection));
	context.subscriptions.push(disposableDiagnose);

	const disposableHide = vscode.commands.registerCommand('latexlint.hide', () => hide(diagnosticsCollection));
	context.subscriptions.push(disposableHide);

	const disposableAddLLRule = vscode.commands.registerCommand('latexlint.addRule', () => {
		addRule().then((success) => { if (success) diagnose(diagnosticsCollection); });
	});
	context.subscriptions.push(disposableAddLLRule);

	const disposableRenameCommand = vscode.commands.registerCommand('latexlint.renameCommand', renameCommand);
	context.subscriptions.push(disposableRenameCommand);
}

export function deactivate() {
	console.log('"latexlint" is now deactivated.');
}
