import * as vscode from 'vscode';
import diagnose from './diagnose';
import getEditor from '../util/getEditor';
import formatException from '../util/formatException';

export default async function registerException(isEnabled: boolean, diagnosticsCollection: vscode.DiagnosticCollection) {
    const editor = getEditor(true, isEnabled);
    if (!editor) return;

    let selected = editor.document.getText(editor.selection);
    selected = formatException(selected);

    let exception = await vscode.window.showInputBox({
        title: "Enter the exception you want to add",
        value: selected ?? '',
    });
    if (!exception) return;
    exception = formatException(exception);

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
