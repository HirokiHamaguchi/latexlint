export default function computeValidRanges(
  text: string,
  languageId: string
): [number, number][] {
  let invalidRanges: [number, number][] = [];

  if (languageId === "latex")
    invalidRanges = computeLaTeXInvalidRanges(text, invalidRanges);
  else if (languageId === "markdown")
    invalidRanges = computeMarkdownCodeBlockRanges(text);
  else console.log(`Unknown languageId ${languageId} in computeValidRanges.`);

  const mergedInvalidRanges = mergeRanges(invalidRanges);
  const validRanges = invertRanges(mergedInvalidRanges, text.length);
  return validRanges.filter(([start, end]) => end - start > 0);
}

function computeLaTeXInvalidRanges(
  text: string,
  verbatimRanges: [number, number][] = []
): [number, number][] {
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

  // verbsBegin: \\\\begin\\{${env}[*]?\\}
  // verbsEnd: \\\\end\\{${env}[*]?\\}
  // verbsInline: \verb (ただし、その直後の1文字が[a-zA-Z]でない場合に限る)
  // comments: %
  // 上の4つのパターンをまずは一度全て検出し、順にみていく。
  // 先頭のパターンが、
  // 1. verbsBeginなら、次のverbsEndまで他のパターンを捨てながら範囲を追加。
  // 2. verbsInlineなら、その直後の文字を区切り文字として、次に同じ文字が出現するまで範囲を追加。
  //    ただし、行末までに出現しなければ、暫定処置としてその行の終端まで範囲を追加。
  //    追加された範囲内に存在する他のパターンは全て捨てる。
  //    これは本来latexのエラーなので、console.warnで警告を出す。
  // 3. commentsなら、まずそれがエスケープされていないかを確認する。
  //    つまり、その直前に\が奇数個連続していなければ有効。
  //    その場合、その行の終端まで範囲を追加。
  //    追加された範囲内に存在する他のパターンは全て捨てる。
  // 上記を繰り返す。

  interface Pattern {
    type: "verbsBegin" | "verbsEnd" | "verbsInline" | "comment";
    index: number;
    env?: string; // for verbsBegin and verbsEnd
  }

  const patterns: Pattern[] = [];

  // Detect all patterns
  // verbsBegin and verbsEnd
  for (const env of verbatimEnvs) {
    const beginRegex = new RegExp(`\\\\begin\\{${env}\\*?\\}`, "g");
    const endRegex = new RegExp(`\\\\end\\{${env}\\*?\\}`, "g");

    let match;
    while ((match = beginRegex.exec(text)) !== null)
      patterns.push({ type: "verbsBegin", index: match.index, env });
    while ((match = endRegex.exec(text)) !== null)
      patterns.push({ type: "verbsEnd", index: match.index, env });
  }

  // verbsInline: \verb
  const verbRegex = /\\verb(?![a-zA-Z])/g;
  let match;
  while ((match = verbRegex.exec(text)) !== null)
    patterns.push({ type: "verbsInline", index: match.index });

  // comments: %
  const commentRegex = /%/g;
  while ((match = commentRegex.exec(text)) !== null)
    patterns.push({ type: "comment", index: match.index });

  // Sort patterns by index
  patterns.sort((a, b) => a.index - b.index);

  const invalidRanges: [number, number][] = [...verbatimRanges];
  let i = 0;

  while (i < patterns.length) {
    const pattern = patterns[i];

    if (pattern.type === "verbsBegin") {
      // Find matching verbsEnd
      const env = pattern.env!;
      const beginPos = pattern.index;
      let endPos = -1;

      for (let j = i + 1; j < patterns.length; j++)
        if (patterns[j].type === "verbsEnd" && patterns[j].env === env) {
          const endMatch = text
            .substring(patterns[j].index)
            .match(new RegExp(`^\\\\end\\{${env}\\*?\\}`));
          if (endMatch) {
            endPos = patterns[j].index + endMatch[0].length;
            // Remove all patterns between i and j (inclusive)
            patterns.splice(i + 1, j - i);
            break;
          }
        }

      if (endPos !== -1) invalidRanges.push([beginPos, endPos]);
      i++;
    } else if (pattern.type === "verbsInline") {
      const verbPos = pattern.index;
      const afterVerb = verbPos + 5; // "\verb".length = 5

      if (afterVerb < text.length) {
        const delimiter = text[afterVerb];

        // Find next occurrence of delimiter
        const restOfLine = text.substring(afterVerb + 1);
        const newlinePos = restOfLine.indexOf("\n");
        const delimiterPos = restOfLine.indexOf(delimiter);

        if (
          delimiterPos !== -1 &&
          (newlinePos === -1 || delimiterPos < newlinePos)
        ) {
          // Valid \verb with closing delimiter
          const endPos = afterVerb + 1 + delimiterPos + 1;
          invalidRanges.push([verbPos, endPos]);

          // Remove patterns within this range
          let j = i + 1;
          while (j < patterns.length && patterns[j].index < endPos)
            patterns.splice(j, 1);
        } else {
          // Delimiter not found before newline
          const lineEnd =
            newlinePos === -1 ? text.length : afterVerb + 1 + newlinePos;
          invalidRanges.push([verbPos, lineEnd]);
          console.warn(
            `\\verb delimiter '${delimiter}' not closed before line end at position ${verbPos}`
          );

          // Remove patterns within this range
          let j = i + 1;
          while (j < patterns.length && patterns[j].index < lineEnd)
            patterns.splice(j, 1);
        }
      }
      i++;
    } else if (pattern.type === "comment") {
      const commentPos = pattern.index;

      // Check if escaped (odd number of backslashes before %)
      let backslashCount = 0;
      for (let pos = commentPos - 1; pos >= 0 && text[pos] === "\\"; pos--)
        backslashCount++;

      if (backslashCount % 2 === 1) {
        // Escaped comment, not valid
        i++;
        continue;
      }

      // Find line end
      const restOfText = text.substring(commentPos + 1);
      const newlinePos = restOfText.indexOf("\n");
      const lineEnd =
        newlinePos === -1 ? text.length : commentPos + 1 + newlinePos;

      invalidRanges.push([commentPos, lineEnd]);

      // Remove patterns within this range
      let j = i + 1;
      while (j < patterns.length && patterns[j].index < lineEnd)
        patterns.splice(j, 1);

      i++;
    } // verbsEnd without matching verbsBegin - skip
    else i++;
  }

  return invalidRanges;
}

function computeMarkdownCodeBlockRanges(text: string): [number, number][] {
  // commentBegin: <!--
  // commentEnd: -->
  // codeBlockFence: ``` (ただし、行頭に限る)
  // 上の3つのパターンをまずは一度全て検出し、順にみていく。
  // 先頭のパターンが、
  // 1. commentBeginなら、次のcommentEndまで他のパターンを捨てながら範囲を追加。
  // 2. codeBlockFenceなら、次のcodeBlockFenceまで他のパターンを捨てながら範囲を追加。
  // 上記を繰り返す。

  interface Pattern {
    type: "commentBegin" | "commentEnd" | "codeBlockFence";
    index: number;
  }

  const patterns: Pattern[] = [];

  // Detect HTML comments
  const commentBeginRegex = /<!--/g;
  const commentEndRegex = /-->/g;

  let match;
  while ((match = commentBeginRegex.exec(text)) !== null)
    patterns.push({ type: "commentBegin", index: match.index });
  while ((match = commentEndRegex.exec(text)) !== null)
    patterns.push({ type: "commentEnd", index: match.index });

  // Detect code block fences (``` at beginning of line)
  const codeBlockRegex = /^```/gm;
  while ((match = codeBlockRegex.exec(text)) !== null)
    patterns.push({ type: "codeBlockFence", index: match.index });

  // Sort patterns by index
  patterns.sort((a, b) => a.index - b.index);

  const invalidRanges: [number, number][] = [];
  let i = 0;

  while (i < patterns.length) {
    const pattern = patterns[i];

    if (pattern.type === "commentBegin") {
      const beginPos = pattern.index;
      let endPos = -1;

      // Find matching commentEnd
      for (let j = i + 1; j < patterns.length; j++)
        if (patterns[j].type === "commentEnd") {
          endPos = patterns[j].index + 3; // "-->".length = 3
          // Remove patterns between i and j (inclusive)
          patterns.splice(i + 1, j - i);
          break;
        }

      if (endPos !== -1) invalidRanges.push([beginPos, endPos]);
      i++;
    } else if (pattern.type === "codeBlockFence") {
      const beginPos = pattern.index;
      let endPos = -1;

      // Find next code block fence
      for (let j = i + 1; j < patterns.length; j++)
        if (patterns[j].type === "codeBlockFence") {
          // Include the entire line of the closing fence
          const fencePos = patterns[j].index;
          const restOfText = text.substring(fencePos);
          const newlinePos = restOfText.indexOf("\n");
          endPos = newlinePos === -1 ? text.length : fencePos + newlinePos + 1;

          // Remove patterns between i and j (inclusive)
          patterns.splice(i + 1, j - i);
          break;
        }

      if (endPos !== -1) invalidRanges.push([beginPos, endPos]);
      i++;
    } // commentEnd without matching commentBegin - skip
    else i++;
  }

  return invalidRanges;
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
