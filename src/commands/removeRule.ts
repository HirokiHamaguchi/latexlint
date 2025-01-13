import * as vscode from 'vscode';
import { LLCodeStrings } from '../util/constants';

export default function removeRule(code: string) {
    if (!LLCodeStrings.includes(code)) {
        vscode.window.showErrorMessage(`Invalid rule code: ${code}`);
        return;
    }
    const config = vscode.workspace.getConfiguration('latexlint');
    const currentConfig = config.get<string[]>('config') || [];
    if (!currentConfig.includes(code)) {
        currentConfig.push(code);
        config.update('config', currentConfig, vscode.ConfigurationTarget.Workspace);
        vscode.window.showInformationMessage(`Rule:${code} is now removed`);
    } else
        vscode.window.showInformationMessage(`${code} is already in latexlint.config`);
}