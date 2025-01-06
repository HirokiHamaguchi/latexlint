import * as vscode from 'vscode';
import diagnose from './diagnose';

export default function toggleLinting(diagnosticCollection: vscode.DiagnosticCollection) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    if (activeEditor.document.languageId !== 'latex' && activeEditor.document.languageId !== 'markdown') {
        vscode.window.showErrorMessage('Active editor is not a LaTeX or Markdown file.');
        return;
    }
    const uri = activeEditor.document.uri;
    const diagnostics = diagnosticCollection.get(uri);
    if (diagnostics === undefined) {
        vscode.window.showInformationMessage('No diagnostics found.');
        return;
    }
    const path = vscode.workspace.asRelativePath(uri);
    if (diagnostics.length > 0) {
        diagnosticCollection.delete(uri);
        vscode.window.showInformationMessage(`Hide the problems of ${path}.`);
    } else {
        diagnose(diagnosticCollection);
        const newDiagnostics = diagnosticCollection.get(uri);
        if (newDiagnostics === undefined) {
            vscode.window.showErrorMessage('No diagnostics found.');
            return;
        }
        if (newDiagnostics.length === 1)
            vscode.window.showInformationMessage(`Found ${newDiagnostics.length} problem of ${path}.`);
        else if (newDiagnostics.length > 1)
            vscode.window.showInformationMessage(`Found ${newDiagnostics.length} problems of ${path}.`);
        else
            vscode.window.showInformationMessage(`No Problem found for ${path}.`);
    }
}
