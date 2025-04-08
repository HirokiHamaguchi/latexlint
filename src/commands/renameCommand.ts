import * as vscode from 'vscode';
import findModifyTargets from '../util/findModifyTargets';
import getEditor from '../util/getEditor';


export default async function renameCommand() {
    const editor = getEditor(true, true);
    if (!editor) return;

    if (editor.selections.length !== 1 || editor.selection.start.line !== editor.selection.end.line) {
        vscode.window.showErrorMessage('Only select the content in \\begin{...} or \\end{...} to rename.');
        return;
    }

    const doc = editor.document;
    const res = findModifyTargets(editor.selection, doc);
    if (res === undefined) return;

    let candidate = res.originalText;
    console.log(candidate);
    if (candidate === "equation") candidate = "align";
    else if (candidate === "equation*") candidate = "align*";
    else if (candidate === "align") candidate = "equation";
    else if (candidate === "align*") candidate = "equation*";

    const newText = await vscode.window.showInputBox({
        title: 'Enter the new argument for the command.',
        value: candidate,
    });
    if (newText === undefined) return;

    if ((res.originalText === "align" && newText === "equation") ||
        (res.originalText === "align*" && newText === "equation*"))
        res.s2 = res.s2.replace(/&/g, ' ').replace(/\\\\/g, '  ');

    // todo in-place edition
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
