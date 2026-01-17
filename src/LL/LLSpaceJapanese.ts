import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import detectMathSpace from '../util/detectMathSpace';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLSpaceJapanese(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = "LLSpaceJapanese";
    const ranges = detectMathSpace(doc, txt, "ja");
    return ranges2diagnostics(code, messages[code], ranges);
}
