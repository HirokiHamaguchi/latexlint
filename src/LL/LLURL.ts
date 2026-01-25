import * as vscode from "vscode";
import type { LLText } from "../LLText/LLText";
import { messages } from "../util/constants";
import match2range from "../util/match2range";
import ranges2diagnostics from "../util/ranges2diagnostics";

export default function LLURL(
  doc: vscode.TextDocument,
  txt: LLText
): vscode.Diagnostic[] {
  const code = "LLURL";
  let message: string[] = [];
  let ranges: vscode.Range[] = [];
  for (const match of txt.text.matchAll(
    /\?(utm_[^&=\s]*|sessionid)=/gi
  )) {
    if (!txt.isValid(match.index)) continue;
    message.push(messages[code].replaceAll("%1", match[1]));
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}
