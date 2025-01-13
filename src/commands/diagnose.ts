import * as vscode from 'vscode';
import enumerateDiagnostics from '../util/enumerateDiagnostics';

export default function diagnose(
    doc: vscode.TextDocument,
    diagnosticCollection: vscode.DiagnosticCollection,
    showMessage: boolean
) {
    const diagnostics = enumerateDiagnostics(doc);
    diagnosticCollection.set(doc.uri, diagnostics);
    if (!showMessage) return;
    const path = vscode.workspace.asRelativePath(doc.uri);
    if (diagnostics.length === 1)
        vscode.window.showInformationMessage(`Found ${diagnostics.length} problem of ${path}.`);
    else if (diagnostics.length > 1)
        vscode.window.showInformationMessage(`Found ${diagnostics.length} problems of ${path}.`);
    else
        vscode.window.showInformationMessage(`No Problem found for ${path}.`);
}
