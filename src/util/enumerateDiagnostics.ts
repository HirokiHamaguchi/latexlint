import * as vscode from 'vscode';
import { createLLText } from '../LLText/createLLText';
import formatException from './formatException';
import { configuredRules, standardRules } from './rules';

export default function enumerateDiagnostics(doc: vscode.TextDocument): vscode.Diagnostic[] {
    const config = vscode.workspace.getConfiguration('latexlint');
    const disabledRules = config.get<string[]>('disabledRules') || [];
    const exceptions = config.get<string[]>('exceptions') || [];
    let diagnostics: vscode.Diagnostic[] = [];

    // Create LLText object with all computed metadata
    const txt = createLLText(doc, diagnostics);

    const t0 = performance.now();

    // Process all standard rules (now includes former align rules)
    for (const [ruleName, rule] of Object.entries(standardRules)) {
        if (disabledRules.includes(ruleName)) continue;
        const diags = rule(doc, txt);
        diagnostics.push(...diags);
    }

    // Process rules that require configuration
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

