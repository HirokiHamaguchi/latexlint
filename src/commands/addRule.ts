import * as vscode from 'vscode';
import diagnose from './diagnose';
import getEditor from '../util/getEditor';

export default async function addRule(isEnabled: boolean, diagnosticsCollection: vscode.DiagnosticCollection) {
    const editor = getEditor(true, isEnabled);
    if (!editor) return;

    const selected = editor.document.getText(editor.selection);

    const selection = await vscode.window.showQuickPick(
        ['string', 'Regex'],
        { placeHolder: 'Do you want to add a string or a regex rule?' }
    );
    if (!selection) return;

    const rule = await vscode.window.showInputBox({
        title: `Enter the ${selection} you want to add to the rules.`,
        value: selected ?? '',
    });
    if (!rule) return;

    let regexRule;
    if (selection === 'Regex') {
        try {
            new RegExp(rule);
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Invalid regex rule: ${msg}`);
            return;
        }
        regexRule = rule;
    } else  // https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
        regexRule = rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const config = vscode.workspace.getConfiguration('latexlint').get<string[]>('userDefinedRules') || [];
    if (config.includes(regexRule)) {
        vscode.window.showErrorMessage(`The rule '${regexRule}' already exists.`);
        return;
    }

    config.push(regexRule);
    await vscode.workspace.getConfiguration('latexlint').update('userDefinedRules', config, vscode.ConfigurationTarget.Workspace);
    vscode.window.showInformationMessage(`Your rule '${regexRule}' has been added.`);

    diagnose(editor.document, diagnosticsCollection, true);
}
