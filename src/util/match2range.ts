import * as vscode from 'vscode';

export default function match2range(doc: vscode.TextDocument, match: RegExpExecArray): vscode.Range {
    const startPos = doc.positionAt(match.index);
    const endPos = doc.positionAt(match.index + match[0].length);
    return new vscode.Range(startPos, endPos);
}