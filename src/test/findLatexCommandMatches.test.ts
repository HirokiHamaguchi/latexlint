import * as assert from "assert";

import findLatexCommandMatches from "../util/findLatexCommandMatches";

suite("findLatexCommandMatches Test Suite", () => {
  test("tracks nested braces until the true closing brace", () => {
    const text = String.raw`\ref{fig:a_{1}} and \label{fig:b_{2}}`;
    const refMatches = findLatexCommandMatches(text, /\\ref\{/g);
    const labelMatches = findLatexCommandMatches(text, /\\label\{/g);

    assert.deepStrictEqual(refMatches.map((match) => match.content), ["fig:a_{1}"]);
    assert.deepStrictEqual(labelMatches.map((match) => match.content), ["fig:b_{2}"]);
  });

  test("ignores escaped closing braces while scanning", () => {
    const text = String.raw`\ref{fig:\}}`;
    const refMatches = findLatexCommandMatches(text, /\\ref\{/g);

    assert.deepStrictEqual(refMatches.map((match) => match.content), [String.raw`fig:\}`]);
  });
});
