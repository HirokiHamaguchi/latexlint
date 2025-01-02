import * as vscode from 'vscode';
import { extensionDisplayName } from '../constants';

function enumerateDiagnostics(doc: vscode.TextDocument): vscode.Diagnostic[] {
    console.log(`Enumerating diagnostics for ${doc.uri}`);
    const diagnostics = [
        {
            code: "ruleName",
            message: 'This is a test message',
            range: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 10)),
            severity: vscode.DiagnosticSeverity.Warning,
            source: extensionDisplayName,
        }

    ];
    return diagnostics;
}

export default function lintLatex(diagnosticCollection: vscode.DiagnosticCollection) {
    for (const doc of vscode.workspace.textDocuments) {
        if (doc.languageId !== 'latex' && doc.languageId !== 'markdown') continue;
        console.log(doc.uri);
        const diagnostics = enumerateDiagnostics(doc);
        diagnosticCollection.set(doc.uri, diagnostics);
    }
}
