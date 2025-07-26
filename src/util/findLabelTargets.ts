import * as vscode from 'vscode';

export type LabelResult = {
    originalText: string;
    labelStart: number;
    labelEnd: number;
};

export default function findLabelTargets(
    text: string,
    cursorOffset: number,
): LabelResult | undefined {
    // Find the backslash before the cursor
    let index = cursorOffset;
    while (index > 0 && text[index - 1] !== '\n' && text[index] !== '\\') index--;
    if (text[index] !== '\\') return undefined;

    // Check if this is a \label{...} command
    if (text.slice(index, index + 6) !== '\\label') return undefined;

    const braceStart = index + 6;
    if (text[braceStart] !== '{') return undefined;

    // Find the closing brace
    let braceEnd = braceStart + 1;
    let braceDepth = 1;
    while (braceEnd < text.length && text[braceEnd] !== '\n') {
        if (text[braceEnd] === '{') braceDepth++;
        if (text[braceEnd] === '}') braceDepth--;
        if (braceDepth === 0) break;
        braceEnd++;
    }
    if (braceDepth !== 0 || text[braceEnd] !== '}') {
        vscode.window.showErrorMessage('Failed to find the closing brace for the label command.');
        return undefined;
    }

    const labelStart = braceStart;
    const labelEnd = braceEnd + 1;
    const originalText = text.substring(labelStart, labelEnd);

    // Check if the cursor is inside the label command
    if (cursorOffset < index || cursorOffset > labelEnd) return undefined;

    return {
        originalText,
        labelStart,
        labelEnd,
    };
}
