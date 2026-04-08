import * as vscode from "vscode";
import { extensionDisplayName } from "../util/constants";
import computeValidRanges from "./computeValidRanges";
import type { LLText } from "./LLText";

export default function createLLText(
    text: string,
    languageId: string,
    diagnostics: vscode.Diagnostic[],
    computeLinePos: (index: number) => { line: number; character: number }
): LLText {
    const validRanges = computeValidRanges(text, languageId);
    const disabledLines = computeDisabledLines(text, languageId);
    const alignLikeEnvs = enumAlignEnvs(
        text,
        diagnostics,
        validRanges,
        computeLinePos
    );
    const idxOfBeginDocument = text.indexOf("\\begin{document}");
    return {
        text: text,
        disabledLines: disabledLines,
        alignLikeEnvs: alignLikeEnvs,
        validRanges: validRanges,
        idxOfBeginDocument: idxOfBeginDocument,
        isValid: (idx: number) => isPositionValid(idx, validRanges),
        isPreamble: (idx: number) => idxOfBeginDocument !== -1 && idx < idxOfBeginDocument,
    };
}

function computeDisabledLines(text: string, languageId: string): number[] {
    const lines = text.split(/\r?\n/);
    const disabledLines: number[] = [];
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++)
        if (isDisableDirectiveLine(lines[lineNumber], languageId)) disabledLines.push(lineNumber);
    return disabledLines;
}

function isDisableDirectiveLine(line: string, languageId: string): boolean {
    if (languageId === "latex") return /%\s*LLDisable/.test(line);
    if (languageId === "markdown") return /<!--\s*LLDisable/.test(line);
    return false;
}

function isPositionValid(idx: number, validRanges: [number, number][]) {
    for (const [start, end] of validRanges) {
        if (end < idx) continue;
        if (start <= idx && idx <= end) return true;
        if (idx < start) return false;
    }
    return false;
}

const alignLikeEnvs = [
    "align",
    "alignat",
    "aligned",
    "split", // No problem with LLAlignEnd
    "gather",
    // ignore `eqnarray` because we have LLEqnarray
];

const alignLikeEnvCommandRegexSource =
    "\\\\(begin|end)\\{(" +
    alignLikeEnvs.slice().sort((a, b) => b.length - a.length).join("|") +
    ")(\\*?)\\}";

const alignLikeEnvDeltas: Record<string, number> = {};
for (let i = 0; i < alignLikeEnvs.length; i++)
    alignLikeEnvDeltas[alignLikeEnvs[i]] = 2 * i + 1;

// Extract all \begin{align} and \end{align} commands
function enumAlignEnvs(
    txt: string,
    diagnostics: vscode.Diagnostic[],
    validRanges: [number, number][],
    computeLinePos: (index: number) => { line: number; character: number }
): [number, number][] {
    const envCommandRegex = new RegExp(alignLikeEnvCommandRegexSource, "g");
    const cmdPairs: Array<{ index: number; delta: number; depth: number }> = [];

    for (const match of txt.matchAll(envCommandRegex)) {
        if (match.index === undefined) continue;
        if (!isPositionValid(match.index, validRanges)) continue;
        const env = match[2];
        const deltaBase = alignLikeEnvDeltas[env];
        const delta = (match[1] === "begin" ? 1 : -1) *
            (deltaBase + (match[3] === "*" ? 1 : 0));
        cmdPairs.push({ index: match.index, delta, depth: 0 });
    }
    cmdPairs.sort((a, b) => a.index - b.index);

    // Check if the commands are properly coupled
    const STs: [number, number][] = [];
    const stack: Array<{ index: number; delta: number; depth: number }> = [];
    let isMatched = -1;
    for (const pair of cmdPairs)
        if (pair.delta > 0) stack.push(pair);
        else {
            const top = stack.pop();
            if (top === undefined || top.delta + pair.delta !== 0) {
                isMatched = pair.index;
                break;
            } else STs.push([top.index, pair.index]);
        }

    if (isMatched !== -1 || stack.length !== 0) {
        const errorIndex = isMatched !== -1 ? isMatched : stack[0].index;
        const { line, character } = computeLinePos(errorIndex);
        const position = new vscode.Position(line, character);
        const range = new vscode.Range(position, position);
        diagnostics.push({
            message:
                "Unmatched alignment environment commands" +
                ` at Line ${line + 1}, Character ${character + 1}. ` +
                "Are the commands properly paired?",
            range: range,
            severity: vscode.DiagnosticSeverity.Error,
            source: extensionDisplayName,
        });
        return [];
    }
    return STs;
}
