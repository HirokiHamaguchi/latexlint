import * as vscode from 'vscode';
import { alignRules, standardRules, configuredRules } from './rules';
import formatException from './formatException';
import enumAlignEnvs from './enumAlignEnvs';

export default function enumerateDiagnostics(doc: vscode.TextDocument): vscode.Diagnostic[] {
    const config = vscode.workspace.getConfiguration('latexlint');
    const disabledRules = config.get<string[]>('disabledRules') || [];
    const exceptions = config.get<string[]>('exceptions') || [];
    const txt = doc.getText();
    const alignLikeEnvs = enumAlignEnvs(txt, doc.positionAt, vscode.window.showErrorMessage);

    let diagnostics: vscode.Diagnostic[] = [];

    const t0 = performance.now();

    for (const [ruleName, rule] of Object.entries(alignRules)) {
        if (disabledRules.includes(ruleName)) continue;
        const diags = rule(doc, txt, alignLikeEnvs);
        diagnostics.push(...diags);
    }

    for (const [ruleName, rule] of Object.entries(standardRules)) {
        if (disabledRules.includes(ruleName)) continue;
        const diags = rule(doc, txt);
        diagnostics.push(...diags);
    }

    for (const [ruleName, { rule, configKey }] of Object.entries(configuredRules)) {
        if (disabledRules.includes(ruleName)) continue;
        const diags = rule(doc, txt, config.get(configKey) as string[]);
        diagnostics.push(...diags);
    }

    diagnostics = diagnostics.filter(diag => !exceptions.includes(formatException(doc.getText(diag.range))));

    const t1 = performance.now();

    console.log(`enum took ${(t1 - t0).toFixed(2)} ms`);
    return diagnostics;
}

