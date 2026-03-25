import type * as Monaco from 'monaco-editor';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DocType, LintingState } from '../types';
import { lintLatex } from '../utils';

const LINT_COMPLETE_DELAY_MS = 100;
const INPUT_LINT_DELAY_MS = 500;

export function useLinting() {
    const [lintingState, setLintingState] = useState<LintingState>('idle');
    const [diagnostics, setDiagnostics] = useState<Monaco.editor.IMarkerData[]>([]);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearLintTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const runLint = useCallback(async (inputText: string, type: DocType, forceTextLint: boolean) => {
        if (!inputText.trim()) {
            setDiagnostics([]);
            setLintingState('complete');
            return;
        }
        setLintingState('linting');
        try {
            const results = await lintLatex(inputText, type, forceTextLint);
            setDiagnostics(results);
        } catch (error) {
            console.error('Linting error:', error);
            setDiagnostics([]);
        } finally {
            setTimeout(() => {
                setLintingState('complete');
            }, LINT_COMPLETE_DELAY_MS);
        }
    }, []);

    const runLintWithDelay = useCallback((text: string, docType: DocType, delay = INPUT_LINT_DELAY_MS) => {
        clearLintTimeout();
        timeoutRef.current = setTimeout(() => {
            runLint(text, docType, true);
        }, delay);
    }, [clearLintTimeout, runLint]);

    useEffect(() => {
        return clearLintTimeout;
    }, [clearLintTimeout]);

    return {
        lintingState,
        diagnostics,
        runLint,
        runLintWithDelay,
    };
}
