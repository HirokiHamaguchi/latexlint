import type { Token } from "./parser";
import type { LLTextLintErrorResult } from "./types";

export function checkNoDroppingI(
    allTokens: Token[]
): LLTextLintErrorResult[] {
    const results: LLTextLintErrorResult[] = [];

    for (let i = 1; i < allTokens.length; i++) {
        const prev = allTokens[i - 1];
        const curr = allTokens[i];

        if (
            (prev.pos === "助詞" &&
                ["て", "で"].includes(prev.basic_form) &&
                curr.pos === "助動詞" &&
                curr.basic_form === "ます") ||
            (prev.pos === "動詞" &&
                curr.pos === "動詞" &&
                ["てる", "でる"].includes(curr.basic_form)) ||
            (prev.pos === "動詞" &&
                ["て", "で"].includes(prev.basic_form) &&
                curr.pos === "助動詞" &&
                curr.basic_form === "ない") ||
            (prev.pos === "助詞" &&
                ["て", "で"].includes(prev.basic_form) &&
                curr.pos === "動詞" &&
                curr.basic_form === "く")
        ) {
            results.push({
                startOffset: curr.range[0],
                endOffset: curr.range[1],
                message: "い抜き言葉を使用しています。",
                code: "no-dropping-i",
            });
        }
    }
    return results;
}
