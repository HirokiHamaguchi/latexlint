/**
 * Simple error interface used by check functions before conversion to Diagnostic
 */
export interface LLTextLintErrorResult {
    startOffset: number;
    endOffset: number;
    message: string;
    code: string;
}