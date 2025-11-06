/**
 * Re-export types from vscode-mock for MyTextLint
 */
import type { Diagnostic, DiagnosticSeverity, Range, Position } from '../vscode-mock';

export type { Diagnostic, DiagnosticSeverity, Range, Position };

/**
 * Simple error interface used by check functions before conversion to Diagnostic
 */
export interface MyTextLintErrorResult {
    startOffset: number;
    endOffset: number;
    message: string;
    code: string;
}