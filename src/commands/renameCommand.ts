import * as vscode from 'vscode';
import findModifyTargets from '../util/findModifyTargets';

export default async function renameCommand(editor: vscode.TextEditor) {
    if (editor.selections.length !== 1 || editor.selection.start.line !== editor.selection.end.line) {
        vscode.window.showErrorMessage('Only select the content in \\begin{...} or \\end{...} to rename.');
        return undefined;
    }

    const doc = editor.document;
    const res = findModifyTargets(editor.selection, doc);
    if (res === undefined) return;


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
                doc.lineAt(doc.lineCount - 1).range.end
            ),
            updatedText
        );
    });

    let cursorPos = res.cursorPos + res.newTextCountForCursor * newText.length;
    const pos = doc.positionAt(cursorPos);
    editor.selection = new vscode.Selection(pos, pos);
}
