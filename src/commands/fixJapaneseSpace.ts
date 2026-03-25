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

    // Calculate all replacements
    const replacements: Array<{ range: vscode.Range; replacement: string }> = [];
    for (const range of ranges) {
        const matchText = document.getText(range);

        let replacement: string;
        if (matchText.startsWith('$'))
            replacement = `$ ${matchText[1]}`;
        else if (matchText.endsWith('$'))
            replacement = `${matchText[0]} $`;
        else if (matchText.startsWith('\\('))
            replacement = `\\( ${matchText[2]}`;
        else if (matchText.endsWith('\\)'))
            replacement = `${matchText[0]} \\)`;
        else {
            console.assert(false, 'Unexpected match: ' + matchText);
            continue;
        }
        replacements.push({ range, replacement });
    }

    // Build the modified text
    let modifiedText = document.getText();
    for (const { range, replacement } of replacements) {
        console.log(`Replacing "${document.getText(range)}" with "${replacement}" at range ${range.start.line}:${range.start.character} - ${range.end.line}:${range.end.character}`);
        const startOffset = document.offsetAt(range.start);
        const endOffset = document.offsetAt(range.end);
        modifiedText = modifiedText.slice(0, startOffset) + replacement + modifiedText.slice(endOffset);
    }

    // Show diff and ask for confirmation
    const shouldApply = await showDiffAndConfirm(
        document.uri,
        modifiedText,
        'Fix Japanese Spacing'
    );

    if (shouldApply) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        for (let i = replacements.length - 1; i >= 0; i--) {
            const { range, replacement } = replacements[i];
            workspaceEdit.replace(document.uri, range, replacement);
        }

        const applied = await vscode.workspace.applyEdit(workspaceEdit);
        if (!applied) {
            vscode.window.showErrorMessage('Failed to apply Japanese spacing fixes.');
            return;
        }

        vscode.window.showInformationMessage(`Fixed ${replacements.length} Japanese spacing issue(s).`);
    } else
        vscode.window.showInformationMessage('Fix Japanese spacing canceled.');
}
