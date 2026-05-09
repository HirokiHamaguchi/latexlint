import * as vscode from "vscode";
import type { LLText } from "../LLText/LLText";
import { messages } from "../util/constants";
import ranges2diagnostics from "../util/ranges2diagnostics";

export default function LLFootnote(
  doc: vscode.TextDocument,
  txt: LLText
): vscode.Diagnostic[] {
  if (doc.languageId !== "latex") return [];

  const code = "LLFootnote";
  let ranges: vscode.Range[] = [];
  let localMessages: string[] = [];

  for (const match of txt.text.matchAll(/\s\\footnote{/g)) {
    if (txt.isPreamble(match.index)) continue;
    if (!txt.isValid(match.index)) continue;

    let lineEnd = match.index + 1;
    let isProblematic = false;
    let message = messages[code];

    let lineStart = lineEnd;
    while (lineStart > 0 && txt.text[lineStart - 1] !== "\n") lineStart--;
    const firstLine = txt.text.substring(lineStart, lineEnd);
    if (firstLine.match(/\S/))
      isProblematic = true;
    else
      while (lineEnd > 0) { // to ensure the decreasing of lineEnd
        lineEnd = lineStart;
        lineStart = lineEnd - 1;
        while (lineStart > 0 && txt.text[lineStart - 1] !== "\n") lineStart--;
        if (lineStart === 0) break;
        const line = txt.text.substring(lineStart, lineEnd);
        console.log({ line });
        const commentIdx = line.indexOf("%");
        console.log({ commentIdx });
        if (commentIdx === -1) {
          isProblematic = true;
          message += " Adding % at the end of the line before the footnote can prevent this issue.";
          break;
        } else {
          const lineValid = txt.text.substring(lineStart, lineStart + commentIdx);
          const SMatches = [...lineValid.matchAll(/\S/g)];
          if (SMatches.length === 0) continue;
          const lastSIdx = SMatches[SMatches.length - 1].index;
          if (lastSIdx !== undefined && lastSIdx + 1 === commentIdx)
            isProblematic = false;
          else
            isProblematic = true;
          break;
        }
      }

    if (isProblematic) {
      // remove the first \s
      const startPos = doc.positionAt(match.index + 1);
      const endPos = doc.positionAt(match.index + match[0].length);
      ranges.push(new vscode.Range(startPos, endPos));
      localMessages.push(message);
    }
  }

  return ranges2diagnostics(code, localMessages, ranges);
}
