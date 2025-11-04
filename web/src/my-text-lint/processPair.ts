import { parseSentence } from "./parser";
import { checkNoDroppingI } from "./no_dropping_i";
import { checkNoDroppingRa } from "./no_dropping_ra";
import { checkOverlookedTypo } from "./overlooked_typo";
import { checkTariTari } from "./tari_tari";
import { checkUsageError } from "./usage_error";
import { checkNoSuccessiveWord } from "./no_successive_word";
import type { MyTextLintError } from "./types";

/**
 * 単一のテキストに対してMyTextLintチェックを実行
 */
export async function MyTextLintSingle(text: string): Promise<string> {
    if (!text.trim()) {
        return "";
    }

    try {
        // Parse the text into tokens
        console.log("Parsing text:", text);
        const allTokens = await parseSentence(text);
        console.log("allTokens:", allTokens);

        // Run all MyTextLint checks
        const errors: MyTextLintError[] = [
            ...checkNoDroppingI(allTokens),
            ...checkNoDroppingRa(allTokens),
            ...checkTariTari(allTokens),
            ...checkNoSuccessiveWord(allTokens),
            ...checkOverlookedTypo(text),
            ...checkUsageError(text)
        ];

        // Sort errors by position
        errors.sort((a, b) => a.range[0] - b.range[0]);

        if (errors.length === 0) {
            return "No";
        }

        // Format errors as strings (similar to Python version)
        const errorMessages = errors.map(error => `${error.message}`);
        return errorMessages.join("\n");

    } catch (error) {
        return `エラー: ${error instanceof Error ? error.message : String(error)}`;
    }
}

