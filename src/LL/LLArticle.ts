import * as vscode from "vscode";
import type { LLText } from "../LLText/LLText";
import { messages } from "../util/constants";
import ranges2diagnostics from "../util/ranges2diagnostics";

const LETTERS_WITH_VOWEL_SOUND = new Set([
  "a",
  "e",
  "f",
  "h",
  "i",
  "l",
  "m",
  "n",
  "o",
  "r",
  "s",
  "x",
]);

function isWrongArticle(article: string, content: string): boolean {
  const normalizedArticle = article.toLowerCase();

  // 1. Split at first ^ or _
  const match = content.match(/^([^_^]*)([_^].*)?$/);
  if (!match) return false;

  let main = match[1];
  const suffix = match[2];

  // 2. Validate suffix if exists (must be single char or command)
  if (suffix) {
    const rest = suffix.slice(1); // remove ^ or _
    if (
      !/^.$/.test(rest) &&          // single character
      !/^\\[a-zA-Z]+$/.test(rest) && // command like \alpha
      !/^\{[^}]*\}$/.test(rest)     // or grouped {...}
    )
      return false;
  }

  // 3. Extract the "spoken" leading unit
  let target: string | null = null;

  // Case: plain single character
  if (main.length === 1)
    target = main.toLowerCase();

  // Case: \ell
  if (main === "\\ell")
    target = "l";

  // Case: font commands like \mathbb{X}
  const fontMatch = main.match(
    /^\\(mathbb|mathcal|mathrm|mathbf)\{([^}]+)\}$/
  );
  if (fontMatch) {
    const inner = fontMatch[2];
    if (inner.length !== 1 && inner !== "\\ell") return false;
    target = inner === "\\ell" ? "l" : inner.toLowerCase();
  }

  if (!target) return false;

  // 4. Determine correct article
  if (LETTERS_WITH_VOWEL_SOUND.has(target))
    return normalizedArticle === "a";
  else if ("a" <= target && target <= "z" || "A" <= target && target <= "Z")
    return normalizedArticle === "an";
  return false;
}

const ABBREVIATION_SET = new Set([
  "EM",
  "EVD",
  "FFT",
  "NP",
  "LSTM",
  "LTI",
  "MLE",
  "MSE",
  "ODE",
  "RNN",
  "RKHS",
  "SDE",
  "SVD",
  "SVM",
  "XOR",
]);

const ARTICLE_TARGET_REGEX = /\b([Aa](?:n)?) (\$|\\\(|[A-Z])/g;

export default function LLArticle(
  doc: vscode.TextDocument,
  txt: LLText
): vscode.Diagnostic[] {
  const code = "LLArticle";
  const messageTemplate = messages[code];

  const message: string[] = [];
  const ranges: vscode.Range[] = [];

  for (const match of txt.text.matchAll(ARTICLE_TARGET_REGEX)) {
    if (!txt.isValid(match.index)) continue;
    const article = match[1];
    const target = match[2];

    const startIdx = match.index + article.length + 1;
    let wordEndIdx = -1;
    if (target === "$" || target === "\\(") {
      const endIdx = txt.text.indexOf(target === "$" ? "$" : "\\)", startIdx + target.length);
      if (endIdx === -1) continue;
      const content = txt.text.substring(startIdx + target.length, endIdx);
      if (!isWrongArticle(article, content)) continue;
      wordEndIdx = endIdx + target.length;
    } else {
      // Currently, we only check the "a" cases
      if (!LETTERS_WITH_VOWEL_SOUND.has(target.toLowerCase())) continue;
      if (article !== "a" && article !== "A") continue;
      let endIdx = startIdx + 1;
      while (endIdx < txt.text.length && "A" <= txt.text[endIdx] && txt.text[endIdx] <= "Z")
        endIdx++;
      const content = txt.text.substring(startIdx, endIdx);
      if (!ABBREVIATION_SET.has(content)) continue;
      wordEndIdx = endIdx;
    }

    const word = txt.text.substring(startIdx, wordEndIdx);
    let correctArticle = "a";
    if (article === "a")
      correctArticle = "an";
    else if (article === "an")
      correctArticle = "a";
    else if (article === "A")
      correctArticle = "An";
    else if (article === "An")
      correctArticle = "A";
    else {
      console.error(`Unexpected article: ${article}`);
      continue;
    }

    message.push(messageTemplate.replace("%1", word).replace("%2", correctArticle).replace("%3", article));
    const startPos = doc.positionAt(match.index);
    const endPos = doc.positionAt(wordEndIdx);
    ranges.push(new vscode.Range(startPos, endPos));
  }

  return ranges2diagnostics(code, message, ranges);
}
