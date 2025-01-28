import * as vscode from 'vscode';

function getRanges(doc: vscode.TextDocument, text: string): vscode.FoldingRange[] {
    const lines = [];
    const ranges: vscode.FoldingRange[] = [];

    for (const match of text.matchAll(/<details>|<\/details>/g)) {
        const line = doc.positionAt(match.index).line;
        if (match[0] === '<details>')
            lines.push(line);
        else {
            const startLine = lines.pop();
            if (startLine !== undefined) ranges.push(new vscode.FoldingRange(startLine, line));
        }
    }

    return ranges;
}

export default class detailsFoldingRangeProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(doc: vscode.TextDocument): vscode.FoldingRange[] {
        const text = doc.getText();
        return getRanges(doc, text);
    }
}