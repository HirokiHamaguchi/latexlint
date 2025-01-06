import * as vscode from 'vscode';
import enumerateDiagnostics from './enumerateDiagnostics';

export default function diagnose(diagnosticCollection: vscode.DiagnosticCollection) {
    const doc = vscode.window.activeTextEditor?.document;
    if (!doc) return;
    if (doc.languageId !== 'latex' && doc.languageId !== 'markdown') return;
    const diagnostics = enumerateDiagnostics(doc);
    diagnosticCollection.set(doc.uri, diagnostics);
}
