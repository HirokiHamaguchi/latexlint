import * as vscode from 'vscode';
import type { LLText } from '../util/LLText';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLURL(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc,
        txt.text,
        "LLURL",
        /\?(utm_[^&=]*|sessionid|user|email)=/gi,
    );
}
