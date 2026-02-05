import * as os from 'os';
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

async function handleLabelRename(doc: vscode.TextDocument, res: LabelResult) {
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

    // Find all occurrences of currentLabel in the document
    // e.g. \ref{currentLabel}, \eqref{currentLabel}, \cref{anotherLabel,currentLabel}, etc.
    // Thus, we detect iff (\{ or ,) + currentLabel + (,\} or \})
    // https://github.com/mdn/translated-content/blob/2ebf1de429962c5bd3f9c5709fb4ac4d10162d0a/files/ja/web/javascript/guide/regular_expressions/index.md?plain=1#L131
    const escapedLabel = currentLabel.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');

    const labelRegex = new RegExp(`(?<=\\{|,)${escapedLabel}(?=,|\\})`, 'g');
    const matches = Array.from(text.matchAll(labelRegex));
    if (matches.length === 0) {
        vscode.window.showWarningMessage('No occurrences of the label found.');
        return;
    }
    const occurrenceMessage = `"${escapedLabel}" to "${newLabel}" (${matches.length} occurrence${matches.length !== 1 ? 's' : ''})`;

    // Show diff using vscode.diff command
    const leftUri = doc.uri;
    const tempUri = vscode.Uri.joinPath(
        vscode.Uri.file(os.tmpdir()),
        `latexlint-label-rename-${escapedLabel}-${Math.random().toString(36).slice(2)}.tex`
    );

    // Create the modified content
    const modifiedText = text.replace(labelRegex, newLabel);
    const workspaceEdit = new vscode.WorkspaceEdit();
    for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i];
        if (match.index === undefined) continue;
        const startPos = doc.positionAt(match.index);
        const endPos = doc.positionAt(match.index + match[0].length);
        workspaceEdit.replace(doc.uri, new vscode.Range(startPos, endPos), newLabel);
    }

    await vscode.workspace.fs.writeFile(tempUri, Buffer.from(modifiedText));
    await vscode.commands.executeCommand('vscode.diff', leftUri, tempUri, `Label Rename: ${escapedLabel} → ${newLabel}`);

    // Show quick pick for confirmation
    const choice = await vscode.window.showQuickPick(
        ['Apply', 'Cancel'],
        {
            title: `Rename ${occurrenceMessage}?`,
            ignoreFocusOut: true,
        }
    );

    // Close the diff tab and clean up the temp file
    try {
        for (const group of vscode.window.tabGroups.all)
            for (const tab of group.tabs)
                if (tab.input instanceof vscode.TabInputTextDiff)
                    if (tab.input.original.toString() === leftUri.toString() && tab.input.modified.toString() === tempUri.toString())
                        await vscode.window.tabGroups.close(tab, true);
        await vscode.workspace.fs.delete(tempUri, { useTrash: false });
    } catch (e) {
        // Ignore errors during cleanup
        console.error('Error during cleanup of temp files or tabs:', e);
    }

    if (choice === 'Apply') {
        const applied = await vscode.workspace.applyEdit(workspaceEdit);
        if (!applied) {
            vscode.window.showErrorMessage('Failed to apply label rename edits.');
            return;
        }
        vscode.window.showInformationMessage(`Replaced ${occurrenceMessage}.`);
    } else
        vscode.window.showInformationMessage('Label rename canceled.');
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
    if (resLabel.result !== undefined) {
        await handleLabelRename(doc, resLabel.result);
        return;
    } else if (resLabel.message) {
        vscode.window.showErrorMessage(resLabel.message);
        return;
    }

    const resBE = findBeginEndTargets(text, cursorOffset);
    if (resBE.result !== undefined) {
        await handleBeginEndRename(doc, editor, resBE.result);
        return;
    } else if (resBE.message) {
        vscode.window.showErrorMessage(resBE.message);
        return;
    }

    // If neither label nor begin-end target was found, show an error
    vscode.window.showErrorMessage('Could not detect a valid \\begin{...}, \\end{...}, or \\label{...} command at the cursor position.');
}
