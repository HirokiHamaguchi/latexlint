import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLUserDefined(doc: vscode.TextDocument): vscode.Diagnostic[] {
    let userDefinedRules = vscode.workspace.getConfiguration('latexlint').get('userDefinedRules') as string[];

    const diagnostics: vscode.Diagnostic[] = [];
    for (let rule of userDefinedRules) {
        let regex;
        try {
            regex = new RegExp(rule, 'g');
        } catch (e) {
            vscode.window.showErrorMessage(`'${rule}' in userDefinedRules is invalid. Please check the regex in the settings.json.`);
            continue;
        }
        diagnostics.push(...regex2diagnostics(doc, "LLUserDefined", regex));
    }
    return diagnostics;
}
