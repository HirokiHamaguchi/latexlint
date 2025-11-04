import type { Token } from "./parser";
import type { MyTextLintError } from "./types";

/**
 * 「〜たり」ルールのチェック（複数文対応）
 */
export function checkTariTari(allTokens: Token[][]): MyTextLintError[] {
    const errors: MyTextLintError[] = [];

    for (const tokens of allTokens) {
        const occurrences: number[] = [];
        for (let i = 0; i < tokens.length - 1; i++) {
            if (
                tokens[i].pos === "動詞" &&
                ["たり", "だり"].includes(tokens[i + 1].surface_form)
            ) {
                occurrences.push(i);
            }
        }

        if (occurrences.length !== 1) {
            continue;
        }

        const i = occurrences[0] + 1;
        const successive = tokens.slice(i, Math.min(i + 4, tokens.length)).map(t => t.surface_form).join("");

        if (
            ["たりしない", "たりするな", "たりしたら", "たりしません"].some((x) =>
                successive.startsWith(x)
            )
        ) {
            continue;
        }

        errors.push({
            message: "「〜たり」パターンの後にもう一つ動詞+たりが必要です。",
            range: tokens[i].range,
        });
    }

    return errors;
}
