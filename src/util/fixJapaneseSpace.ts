import type * as vscode from 'vscode';

/** Share insertion handling while callers choose which ranges are eligible. */
export function fixJapaneseSpace(
    document: Pick<vscode.TextDocument, 'getText' | 'offsetAt'>,
    ranges: readonly vscode.Range[]
): { text: string; count: number } {
    const insertOffsets = new Set<number>();
    for (const range of ranges) {
        const matchText = document.getText(range);
        if (matchText.includes('$') || matchText.endsWith('\\('))
            insertOffsets.add(document.offsetAt(range.start) + 1);
        else if (matchText.startsWith('\\)'))
            insertOffsets.add(document.offsetAt(range.start) + 2);
        else throw new Error('Unexpected Japanese spacing match: ' + matchText);
    }

    // Deduplicate overlapping matches, then copy the source only once.
    const originalText = document.getText();
    const chunks: string[] = [];
    let cursor = 0;
    let count = 0;
    for (const offset of [...insertOffsets].sort((a, b) => a - b)) {
        chunks.push(originalText.slice(cursor, offset));
        if (originalText[offset] !== ' ') {
            chunks.push(' ');
            count++;
        }
        cursor = offset;
    }
    chunks.push(originalText.slice(cursor));
    return { text: chunks.join(''), count };
}
