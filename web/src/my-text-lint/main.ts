import { parseSentence } from "./parser";
import { checkNoDroppingI } from "./no_dropping_i";
import { checkNoDroppingRa } from "./no_dropping_ra";
import { checkOverlookedTypo } from "./overlooked_typo";
import { checkTariTari } from "./tari_tari";
import { checkUsageError } from "./usage_error";
import { checkNoSuccessiveWord } from "./no_successive_word";
import type { MyTextLintError } from "./types";

export async function MyTextLint(text: string): Promise<string> {
    if (!text.trim()) {
        return "";
    }

    try {
        // Parse the text into tokens
        const allTokens = await parseSentence(text);

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

        // Format errors as strings
        return errors.map(error => `${error.message}`).join("\n");

    } catch (error) {
        return `エラー: ${error instanceof Error ? error.message : String(error)}`;
    }
}

