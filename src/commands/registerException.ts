import * as vscode from 'vscode';
import diagnose from './diagnose';

export default async function registerException(editor: vscode.TextEditor, diagnosticsCollection: vscode.DiagnosticCollection) {
    const selected = editor.document.getText(editor.selection);

    const exception = await vscode.window.showInputBox({
        title: "Enter the exception you want to add",
        value: selected ?? '',
    });
    console.log(exception);
    if (!exception) return;

    const exceptions = vscode.workspace.getConfiguration('latexlint').get<string[]>('exceptions') || [];
    if (exceptions.includes(exception)) {
        vscode.window.showInformationMessage(`Exception "${exception}" is already registered`);
        return;
    }

    exceptions.push(exception);
    await vscode.workspace.getConfiguration('latexlint').update('exceptions', exceptions, vscode.ConfigurationTarget.Workspace);
    vscode.window.showInformationMessage(`Exception "${exception}" is now registered`);

    diagnose(editor.document, diagnosticsCollection, true);
}
