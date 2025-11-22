import type { Token } from "./parser";
import type { LLTextLintErrorResult } from "./types";

function isTargetVerb(token: Token): boolean {
    return (
        token.pos === "動詞" &&
        token.pos_detail_1 === "自立" &&
        token.conjugated_type === "一段" &&
        token.conjugated_form === "未然形"
    );
}

function isRaWord(token: Token): boolean {
    return token.pos === "動詞" && token.pos_detail_1 === "接尾" && token.basic_form === "れる";
}

function isSpecialCases(token: Token): boolean {
    // Due to kuromoji.js's behavior, some dropping-ra words will be tokenized as one.
    // See also https://github.com/takuyaa/kuromoji.js/issues/28
    return token.pos === "動詞" && (token.basic_form === "来れる" || token.basic_form === "見れる");
}

export function checkNoDroppingRa(
    allTokens: Token[]
): LLTextLintErrorResult[] {
    const results: LLTextLintErrorResult[] = [];

    // Check for special cases (single token dropping-ra words)
    for (const token of allTokens)
        if (isSpecialCases(token))
            results.push({
                startOffset: token.range[0],
                endOffset: token.range[1],
                message: "ら抜き言葉を使用しています。",
                code: "no-dropping-ra",
            });

    for (let i = 1; i < allTokens.length; i++) {
        const prev = allTokens[i - 1];
        const curr = allTokens[i];

        if (isTargetVerb(prev) && isRaWord(curr))
            results.push({
                startOffset: curr.range[0],
                endOffset: curr.range[1],
                message: "ら抜き言葉を使用しています。",
                code: "no-dropping-ra",
            });
    }

    return results;
}