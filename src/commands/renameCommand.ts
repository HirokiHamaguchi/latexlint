import * as vscode from 'vscode';
import findModifyTargets from './findModifyTargets';

export default async function renameCommand() {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        console.log('No active text editor.');
        return;
    }

    const res = findModifyTargets(editor);
    if (res === undefined) {
        console.log('No changes were made.');
        return;
    }

    const newText = await vscode.window.showInputBox({
        title: 'Enter the new argument for the command.',
        value: res.originalText,
    });
    if (newText === undefined) return;


    const updatedText = res.s1 + newText + res.s2 + newText + res.s3;
    await editor.edit((editBuilder) => {
        editBuilder.replace(
            new vscode.Range(
                new vscode.Position(0, 0),
                editor.document.lineAt(editor.document.lineCount - 1).range.end
            ),
            updatedText
        );
    });

    let cursorPos = res.cursorPos + res.newTextCountForCursor * newText.length;
    editor.selection = new vscode.Selection(
        editor.document.positionAt(cursorPos),
        editor.document.positionAt(cursorPos)
    );
}