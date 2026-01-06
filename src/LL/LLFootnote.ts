import * as vscode from "vscode";
import type { LLText } from "../LLText/LLText";
import { messages } from "../util/constants";
import match2range from "../util/match2range";
import ranges2diagnostics from "../util/ranges2diagnostics";

export default function LLFootnote(
  doc: vscode.TextDocument,
  txt: LLText
): vscode.Diagnostic[] {
  if (doc.languageId !== "latex") return [];

  const code = "LLFootnote";
  let message: string[] = [];
  let ranges: vscode.Range[] = [];

  for (const match of txt.text.matchAll(/\\footnote{/g)) {
    if (!txt.isValid(match.index)) continue;

    let idx = match.index - 1;
    const char = txt.text[idx];

    // If non-whitespace found, stop - not a violation
    if (/\S/.test(char)) continue;

    let suggestion = "";

    // If whitespace is not a newline, it's a violation
    if (char !== "\n") suggestion = "removing the space.";

    while (idx >= 0 && suggestion === "") {
      // Get the line before the newline
      let lineStart = idx;
      while (lineStart > 0 && txt.text[lineStart - 1] !== "\n") lineStart--;
      const line = txt.text.substring(lineStart, idx);

      // If line is empty, it's a violation
      if (line.trim() === "") {
        suggestion = "adding % at the end of the previous line.";
        break;
      }

      // Check character before % in the line
      let commentIdx = line.indexOf("%");
      if (commentIdx === -1) {
        // No comment on this line, so it's a violation
        suggestion = "adding % at the end of the previous line.";
        break;
      }

      // If entire line is a comment, go back one more line
      if (commentIdx === 0) {
        idx = lineStart - 1;
        continue;
      }

      // If whitespace before %, it's a violation
      if (/\s/.test(line[commentIdx - 1])) suggestion = "removing the space.";
      break;
    }

    if (suggestion !== "") {
      message.push(messages[code].replace("%1", suggestion));
      ranges.push(match2range(doc, match));
    }
  }

  return ranges2diagnostics(code, message, ranges);
}
