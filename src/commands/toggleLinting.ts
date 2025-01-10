import * as vscode from 'vscode';
import diagnose from './diagnose';

export default function toggleLinting(
    doc: vscode.TextDocument,
    diagnosticCollection: vscode.DiagnosticCollection,
    isEnabled: boolean
) {
    if (!isEnabled) {
        diagnosticCollection.clear();
        vscode.window.showInformationMessage('Disable LaTeX Lint');
        return;
    }
    diagnose(doc, diagnosticCollection, true);
}
