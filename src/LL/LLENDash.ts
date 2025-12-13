import * as vscode from "vscode";
import isLabelOrURL from "../LLText/isLabelOrURL";
import type { LLText } from "../LLText/LLText";
import { messages } from "../util/constants";
import match2range from "../util/match2range";
import ranges2diagnostics from "../util/ranges2diagnostics";
import { wordSet } from "../util/wordSet";

const okWords = ["Fritz-John", "Levi-Civita", "Primal-Dual", "Zig-Zag"];

export default function LLENDash(
  doc: vscode.TextDocument,
  txt: LLText
): vscode.Diagnostic[] {
  const ranges: vscode.Range[] = [];

  for (const match of txt.text.matchAll(
    /[A-Z][a-zA-Z]*[a-z](?:-[A-Z][a-zA-Z]*[a-z])+/g
  )) {
    if (okWords.includes(match[0])) continue;
    const words = match[0].split("-");
    if (words.every((word) => wordSet.has(word.toLowerCase()))) continue;
    if (words.some((word) => word.length === 1)) continue;
    if (isLabelOrURL(txt.text, match)) continue;

    // Check if this is likely a person's name (e.g., "Tim Berners-Lee")
    // Pattern: unknown capitalized word + space + match
    const i = match.index;
    if (i && i > 0 && /\s/.test(txt.text[i - 1])) {
      let k = i - 2;
      while (k >= 0 && /[a-zA-Z]/.test(txt.text[k])) k--;
      const precedingWord = txt.text.slice(k + 1, i - 1);
      if (precedingWord.length > 1 && !wordSet.has(precedingWord.toLowerCase()))
        continue;
    }

    ranges.push(match2range(doc, match));
  }

  const code = "LLENDash";
  const message = messages[code];
  return ranges2diagnostics(code, message, ranges);
}
