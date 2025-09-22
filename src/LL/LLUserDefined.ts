import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';


export default function LLUserDefined(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    let userDefinedRules = vscode.workspace.getConfiguration('latexlint').get<string[]>('userDefinedRules') || [];
    if (!userDefinedRules) return [];

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
        for (const match of txt.matchAll(regex)) {
            message.push(messages[code].replaceAll("%1", regex.source));
            ranges.push(match2range(doc, match));
        }
        diagnostics.push(...ranges2diagnostics(doc, code, message, ranges));
    }
    return diagnostics;
}
