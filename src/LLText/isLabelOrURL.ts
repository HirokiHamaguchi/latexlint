export default function isLabelOrURL(txt: string, match: RegExpExecArray) {
  // Find the word that contains the match
  let i = match.index;
  let j = match.index + match[0].length;

  while (i > 1 && !/(\n|\$|\\)/.test(txt[i - 1])) i--;
  while (j < txt.length - 1 && !/\s/.test(txt[j])) j++;
  const word = txt.slice(i, j);

  // Test if the word is a URL
  if (word.includes("http")) return true;

  // Test if the word is for labeling
  const regexLabel =
    /(?:fig|tab|label|ref|cref|eqref|cite|input|include|begin|end|bib)/i;
  if (regexLabel.test(word)) return true;

  // Test if the word is a link to a png, pdf, gif, etc.
  const regexFileExt =
    /\.(?:png|pdf|jpg|jpeg|gif|bmp|eps|svg|tiff|tex|py|cpp|ts|js|bib)/;
  if (regexFileExt.test(word)) return true;

  return false;
}
