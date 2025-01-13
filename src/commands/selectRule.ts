import * as vscode from 'vscode';
import { LLCodeStrings } from '../util/constants';

export default async function selectRules() {
    const config = vscode.workspace.getConfiguration('latexlint');
    const currentConfig = config.get<string[]>('config') || [];

    const quickPick = vscode.window.createQuickPick();
    quickPick.canSelectMany = true;
    quickPick.placeholder = 'Type to search...';
    quickPick.title = 'Select the rules you want to enable.';
    quickPick.items = LLCodeStrings.map(label => ({ label }));
    quickPick.selectedItems = quickPick.items.filter(item => !currentConfig.includes(item.label));

    quickPick.onDidAccept(async () => {
        const selectedLabels = new Set(quickPick.selectedItems.map(item => item.label));
        const unselectedItems = quickPick.items.filter(item => !selectedLabels.has(item.label)).map(item => item.label);
        await config.update('config', unselectedItems, vscode.ConfigurationTarget.Workspace);
        vscode.window.showInformationMessage('The rules have been updated.');
        quickPick.hide();
    });

    quickPick.show();
}