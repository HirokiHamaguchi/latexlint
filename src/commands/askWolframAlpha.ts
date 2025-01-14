import * as vscode from 'vscode';
import getEditor from '../util/getEditor';

export function askWolframAlphaLogic(selection: string) {
    for (const [command, replaced] of [["qty", ""], ["left", ""], ["right", ""], ["dd", "d"]])
        selection = selection.replace(new RegExp(`\\\\${command}(?![a-zA-Z])`, 'g'), replaced);
    return selection;
}

export default function askWolframAlpha() {
    const editor = getEditor(true, true);
    if (!editor) return;

    let selection = editor.document.getText(editor.selection);
    if (!selection) {
        vscode.window.showErrorMessage('No text selected');
        return;
    }
    selection = askWolframAlphaLogic(selection);
    // https://github.com/microsoft/vscode/issues/85930#issuecomment-1364571443
    // @ts-ignore
    vscode.env.openExternal("https://www.wolframalpha.com/input/?i=" + encodeURIComponent(selection));
}
