import type { Token } from "./parser";
import type { MyTextLintErrorResult } from "./types";

/**
 * Check if a string is onomatopoeia (katakana only)
 * 制限: オノマトペを判定する方法がないため、同じカタカナの語が連続したものをオノマトペとして扱う
 * 例) カクカク、ドキドキ、ビリビリ
 */
function isOnomatopoeia(str: string): boolean {
    return /^[ァ-ロワヲンー]*$/.test(str);
}

/**
 * Check if token is a number (漢数字)
 */
function isNumberToken(token: Token): boolean {
    return token.pos === "名詞" && token.pos_detail_1 === "数";
}

export function checkNoSuccessiveWord(
    allTokens: Token[]
): MyTextLintErrorResult[] {
    const results: MyTextLintErrorResult[] = [];

    if (allTokens.length <= 1) return results;

    for (let i = 1; i < allTokens.length; i++) {
        const prevToken = allTokens[i - 1];
        const currToken = allTokens[i];
        const prevWord = prevToken.surface_form;
        const currWord = currToken.surface_form;
        if (prevWord !== currWord) continue;

        // Skip if both tokens are numbers (漢数字)
        // 例) 値は"九九"です。
        if (isNumberToken(prevToken) && isNumberToken(currToken)) continue;
        // Skip if both tokens are onomatopoeia (オノマトペ)
        if (isOnomatopoeia(prevWord) && isOnomatopoeia(currWord)) continue;

        results.push({
            startOffset: currToken.range[0],
            endOffset: currToken.range[1],
            message: `"${currWord}" が連続して2回使われています。`,
            code: "no-successive-word",
        });
    }

    return results;
}