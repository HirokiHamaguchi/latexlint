import type * as monaco from 'monaco-editor';

const SEVERITY = {
    ERROR: 8,
    WARNING: 4,
    INFO: 2,
    HINT: 1,
} as const;

export type SeverityKey = 'errors' | 'warnings' | 'info' | 'hints';
export type DiagnosticCounts = Record<SeverityKey, number>;

type SeverityConfigEntry = {
    severity: number;
    color: string;
    label: string;
};

export const SEVERITY_CONFIG: Record<SeverityKey, SeverityConfigEntry> = {
    errors: { severity: SEVERITY.ERROR, color: 'red', label: 'Errors' },
    warnings: { severity: SEVERITY.WARNING, color: 'orange', label: 'Warnings' },
    info: { severity: SEVERITY.INFO, color: 'blue', label: 'Info' },
    hints: { severity: SEVERITY.HINT, color: 'gray', label: 'Hints' },
} as const;

const SEVERITY_TO_KEY = {
    [SEVERITY.ERROR]: 'errors',
    [SEVERITY.WARNING]: 'warnings',
    [SEVERITY.INFO]: 'info',
    [SEVERITY.HINT]: 'hints',
} as const;

export function getDiagnosticCounts(diagnostics: monaco.editor.IMarkerData[]): DiagnosticCounts {
    const counts: DiagnosticCounts = { errors: 0, warnings: 0, info: 0, hints: 0 };
    diagnostics.forEach((diagnostic) => {
        const key = SEVERITY_TO_KEY[diagnostic.severity as keyof typeof SEVERITY_TO_KEY];
        if (key) counts[key]++;
    });
    return counts;
}

export function getDiagnosticColor(counts: DiagnosticCounts): string {
    return Object.entries(SEVERITY_CONFIG)
        .find(([key]) => counts[key as SeverityKey] > 0)
        ?.[1].color ?? 'green';
}

export function sortDiagnostics(diagnostics: monaco.editor.IMarkerData[]) {
    return [...diagnostics].sort((a, b) => {
        if (a.startLineNumber !== b.startLineNumber) {
            return a.startLineNumber - b.startLineNumber;
        }
        return a.startColumn - b.startColumn;
    });
}

export function getRuleId(diagnostic: monaco.editor.IMarkerData): string | undefined {
    if (!diagnostic.code) return undefined;
    if (typeof diagnostic.code === 'string') return diagnostic.code;
    if (typeof diagnostic.code === 'object' && 'value' in diagnostic.code) {
        return diagnostic.code.value as string;
    }

    console.warn('Diagnostic code is not in expected format:', diagnostic.code);
    return undefined;
}

export function getSeverityPresentation(diagnostic: monaco.editor.IMarkerData): SeverityConfigEntry {
    const severityKey = SEVERITY_TO_KEY[diagnostic.severity as keyof typeof SEVERITY_TO_KEY];
    return severityKey ? SEVERITY_CONFIG[severityKey] : SEVERITY_CONFIG.hints;
}
