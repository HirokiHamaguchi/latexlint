import type { Token } from "./parser";
import type { MyTextLintError } from "./types";

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

export function checkNoDroppingRa(allTokens: Token[][]): MyTextLintError[] {
    const results: MyTextLintError[] = [];

    for (const tokens of allTokens) {
        // Check for special cases (single token dropping-ra words)
        for (const token of tokens) {
            if (isSpecialCases(token)) {
                results.push({
                    message: "ら抜き言葉を使用しています。",
                    range: [token.word_position, token.word_position + token.surface_form.length],
                });
            }
        }

        // Check for verb pairs (target verb + ra word)
        if (tokens.length <= 1) {
            continue;
        }

        for (let i = 1; i < tokens.length; i++) {
            const prev = tokens[i - 1];
            const curr = tokens[i];

            if (isTargetVerb(prev) && isRaWord(curr)) {
                results.push({
                    message: "ら抜き言葉を使用しています。",
                    range: curr.range,
                });
            }
        }
    }

    return results;
}