import * as vscode from 'vscode';

export default async function addRule() {
    const doc = vscode.window.activeTextEditor?.document;
    if (!doc) return false;

    if (doc.languageId !== 'latex' && doc.languageId !== 'markdown') {
        vscode.window.showErrorMessage('This command is only available for LaTeX and Markdown files.');
        return;
    }

    const editor = vscode.window.activeTextEditor;
    const selected = editor?.document.getText(editor.selection);

    const selection = await vscode.window.showQuickPick(
        ['string', 'Regex'],
        {
            placeHolder: 'Do you want to add a string or a regex rule?',
        }
    );
    if (!selection) return false;

    const rule = await vscode.window.showInputBox({
        title: `Enter the ${selection} you want to add to the rules.`,
        value: selected ?? '',
    });
    if (!rule) return false;

    let regexRule;
    if (selection === 'Regex') {
        try {
            new RegExp(rule);
        } catch (error) {
            vscode.window.showErrorMessage('Invalid regex rule. Please try again.');
            return false;
        }
        regexRule = rule;
    } else  // https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
        regexRule = rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


    const config = vscode.workspace.getConfiguration('latexlint').get('userDefinedRules') as string[];
    if (config === undefined) {
        vscode.window.showErrorMessage('Bug: Could not find userDefinedRules in the configuration.');
        return false;
    }
    config.push(regexRule);
    vscode.workspace.getConfiguration('latexlint').update('userDefinedRules', config, vscode.ConfigurationTarget.Workspace);
    vscode.window.showInformationMessage(`Your rule '${regexRule}' has been added.`);
    return true;
}
