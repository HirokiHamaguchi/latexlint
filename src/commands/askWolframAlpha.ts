import * as vscode from 'vscode';

export default function askWolframAlpha(editor: vscode.TextEditor) {
    let selection = editor.document.getText(editor.selection);
    if (!selection) {
        vscode.window.showErrorMessage('No text selected');
        return;
    }
    for (const [command, replaced] of [["qty", ""], ["left", ""], ["right", ""], ["dd", "d"]])
        selection = selection.replace(new RegExp(`\\\\${command}(?![a-zA-Z])`, 'g'), replaced);
    // https://github.com/microsoft/vscode/issues/85930#issuecomment-1364571443
    // @ts-ignore
    vscode.env.openExternal("https://www.wolframalpha.com/input/?i=" + encodeURIComponent(selection));
}
