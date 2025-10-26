import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';
import { JAPANESE_SPACE_REGEX } from '../util/japaneseSpaceRegex';

export default function LLJapaneseSpace(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLJapaneseSpace",
        JAPANESE_SPACE_REGEX,
    );
}
