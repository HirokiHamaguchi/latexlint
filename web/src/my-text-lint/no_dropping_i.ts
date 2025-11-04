import type { Token } from "./parser";
import type { MyTextLintError } from "./types";

export function checkNoDroppingI(allTokens: Token[][]): MyTextLintError[] {
    const results: MyTextLintError[] = [];

    for (const tokens of allTokens) {
        for (let i = 1; i < tokens.length; i++) {
            const prev = tokens[i - 1];
            const curr = tokens[i];

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
                    message: "い抜き言葉を使用しています。",
                    range: curr.range,
                });
            }
        }
    }
    return results;
}
