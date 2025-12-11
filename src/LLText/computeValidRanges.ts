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
  // verbsInline: \verb
  // comments: %
  // 上の4つのパターンをまずは一度全て検出し、順にみていく。
  // 先頭のパターンが、
  // 1. verbsBeginなら、次のverbsEndまで他のパターンを捨てながら範囲を追加。
  // 2. verbsInlineなら、まずそれが本当に有効な\verbかを確認する。
  //    つまり、\verbの直後の1文字が[a-zA-Z]でなければ有効。
  //    その場合、その文字を区切り文字として、次に同じ文字が出現するまで範囲を追加。
  //    ただし、行末までに出現しなければ、暫定処置としてその行の終端まで範囲を追加。
  //    追加された範囲内に存在する他のパターンは全て捨てる。
  //    これは本来latexのエラーなので、console.warnで警告を出す。
  // 3. commentsなら、まずそれがエスケープされていないかを確認する。
  //    つまり、その直前に\が奇数個連続していなければ有効。
  //    その場合、その行の終端まで範囲を追加。
  //    追加された範囲内に存在する他のパターンは全て捨てる。
  // 上記を繰り返す。
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
