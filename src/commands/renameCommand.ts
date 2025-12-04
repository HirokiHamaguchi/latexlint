import * as vscode from 'vscode';
import findBeginEndTargets, { BeginEndResult } from '../util/findBeginEndTargets';
import findLabelTargets, { LabelResult } from '../util/findLabelTargets';
import getEditor from '../util/getEditor';


async function handleBeginEndRename(doc: vscode.TextDocument, editor: vscode.TextEditor, res: BeginEndResult) {
    let candidate = res.originalText;
    if (candidate === "equation") candidate = "align";
    else if (candidate === "equation*") candidate = "align*";
    else if (candidate === "align") candidate = "equation";
    else if (candidate === "align*") candidate = "equation*";

    const newText = await vscode.window.showInputBox({
        title: 'Enter the new argument for the command.', value: candidate,
    });
    if (newText === undefined) return;

    // Store whether we need to handle align to equation conversion
    const needsAlignConversion = (res.originalText === "align" || res.originalText === "align*") &&
        (newText === "equation" || newText === "equation*");

    // In-place edition: replace only the specific command names
    await editor.edit((editBuilder) => {
        editBuilder.replace(
            new vscode.Range(doc.positionAt(res.secondWordStart), doc.positionAt(res.secondWordEnd)),
            newText
        );

        if (needsAlignConversion) {
            const contentStart = doc.positionAt(res.firstWordEnd);
            const contentEnd = doc.positionAt(res.secondWordStart);
            const originalContent = doc.getText(new vscode.Range(contentStart, contentEnd));
            const modifiedContent = originalContent.replace(/&/g, ' ').replace(/\\\\/g, '  ');
            if (originalContent !== modifiedContent)
                editBuilder.replace(new vscode.Range(contentStart, contentEnd), modifiedContent);
        }

        editBuilder.replace(
            new vscode.Range(doc.positionAt(res.firstWordStart), doc.positionAt(res.firstWordEnd)),
            newText
        );

    });

    let cursorPos = res.cursorPos + res.newTextCountForCursor * newText.length;
    const pos = doc.positionAt(cursorPos);
    editor.selection = new vscode.Selection(pos, pos);
}

async function handleLabelRename(doc: vscode.TextDocument, editor: vscode.TextEditor, res: LabelResult) {
    const text = doc.getText();

    // Extract the current label text (without braces)
    const currentLabel = res.originalText.slice(1, -1); // Remove { and }

    const newLabel = await vscode.window.showInputBox({
        title: 'Enter the new label name.',
        value: currentLabel,
    });
    if (newLabel === undefined) return;
    if (text.includes(`\\label{${newLabel}}`)) {
        vscode.window.showWarningMessage(`Label "${newLabel}" already exists.`);
        return;
    }

    // Find all occurrences of {currentLabel} in the document
    const regex = new RegExp(`\\{${currentLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}`, 'g');
    const matches = Array.from(text.matchAll(regex));

    if (matches.length === 0) {
        vscode.window.showWarningMessage('No occurrences of the label found.');
        return;
    }

    // Replace all occurrences (from end to start to avoid offset issues)
    await editor.edit((editBuilder) => {
        for (let i = matches.length - 1; i >= 0; i--) {
            const match = matches[i];
            if (match.index !== undefined) {
                const startPos = doc.positionAt(match.index);
                const endPos = doc.positionAt(match.index + match[0].length);
                editBuilder.replace(new vscode.Range(startPos, endPos), `{${newLabel}}`);
            }
        }
    });

    // Show information about how many replacements were made
    if (matches.length === 1)
        vscode.window.showInformationMessage(`Renamed the only occurrence of label "${currentLabel}" to "${newLabel}".`);
    else
        vscode.window.showInformationMessage(`Replaced ${matches.length} occurrences of label "${currentLabel}" with "${newLabel}".`);
}

export default async function renameCommand() {
    const editor = getEditor(true, true);
    if (!editor) return;

    if (editor.selections.length !== 1 || editor.selection.start.line !== editor.selection.end.line) {
        vscode.window.showErrorMessage('Only select the content in \\begin{...}, \\end{...}, or \\label{...} to rename.');
        return;
    }

    const doc = editor.document;
    const selection = editor.selection;
    const activePosition = selection.active;

    // Common validation and data extraction
    if (doc.lineAt(activePosition).text.trim().startsWith('%')) {
        vscode.window.showErrorMessage('The cursor line is commented out.');
        return;
    }

    const text = doc.getText();
    const cursorOffset = doc.offsetAt(activePosition);

    const resLabel = findLabelTargets(text, cursorOffset);
    if (resLabel !== undefined) {
        await handleLabelRename(doc, editor, resLabel);
        return;
    }

    const resBE = findBeginEndTargets(text, cursorOffset);
    if (resBE !== undefined) {
        await handleBeginEndRename(doc, editor, resBE);
        return;
    }

    // If neither label nor begin-end target was found, show an error
    vscode.window.showErrorMessage('Could not detect a valid \\begin{...}, \\end{...}, or \\label{...} command at the cursor position.');
}
