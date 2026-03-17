import type * as vscode from "vscode";

export default function filterDisabledLineDiagnostics(
    sortedDiagnostics: vscode.Diagnostic[],
    sortedDisabledLines: number[]
): vscode.Diagnostic[] {
    if (sortedDiagnostics.length === 0 || sortedDisabledLines.length === 0)
        return sortedDiagnostics;

    const filteredDiagnostics: vscode.Diagnostic[] = [];
    let i = 0;
    for (const diag of sortedDiagnostics) {
        const line = diag.range.start.line;
        while (i < sortedDisabledLines.length && sortedDisabledLines[i] < line)
            i += 1;
        if (i < sortedDisabledLines.length && sortedDisabledLines[i] === line)
            continue;
        filteredDiagnostics.push(diag);
    }
    return filteredDiagnostics;
}
