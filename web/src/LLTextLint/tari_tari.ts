import type { Token } from "./parser";
import type { LLTextLintErrorResult } from "./types";

/**
 * Check if character is a sentence ending marker
 */
function isSentenceEndChar(char: string): boolean {
    return /[。．.！!？?\n]/.test(char);
}

/**
 * 「〜たり」ルールのチェック（文ごとに分割して処理）
 */
export function checkTariTari(
    allTokens: Token[]
): LLTextLintErrorResult[] {
    const errors: LLTextLintErrorResult[] = [];

    // Split tokens into sentences based on sentence-ending characters
    let sentenceStart = 0;

    for (let i = 0; i < allTokens.length; i++) {
        const isLastToken = i === allTokens.length - 1;
        const token = allTokens[i];
        const lastChar = token.surface_form[token.surface_form.length - 1];
        const isSentenceEnd = isSentenceEndChar(lastChar) || isLastToken;

        if (isSentenceEnd) {
            const sentenceTokens = allTokens.slice(sentenceStart, i + 1);

            // Check this sentence for tari-tari pattern
            const occurrences: number[] = [];
            for (let j = 0; j < sentenceTokens.length - 1; j++) {
                if (
                    sentenceTokens[j].pos === "動詞" &&
                    ["たり", "だり"].includes(sentenceTokens[j + 1].surface_form)
                ) {
                    occurrences.push(j);
                }
            }

            if (occurrences.length === 1) {
                const j = occurrences[0] + 1;
                const successive = sentenceTokens.slice(j, Math.min(j + 4, sentenceTokens.length))
                    .map(t => t.surface_form)
                    .join("");

                if (
                    !["たりしない", "たりするな", "たりしたら", "たりしません"].some((x) =>
                        successive.startsWith(x)
                    )
                ) {
                    const token = sentenceTokens[j];
                    errors.push({
                        startOffset: token.range[0],
                        endOffset: token.range[1],
                        message: "「〜たり」パターンの後にもう一つ動詞+たりが必要です。",
                        code: "tari-tari",
                    });
                }
            }

            sentenceStart = i + 1;
        }
    }

    return errors;
}
