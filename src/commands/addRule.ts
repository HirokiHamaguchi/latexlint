import * as vscode from 'vscode';
import diagnose from './diagnose';

export default async function addRule(editor: vscode.TextEditor, diagnosticsCollection: vscode.DiagnosticCollection) {
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
            vscode.window.showErrorMessage('Invalid regex rule. Please try again.');
            return;
        }
        regexRule = rule;
    } else  // https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
        regexRule = rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const config = vscode.workspace.getConfiguration('latexlint').get('userDefinedRules') as string[];
    if (config === undefined) {
        vscode.window.showErrorMessage('Bug: Could not find userDefinedRules in the configuration.');
        return;
    }
    config.push(regexRule);
    await vscode.workspace.getConfiguration('latexlint').update('userDefinedRules', config, vscode.ConfigurationTarget.Workspace);
    vscode.window.showInformationMessage(`Your rule '${regexRule}' has been added.`);

    diagnose(editor.document, diagnosticsCollection, true);
}
