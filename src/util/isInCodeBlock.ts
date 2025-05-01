import * as vscode from 'vscode';

let lastDocUri: string | undefined;
let lastCodeBlockRanges: vscode.Range[] | undefined;

function computeCodeBlockRanges(doc: vscode.TextDocument): vscode.Range[] {
    let ranges: vscode.Range[] = [];
    let currentStart: number | undefined = undefined;
    for (let i = 0; i < doc.lineCount; i++) {
        const lineText = doc.lineAt(i).text.trim();
        if (!lineText.startsWith('```')) continue;
        if (currentStart === undefined)
            currentStart = i;
        else {
            ranges.push(new vscode.Range(
                new vscode.Position(currentStart, 0),
                new vscode.Position(i, doc.lineAt(i).text.length)
            ));
            currentStart = undefined;
        }
    }
    // If there's an unmatched fence, treat the block as extending to the end of the document.
    if (currentStart !== undefined)
        ranges.push(new vscode.Range(
            new vscode.Position(currentStart, 0),
            new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length)
        ));
    return ranges;
}

export default function isInCodeBlock(
    doc: vscode.TextDocument,
    range: vscode.Range
): boolean {
    const currentDocUri = doc.uri.toString();
    let codeBlockRanges = lastCodeBlockRanges;
    if (currentDocUri !== lastDocUri || codeBlockRanges === undefined) {
        codeBlockRanges = computeCodeBlockRanges(doc);
        lastDocUri = currentDocUri;
        lastCodeBlockRanges = codeBlockRanges;
    }

    const targetLine = range.start.line;
    for (const block of codeBlockRanges) {
        const startLine = block.start.line;
        const endLine = block.end.line;
        if (startLine <= targetLine && targetLine <= endLine)
            return true;
    }
    return false;
}