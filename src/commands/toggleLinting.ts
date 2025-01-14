import * as vscode from 'vscode';
import diagnose from './diagnose';
import getEditor from '../util/getEditor';

export default function toggleLinting(
    diagnosticCollection: vscode.DiagnosticCollection,
    isEnabled: boolean
) {
    isEnabled = !isEnabled;
    if (!isEnabled) {
        diagnosticCollection.clear();
        vscode.window.showInformationMessage('Disable LaTeX Lint');
        return isEnabled;
    }

    const editor = getEditor(false, true);
    if (!editor) {
        vscode.window.showInformationMessage('Enable LaTeX Lint');
        return isEnabled;
    }

    diagnose(editor.document, diagnosticCollection, true);
    return isEnabled;
}
