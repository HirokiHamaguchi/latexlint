import * as vscode from 'vscode';

export default function match2range(doc: vscode.TextDocument, match: RegExpExecArray, delta?: number): vscode.Range {
    const startPos = doc.positionAt((delta || 0) + match.index);
    const endPos = doc.positionAt((delta || 0) + match.index + match[0].length);
    return new vscode.Range(startPos, endPos);
}
