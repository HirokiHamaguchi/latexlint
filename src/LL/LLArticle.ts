import * as vscode from "vscode";
import type { LLText } from "../LLText/LLText";
import { messages } from "../util/constants";
import ranges2diagnostics from "../util/ranges2diagnostics";

export default function LLArticle(
  doc: vscode.TextDocument,
  txt: LLText
): vscode.Diagnostic[] {
  const code = "LLArticle";
  let message: string[] = [];
  let ranges: vscode.Range[] = [];
  for (const match of txt.text.matchAll(/\b([Aa]) (?:\$n\$|\\\(n\\\))/g)) {
    if (!txt.isValid(match.index)) continue;
    const article = match[1];
    const replacement = article === "a" ? "an" : "An";
    message.push(messages[code].replaceAll("%1", replacement));
    // [Aa] の部分のみを range にする
    const startPos = doc.positionAt(match.index);
    const endPos = doc.positionAt(match.index + 1);
    ranges.push(new vscode.Range(startPos, endPos));
  }
  return ranges2diagnostics(code, message, ranges);
}
