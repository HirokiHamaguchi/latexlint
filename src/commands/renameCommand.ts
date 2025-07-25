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

    // Store whether we need to handle align to equation conversion
    const needsAlignConversion = (res.originalText === "align" && newText === "equation") ||
        (res.originalText === "align*" && newText === "equation*");

    // In-place edition: replace only the specific command names
    await editor.edit((editBuilder) => {
        // Find positions of the original text occurrences
        const firstOccurrenceStart = res.s1.length;
        const firstOccurrenceEnd = firstOccurrenceStart + res.originalText.length;

        const secondOccurrenceStart = res.s1.length + res.originalText.length + res.s2.length;
        const secondOccurrenceEnd = secondOccurrenceStart + res.originalText.length;

        // Replace the second occurrence first (to avoid offset issues)
        const pos2Start = doc.positionAt(secondOccurrenceStart);
        const pos2End = doc.positionAt(secondOccurrenceEnd);
        editBuilder.replace(new vscode.Range(pos2Start, pos2End), newText);

        // Replace the first occurrence
        const pos1Start = doc.positionAt(firstOccurrenceStart);
        const pos1End = doc.positionAt(firstOccurrenceEnd);
        editBuilder.replace(new vscode.Range(pos1Start, pos1End), newText);

        // Handle align to equation conversion (replace & and \\ in the content between begin and end)
        if (needsAlignConversion) {
            const contentStart = doc.positionAt(firstOccurrenceEnd);
            const contentEnd = doc.positionAt(secondOccurrenceStart);
            const originalContent = doc.getText(new vscode.Range(contentStart, contentEnd));
            const modifiedContent = originalContent.replace(/&/g, ' ').replace(/\\\\/g, '  ');
            if (originalContent !== modifiedContent)
                editBuilder.replace(new vscode.Range(contentStart, contentEnd), modifiedContent);
        }
    });

    let cursorPos = res.cursorPos + res.newTextCountForCursor * newText.length;
    const pos = doc.positionAt(cursorPos);
    editor.selection = new vscode.Selection(pos, pos);
}
