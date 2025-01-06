import * as vscode from 'vscode';

export default function hide(diagnosticCollection: vscode.DiagnosticCollection) {
    diagnosticCollection.clear();
}
