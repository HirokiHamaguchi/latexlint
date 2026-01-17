import * as vscode from 'vscode';
import createLLTextVSCode from '../LLText/createLLTextVSCode';
import detectMathSpace from '../util/detectMathSpace';
import getEditor from '../util/getEditor';

export default async function fixJapaneseSpaceCommand() {
    const editor = getEditor(true, true);
    if (!editor) return;

    const document = editor.document;
    const [txt, _diagnostics] = createLLTextVSCode(document);

    const ranges = detectMathSpace(document, txt, 'ja');
    if (ranges.length === 0) {
        vscode.window.showInformationMessage('No Japanese spacing issues found.');
        return;
    }

    await editor.edit(editBuilder => {
        for (let i = ranges.length - 1; i >= 0; i--) {
            const range = ranges[i];
            const matchText = document.getText(range);

            let replacement: string;
            if (matchText.startsWith('$'))
                replacement = `$ ${matchText.slice(1)}`;
            else if (matchText.endsWith('$'))
                replacement = `${matchText.slice(0, -1)} $`;
            else {
                console.assert(false, 'Unexpected match that does not start or end with $.');
                continue;
            }

            editBuilder.replace(range, replacement);
        }
    });

    vscode.window.showInformationMessage(`Fixed ${ranges.length} Japanese spacing issue(s).`);
}
