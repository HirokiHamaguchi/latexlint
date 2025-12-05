import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLUserDefined(doc: vscode.TextDocument, txt: LLText, userDefinedRules: string[]): vscode.Diagnostic[] {
    if (!userDefinedRules || userDefinedRules.length === 0) return [];

    const diagnostics: vscode.Diagnostic[] = [];
    for (let rule of userDefinedRules) {
        let regex;
        try {
            regex = new RegExp(rule, 'g');
        } catch (e) {
            vscode.window.showErrorMessage(`'${rule}' in userDefinedRules is invalid. Please check the regex in the settings.json.`);
            continue;
        }
        const code = "LLUserDefined";
        let message: string[] = [];
        let ranges: vscode.Range[] = [];
        for (const match of txt.text.matchAll(regex)) {
            message.push(messages[code].replaceAll("%1", regex.source));
            ranges.push(match2range(doc, match));
        }
        diagnostics.push(...ranges2diagnostics(code, message, ranges));
    }
    return diagnostics;
}
