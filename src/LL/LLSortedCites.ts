import * as vscode from "vscode";
import type { LLText } from "../LLText/LLText";
import { messages } from "../util/constants";
import match2range from "../util/match2range";
import ranges2diagnostics from "../util/ranges2diagnostics";

export default function LLSortedCites(
  doc: vscode.TextDocument,
  txt: LLText
): vscode.Diagnostic[] {
  if (doc.languageId !== "latex") return [];

  const bibtexMatches = [...txt.text.matchAll(/\\bibliography\{/g)];
  let firstMatch: RegExpMatchArray | undefined;
  for (const match of bibtexMatches) {
    const idx = match.index;
    if (idx !== null && txt.isValid(idx)) {
      firstMatch = match;
      break;
    }
  }
  if (!firstMatch) return [];

  const natbibMatches = [
    ...txt.text.matchAll(/\\usepackage(\[[^\]]*\])?\{natbib\}/g),
  ];
  if (natbibMatches.length === 0) return [];

  let hasNatbibSort = false;
  for (const match of natbibMatches) {
    const idx = match.index;
    if (idx === null || !txt.isValid(idx)) continue;
    const options = match[1];
    if (!options) continue;
    if (options.includes("sort")) hasNatbibSort = true;
  }
  if (hasNatbibSort) return [];

  const citePackagePattern = /\\usepackage(\[[^\]]*\])?\{cite\}/;
  const biblatexPattern = /\\usepackage(\[[^\]]*\])?\{biblatex\}/;
  if (citePackagePattern.test(txt.text) || biblatexPattern.test(txt.text))
    return [];

  const range = match2range(doc, firstMatch as RegExpExecArray);
  const message = messages["LLSortedCites"];
  return ranges2diagnostics("LLSortedCites", [message], [range]);
}
