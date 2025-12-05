import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { JAPANESE_SPACE_REGEX } from '../util/japaneseSpaceRegex';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLJapaneseSpace(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLJapaneseSpace",
        JAPANESE_SPACE_REGEX,
    );
}
