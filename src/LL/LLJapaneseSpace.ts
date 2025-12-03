import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';
import { JAPANESE_SPACE_REGEX } from '../util/japaneseSpaceRegex';
import type { LLText } from '../util/LLText';

export default function LLJapaneseSpace(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt.text,
        "LLJapaneseSpace",
        JAPANESE_SPACE_REGEX,
    );
}
