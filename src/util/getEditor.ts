import * as vscode from 'vscode';

export default function getEditor(showMessage: boolean, isEnabled: boolean): vscode.TextEditor | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        if (showMessage) vscode.window.showErrorMessage('No active editor. Open a LaTeX or Markdown file and try again.');
        return null;
    }
    if (editor.document.languageId !== 'latex' && editor.document.languageId !== 'markdown') {
        if (showMessage) vscode.window.showErrorMessage('This command is only available for LaTeX and Markdown files.');
        return null;
    }
    if (!isEnabled) {
        if (showMessage) vscode.window.showErrorMessage("Linting is off. Click the 'L' button on the Editor Toolbar to enable it.");
        return null;
    }
    return editor;
}
