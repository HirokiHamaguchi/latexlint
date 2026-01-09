import * as vscode from "vscode";
import enumerateDiagnostics from "../util/enumerateDiagnostics";

export default function diagnose(
  doc: vscode.TextDocument,
  diagnosticCollection: vscode.DiagnosticCollection,
  showMessage: boolean
) {
  console.log(`Diagnosing ${doc.uri.toString()}`);
  const diagnostics = enumerateDiagnostics(doc);
  diagnosticCollection.set(doc.uri, diagnostics);
  const num = diagnostics.length;

  if (!showMessage) return;
  const path = vscode.workspace.asRelativePath(doc.uri);
  if (num === 1)
    vscode.window.showInformationMessage(`Found ${num} problem of ${path}.`);
  else if (num > 1)
    vscode.window.showInformationMessage(`Found ${num} problems of ${path}.`);
  else vscode.window.showInformationMessage(`No Problem found for ${path}.`);
}
