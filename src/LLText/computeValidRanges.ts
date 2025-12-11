export function computeValidRanges(
  text: string,
  languageId: string
): [number, number][] {
  const invalidRanges: [number, number][] = [];
  invalidRanges.push(...computeCommentRanges(text));
  if (languageId === "latex")
    invalidRanges.push(...computeVerbatimRanges(text));
  else if (languageId === "markdown")
    invalidRanges.push(...computeMarkdownCodeBlockRanges(text));
  else console.log(`Unknown languageId ${languageId} in computeValidRanges.`);
  const mergedInvalidRanges = mergeRanges(invalidRanges);
  return invertRanges(mergedInvalidRanges, text.length);
}

export function isPositionValid(
  idx: number,
  validRanges: [number, number][]
): boolean {
  for (const [start, end] of validRanges)
    if (idx >= start && idx < end) return true;
  return false;
}

function computeCommentRanges(text: string): [number, number][] {
  const ranges: [number, number][] = [];
  const lines = text.split("\n");
  let currentPos = 0;
  for (const line of lines) {
    let i = 0;
    while (i < line.length) {
      if (line[i] === "%") {
        ranges.push([currentPos + i, currentPos + line.length]);
        break;
      }
      i++;
    }
    currentPos += line.length + 1; // +1 for newline
  }
  return ranges;
}

function computeVerbatimRanges(text: string): [number, number][] {
  const ranges: [number, number][] = [];
  const verbatimEnvs = [
    "verbatim",
    "lstlisting",
    "minted",
    "Verbatim", // fancyvrb package
    "BVerbatim",
    "LVerbatim",
    "SaveVerbatim",
    "VerbatimOut",
  ];

  // Detect block verbatim environments
  for (const env of verbatimEnvs) {
    const beginRegex = new RegExp(`\\\\begin\\{${env}[*]?\\}`, "g");
    const endRegex = new RegExp(`\\\\end\\{${env}[*]?\\}`, "g");

    let beginMatch;
    while ((beginMatch = beginRegex.exec(text)) !== null) {
      endRegex.lastIndex = beginMatch.index + beginMatch[0].length;
      const endMatch = endRegex.exec(text);
      if (endMatch)
        ranges.push([beginMatch.index, endMatch.index + endMatch[0].length]);
      else ranges.push([beginMatch.index, text.length]);
    }
  }

  // Detect inline \verb commands
  const verbRegex = /\\verb(.)(.*?)\1/g;
  let verbMatch;
  while ((verbMatch = verbRegex.exec(text)) !== null)
    ranges.push([verbMatch.index, verbMatch.index + verbMatch[0].length]);

  return ranges;
}

function computeMarkdownCodeBlockRanges(text: string): [number, number][] {
  const ranges: [number, number][] = [];
  const lines = text.split("\n");
  let currentPos = 0;
  let inCodeBlock = false;
  let codeBlockStart = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```"))
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockStart = currentPos;
      } else {
        inCodeBlock = false;
        ranges.push([codeBlockStart, currentPos + lines[i].length]);
      }
    currentPos += lines[i].length;
  }
  if (inCodeBlock) ranges.push([codeBlockStart, text.length]);
  return ranges;
}

function mergeRanges(ranges: [number, number][]): [number, number][] {
  if (ranges.length === 0) return [];
  const sorted = ranges.sort((a, b) => {
    return a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1];
  });
  const merged: [number, number][] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];
    if (current[0] <= lastMerged[1])
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    else merged.push(current);
  }
  return merged;
}

function invertRanges(
  invalidRanges: [number, number][],
  textLength: number
): [number, number][] {
  if (invalidRanges.length === 0) return [[0, textLength]];
  const validRanges: [number, number][] = [];
  let currentPos = 0;
  for (const [start, end] of invalidRanges) {
    if (currentPos < start) validRanges.push([currentPos, start]);
    currentPos = Math.max(currentPos, end);
  }
  if (currentPos < textLength) validRanges.push([currentPos, textLength]);
  return validRanges;
}
