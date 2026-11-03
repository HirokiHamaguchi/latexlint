import type * as vscode from 'vscode';
import { lintDocument } from '../util/lintWithPerformanceTracking';
import { fixJapaneseSpace } from '../util/fixJapaneseSpace';
import { createDocument } from './vscode';
import type { Configuration } from './config';

export function ruleName(diagnostic: vscode.Diagnostic): string {
    const code = diagnostic.code;
    // Alignment parser diagnostics predate named rules and have no code.
    return String(typeof code === 'object' ? code.value : code ?? 'LLParse');
}

export function diagnose(text: string, languageId: string, config: Configuration): vscode.Diagnostic[] {
    return lintDocument({
        doc: createDocument(text, languageId),
        disabledRules: config.disabledRules,
        exceptions: config.exceptions,
        getConfigValue: key => config[key as keyof Configuration]
    }).diagnostics;
}

export function fix(text: string, languageId: string, diagnostics: vscode.Diagnostic[]): string {
    // Only surviving diagnostics are fixable: LLDisable and exception matching
    // have already been applied by the same pipeline as the VS Code diagnostics.
    return fixJapaneseSpace(createDocument(text, languageId), diagnostics
        .filter(diagnostic => ruleName(diagnostic) === 'LLSpaceJapanese')
        .map(diagnostic => diagnostic.range)).text;
}
