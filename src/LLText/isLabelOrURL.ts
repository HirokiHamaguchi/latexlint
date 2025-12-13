const labelKeywords = [
  "fig",
  "tab",
  "ref",
  "cite",
  "cref",
  "eqref",
  "label",
  "input",
  "include",
  "bibitem",
  "bibliography",
  "begin",
  "end",
];

const regexFileExt =
  /\.(?:png|pdf|jpg|jpeg|gif|bmp|eps|svg|tiff|tex|py|cpp|ts|js|bib)/;

export default function isLabelOrURL(txt: string, match: RegExpExecArray) {
  // Find the word that contains the match
  let i = match.index;
  let j = match.index + match[0].length;

  while (i > 1 && !/\s/.test(txt[i - 1])) i--;
  while (j < txt.length - 1 && !/\s/.test(txt[j])) j++;
  const wordShort = txt.slice(i, j);

  // Test if the word is a URL
  if (wordShort.includes("http")) return true;

  // Test if double subscript like x_y_i
  if (/[a-zA-Z]+_[a-zA-Z]+_[a-zA-Z]+/.test(wordShort)) return true;

  while (i > 1 && !/(\n|\$|\\)/.test(txt[i])) i--;
  const word = txt.slice(i, j);

  // Test if the word is for labeling
  const tokens = word.match(/[a-zA-Z]+|[^a-zA-Z]+/g) || [];
  if (tokens.some((token) => isLabelToken(token))) return true;

  // Test if the word is a link to a png, pdf, gif, etc.
  if (regexFileExt.test(word)) return true;

  return false;
}

function isLabelToken(token: string) {
  return (
    token.length > 0 &&
    /[a-zA-Z]/.test(token[0]) &&
    labelKeywords.some(
      (kw) =>
        token.toLowerCase().startsWith(kw) || token.toLowerCase().endsWith(kw)
    )
  );
}
