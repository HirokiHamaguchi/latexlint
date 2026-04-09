import * as vscode from 'vscode';
import createLLTextVSCode from '../LLText/createLLTextVSCode';
import detectMathSpace from '../util/detectMathSpace';
import getEditor from '../util/getEditor';
import showDiffAndConfirm from '../util/showDiffAndConfirm';

export default async function fixJapaneseSpaceCommand() {
    const editor = getEditor(true, true);
    if (!editor) return;

    const document = editor.document;
    const [txt, _diagnostics] = createLLTextVSCode(document);

    const ranges = detectMathSpace(document, txt);
    if (ranges.length === 0) {
        vscode.window.showInformationMessage('No Japanese spacing issues found.');
        return;
    }

    // Convert ranges into insertion offsets so overlapping matches are handled safely.
    const insertOffsets = new Set<number>();
    for (const range of ranges) {
        const matchText = document.getText(range);
        if (matchText.includes('$'))
            insertOffsets.add(document.offsetAt(range.start) + 1);
        else if (matchText.endsWith('\\('))
            insertOffsets.add(document.offsetAt(range.start) + 1);
        else if (matchText.startsWith('\\)'))
            insertOffsets.add(document.offsetAt(range.start) + 2);
        else {
            console.assert(false, 'Unexpected match: ' + matchText);
            continue;
        }
    }

    // Build modified text in one pass to avoid repeated full-string copies.
    const originalText = document.getText();
    const sortedOffsets = [...insertOffsets].sort((a, b) => a - b);
    const chunks: string[] = [];
    let cursor = 0;

    for (const offset of sortedOffsets) {
        chunks.push(originalText.slice(cursor, offset));
        if (originalText[offset] !== ' ') chunks.push(' ');
        cursor = offset;
    }
    chunks.push(originalText.slice(cursor));
    const modifiedText = chunks.join('');


    // Show diff and ask for confirmation
    const shouldApply = await showDiffAndConfirm(
        document.uri,
        modifiedText,
        'Fix Japanese Spacing'
    );

    if (shouldApply) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
        workspaceEdit.replace(document.uri, fullRange, modifiedText);

        const applied = await vscode.workspace.applyEdit(workspaceEdit);
        if (!applied) {
            vscode.window.showErrorMessage('Failed to apply Japanese spacing fixes.');
            return;
        }

        vscode.window.showInformationMessage(`Fixed ${insertOffsets.size} Japanese spacing issue(s).`);
    } else
        vscode.window.showInformationMessage('Fix Japanese spacing canceled.');
}
