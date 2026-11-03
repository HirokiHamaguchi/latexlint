// Public browser entry point; consumers supply their existing vscode adapter.
export { checkNoDroppingI } from './TextLint/no_dropping_i';
export { checkNoDroppingRa } from './TextLint/no_dropping_ra';
export { checkNoSuccessiveWord } from './TextLint/no_successive_word';
export { checkOverlookedTypo } from './TextLint/overlooked_typo';
export { checkTariTari } from './TextLint/tari_tari';
export { getVocabularyData } from './TextLint/vocabulary_loader';
export { default as filterDisabledLineDiagnostics } from './util/filterDisabledLineDiagnostics';
export { default as formatException } from './util/formatException';
export { getCodeWithURI } from './util/getCodeWithURI';
export { displayPerformanceReport, lintWithPerformanceTracking } from './util/lintWithPerformanceTracking';
export type { Token } from './TextLint/parser';
export type { LLTextLintErrorResult } from './TextLint/types';
export type { VocabularyEntry, VocabularyData } from './TextLint/vocabulary_loader';
export type { LintOptions, PerformanceTiming } from './util/lintWithPerformanceTracking';

// Ordinary diagnostics must not require kuromoji or window at import time.
export async function parseSentence(text: string) {
    const parser = await import('./TextLint/parser.js');
    return parser.parseSentence(text);
}
