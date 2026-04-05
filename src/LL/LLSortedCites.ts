import * as vscode from "vscode";
import type { LLText } from "../LLText/LLText";
import { messages } from "../util/constants";
import match2range from "../util/match2range";
import ranges2diagnostics from "../util/ranges2diagnostics";

// examples:
// https://arxiv.org/pdf/2509.19112v2
// https://arxiv.org/pdf/2509.23213
// https://arxiv.org/pdf/2511.08548
// https://arxiv.org/pdf/2604.02137v1

export default function LLSortedCites(
  doc: vscode.TextDocument,
  txt: LLText
): vscode.Diagnostic[] {
  if (doc.languageId !== "latex") return [];

  // If cite or biblatex package is used, we assume the user is aware of sorting options and do not report.
  const citePackagePattern = /\\usepackage(\[[^\]]*\])?\{cite\}/;
  const biblatexPattern = /\\usepackage(\[[^\]]*\])?\{biblatex\}/;
  if (citePackagePattern.test(txt.text) || biblatexPattern.test(txt.text))
    return [];

  // Find the first \bibliography{...}
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

  // Check if the bibliography style is one of the target styles
  let hasTargetStyle = false;
  let styleName = "";
  const stylePattern = /\\bibliographystyle\s*\{([^}]*)\}/g;
  const TARGET_STYLES = new Set([
    "plain",
    "unsrt",
    "abbrv",
    "plainnat",
    "unsrtnat",
    "abbrvnat",
  ]);
  for (const match of txt.text.matchAll(stylePattern)) {
    const idx = match.index;
    if (idx !== null && txt.isValid(idx)) {
      styleName = match[1]?.trim() ?? "";
      if (TARGET_STYLES.has(styleName)) {
        hasTargetStyle = true;
        break;
      }
    }
  }
  if (!hasTargetStyle) return [];

  // no natbib -> yes
  // natbib + plain -> yes
  // natbib[numbers] + plain -> yes
  // natbib[numbers] + plainnat -> yes
  // natbib + plainnat -> no (return [])
  // natbib[numbers,sort] + plain -> no (return [])
  // natbib[numbers,sort] + plainnat -> no (return [])
  let haveNatbib = false;
  let hasNatbibSort = false;
  let hasNatbibNumbers = false;
  const natbibPattern = /\\usepackage(\[[^\]]*\])?\{natbib\}/g;
  for (const match of txt.text.matchAll(natbibPattern)) {
    const idx = match.index;
    if (idx === null || !txt.isValid(idx)) continue;
    haveNatbib = true;
    const options = match[1];
    if (!options) continue;
    if (options.includes("sort")) hasNatbibSort = true;
    if (options.includes("numbers")) hasNatbibNumbers = true;
  }
  if (haveNatbib && hasNatbibNumbers && hasNatbibSort) return [];
  if (haveNatbib && !hasNatbibNumbers && styleName.includes("nat")) return [];

  // Check if any \cite{...} contains a comma (heuristic for multiple keys).
  let hasCommaInAnyCiteArgument = false;
  const citePattern = /\\cite\{/g;
  for (const match of txt.text.matchAll(citePattern)) {
    const openBraceIndex = (match.index ?? -1) + match[0].length - 1;
    if (openBraceIndex < 0) continue;
    let closeBraceIndex = openBraceIndex;
    while (closeBraceIndex < txt.text.length && txt.text[closeBraceIndex] !== "}") closeBraceIndex++;
    const content = txt.text.slice(openBraceIndex, closeBraceIndex);
    if (content.includes(",")) {
      hasCommaInAnyCiteArgument = true;
      break;
    }
  }
  if (!hasCommaInAnyCiteArgument) return [];


  const range = match2range(doc, firstMatch as RegExpExecArray);
  const message = messages["LLSortedCites"];
  return ranges2diagnostics("LLSortedCites", [message], [range]);
}
