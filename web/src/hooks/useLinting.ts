import type * as Monaco from 'monaco-editor';
import { useCallback, useRef, useState } from 'react';
import { DocType, LintingState } from '../types';
import { lintLatex } from '../utils';

export function useLinting() {
    const [lintingState, setLintingState] = useState<LintingState>('idle');
    const [diagnostics, setDiagnostics] = useState<Monaco.editor.IMarkerData[]>([]);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
            }, 100);
        }
    }, []);

    const runLintWithDelay = useCallback((text: string, docType: DocType, delay = 500) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            runLint(text, docType, true);
        }, delay);
    }, [runLint]);

    return {
        lintingState,
        diagnostics,
        runLint,
        runLintWithDelay,
    };
}
