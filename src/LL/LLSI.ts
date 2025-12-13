import * as vscode from "vscode";
import type { LLText } from "../LLText/LLText";
import { messages } from "../util/constants";
import ranges2diagnostics from "../util/ranges2diagnostics";

export default function LLSI(
  doc: vscode.TextDocument,
  txt: LLText
): vscode.Diagnostic[] {
  if (doc.languageId !== "latex") return [];

  const ranges: vscode.Range[] = [];

  for (const match of txt.text.matchAll(/B(?![a-zA-Z])/g)) {
    let i = match.index;
    if (
      !/(?:k|K|M|G|T|P|E|Z|Y|Ki|Mi|Gi|Ti|Pi|Ei|Zi|Yi)$/.test(
        txt.text.slice(Math.max(0, i - 2), i)
      )
    )
      continue;

    let i2 =
      txt.text[match.index - 1] === "i" ? match.index - 2 : match.index - 1;
    if (/[a-zA-Z\\]/.test(txt.text[i2 - 1])) continue;

    let is_valid = true;
    while (i > 0 && !/\d/.test(txt.text[i])) {
      // For example, exclude "Royal Purple (108, ..., 132), PB Blaster (110, ...)"
      // This example is taken from openintro-statistics\ch_inference_for_means\TeX\review_exercises.tex
      if (txt.text[i] === ")") is_valid = false;
      i--;
    }
    if (!is_valid) continue;

    // Check if the character before the number is meaningful
    // For example, exclude "*Written on January 7th, 2018 by @10000TB*"
    // This example is taken from sample\arxiv_sources\2508.15096v1\iclr2025_conference.tex
    while (i > 0 && /\d/.test(txt.text[i - 1])) i--;
    if (i > 0) {
      const charBeforeNumber = txt.text[i - 1];
      if (["@", "_", "/", "\\"].includes(charBeforeNumber)) continue;
    }

    // 10KB, $3.5$ MiB, $500 \mathrm{GB}$ are detected
    const j = match.index + 1;
    const match2 = txt.text.slice(i, j).match(/\d\S* ?\S*/);
    if (!match2 || match2[0].length !== j - i) continue;

    const startPos = doc.positionAt(i);
    const endPos = doc.positionAt(j); // translate cannot be used here
    ranges.push(new vscode.Range(startPos, endPos));
  }

  const code = "LLSI";
  const message = messages[code];
  return ranges2diagnostics(code, message, ranges);
}
