import * as vscode from 'vscode';
import createLLTextVSCode from '../LLText/createLLTextVSCode';
import detectMathSpace from '../util/detectMathSpace';
import { fixJapaneseSpace } from '../util/fixJapaneseSpace';
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

    const { text: modifiedText, count } = fixJapaneseSpace(document, ranges);

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

        vscode.window.showInformationMessage(`Fixed ${count} Japanese spacing issue(s).`);
    } else
        vscode.window.showInformationMessage('Fix Japanese spacing canceled.');
}
