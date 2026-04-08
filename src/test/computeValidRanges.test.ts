import * as assert from "assert";
import computeValidRanges from "../LLText/computeValidRanges";

function isIndexInsideValidRanges(
    index: number,
    validRanges: [number, number][]
): boolean {
    return validRanges.some(([start, end]) => start <= index && index < end);
}

suite("computeValidRanges Test Suite", () => {
    test("latex: ignore text inside CCSXML environment", () => {
        const text = [
            "Before text.",
            "\\begin{CCSXML}",
            "<concept_id>10002951.10003317.10003338</concept_id>",
            "\\end{CCSXML}",
            "After text.",
        ].join("\n");

        const validRanges = computeValidRanges(text, "latex");
        const ignoredIndex = text.indexOf("concept_id");
        const outsideIndex = text.indexOf("After text.");

        assert.strictEqual(isIndexInsideValidRanges(ignoredIndex, validRanges), false);
        assert.strictEqual(isIndexInsideValidRanges(outsideIndex, validRanges), true);
    });

    test("latex: ignore text inside comment environment", () => {
        const text = [
            "Before text.",
            "\\begin{comment}",
            "This should be ignored.",
            "\\end{comment}",
            "After text.",
        ].join("\n");

        const validRanges = computeValidRanges(text, "latex");
        const ignoredIndex = text.indexOf("should be ignored");
        const outsideIndex = text.indexOf("After text.");

        assert.strictEqual(isIndexInsideValidRanges(ignoredIndex, validRanges), false);
        assert.strictEqual(isIndexInsideValidRanges(outsideIndex, validRanges), true);
    });

    test("latex: ignore text inside filecontents* environment", () => {
        const text = [
            "Before text.",
            "\\begin{filecontents*}{tmp.txt}",
            "temporary content",
            "\\end{filecontents*}",
            "After text.",
        ].join("\n");

        const validRanges = computeValidRanges(text, "latex");
        const ignoredIndex = text.indexOf("temporary content");
        const outsideIndex = text.indexOf("After text.");

        assert.strictEqual(isIndexInsideValidRanges(ignoredIndex, validRanges), false);
        assert.strictEqual(isIndexInsideValidRanges(outsideIndex, validRanges), true);
    });
});
