import * as vscode from 'vscode';
import getEditor from '../util/getEditor';
import { JAPANESE_SPACE_REGEX } from '../util/japaneseSpaceRegex';

export default async function fixJapaneseSpaceCommand() {
    const editor = getEditor(true, true);
    if (!editor) return;

    const document = editor.document;
    const text = document.getText();

    console.assert(JAPANESE_SPACE_REGEX.flags.includes('g'), 'JAPANESE_SPACE_REGEX should have the global flag set.');
    const re = new RegExp(JAPANESE_SPACE_REGEX.source, JAPANESE_SPACE_REGEX.flags);

    const matches = [...text.matchAll(re)];
    if (matches.length === 0) {
        vscode.window.showInformationMessage('No Japanese spacing issues found.');
        return;
    }

    await editor.edit(editBuilder => {
        for (let i = matches.length - 1; i >= 0; i--) {
            const m = matches[i];
            const matchText = m[0];
            const start = m.index ?? 0;
            const end = start + matchText.length;

            let replacement = matchText;
            if (matchText.startsWith('$'))
                replacement = `$ ${matchText.slice(1)}`;
            else if (matchText.endsWith('$'))
                replacement = `${matchText.slice(0, -1)} $`;
            else {
                console.assert(false, 'Unexpected match that does not start or end with $.');
                continue;
            }

            editBuilder.replace(new vscode.Range(document.positionAt(start), document.positionAt(end)), replacement);
        }
    });

    vscode.window.showInformationMessage(`Fixed ${matches.length} Japanese spacing issue(s).`);
}