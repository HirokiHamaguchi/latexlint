import * as vscode from 'vscode';
import { checkUsageError } from "../TextLint/usage_error";
import ranges2diagnostics from "../util/ranges2diagnostics";

export default function LLTextLint(doc: vscode.TextDocument, text: string): vscode.Diagnostic[] {
    if (!text.trim()) return [];

    try {
        const messages: string[] = [];
        const ranges: vscode.Range[] = [];
        for (const error of checkUsageError(text)) {
            messages.push(error.message);
            ranges.push(new vscode.Range(doc.positionAt(error.startOffset), doc.positionAt(error.endOffset)));
        }

        return ranges2diagnostics(
            doc,
            "LLTextLint",
            messages,
            ranges
        );

    } catch (error) {
        console.error('LLTextLint error:', error);
        return [];
    }
}

