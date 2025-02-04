import * as vscode from 'vscode';
import enumerateDiagnostics from '../util/enumerateDiagnostics';

export default function diagnose(
    doc: vscode.TextDocument,
    diagnosticCollection: vscode.DiagnosticCollection,
    showMessage: boolean
) {
    let num = 0;

    if (vscode.window.activeNotebookEditor) {
        const cells = vscode.window.activeNotebookEditor.notebook.getCells();
        for (const cell of cells) {
            if (cell.document.languageId !== 'markdown') continue;
            const diags = enumerateDiagnostics(cell.document);
            diagnosticCollection.set(cell.document.uri, diags);
            num += diags.length;
        }
    } else {
        const diagnostics = enumerateDiagnostics(doc);
        diagnosticCollection.set(doc.uri, diagnostics);
        num += diagnostics.length;
    }

    if (!showMessage) return;
    const path = vscode.workspace.asRelativePath(doc.uri);
    if (num === 1)
        vscode.window.showInformationMessage(`Found ${num} problem of ${path}.`);
    else if (num > 1)
        vscode.window.showInformationMessage(`Found ${num} problems of ${path}.`);
    else
        vscode.window.showInformationMessage(`No Problem found for ${path}.`);
}
