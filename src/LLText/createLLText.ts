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
  const alignLikeEnvs = enumAlignEnvs(
    text,
    diagnostics,
    validRanges,
    computeLinePos
  );
  return {
    text: text,
    alignLikeEnvs: alignLikeEnvs,
    validRanges: validRanges,
    isValid: (idx: number) => isPositionValid(idx, validRanges),
  };
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

// Extract all \begin{align} and \end{align} commands
function enumAlignEnvs(
  txt: string,
  diagnostics: vscode.Diagnostic[],
  validRanges: [number, number][],
  computeLinePos: (index: number) => { line: number; character: number }
): [number, number][] {
  const regexAndDeltas = [];
  for (let i = 0; i < alignLikeEnvs.length; i++) {
    const env = alignLikeEnvs[i];
    regexAndDeltas.push({
      regex: new RegExp(`\\\\begin\\{${env}\\}`, "g"),
      delta: +(2 * i + 1),
    });
    regexAndDeltas.push({
      regex: new RegExp(`\\\\begin\\{${env}\\*\\}`, "g"),
      delta: +(2 * i + 2),
    });
    regexAndDeltas.push({
      regex: new RegExp(`\\\\end\\{${env}\\}`, "g"),
      delta: -(2 * i + 1),
    });
    regexAndDeltas.push({
      regex: new RegExp(`\\\\end\\{${env}\\*\\}`, "g"),
      delta: -(2 * i + 2),
    });
  }

  let cmdPairs = [];
  for (const { regex, delta } of regexAndDeltas)
    for (const match of txt.matchAll(regex)) {
      if (!isPositionValid(match.index, validRanges)) continue;
      cmdPairs.push({ index: match.index, delta, depth: 0 });
    }
  cmdPairs.sort((a, b) => a.index - b.index);

  // Check if the commands are properly coupled
  const STs: [number, number][] = [];
  const stack = [];
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
