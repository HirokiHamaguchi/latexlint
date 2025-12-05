import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { checkUsageError } from "../TextLint/usage_error";
import ranges2diagnostics from "../util/ranges2diagnostics";

export default function LLTextLint(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (!txt.text.trim()) return [];

    // Skip if no Japanese hiragana characters are found
    if (!/[ぁ-ん]/.test(txt.text)) return [];

    const messages: string[] = [];
    const ranges: vscode.Range[] = [];
    for (const error of checkUsageError(txt.text)) {
        messages.push(error.message);
        ranges.push(new vscode.Range(doc.positionAt(error.startOffset), doc.positionAt(error.endOffset)));
    }

    return ranges2diagnostics(
        "LLTextLint",
        messages,
        ranges
    );
}
