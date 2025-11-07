import { parseSentence } from "./parser";
import { checkNoDroppingI } from "./no_dropping_i";
import { checkNoDroppingRa } from "./no_dropping_ra";
import { checkOverlookedTypo } from "./overlooked_typo";
import { checkTariTari } from "./tari_tari";
import { checkUsageError } from "./usage_error";
import { checkNoSuccessiveWord } from "./no_successive_word";
import type { Diagnostic, MyTextLintErrorResult } from "./types";
import { DiagnosticSeverity, Range } from "../vscode-mock";
import type { TextDocument } from "../vscode-mock";


export async function MyTextLint(text: string, doc: TextDocument): Promise<Diagnostic[]> {
    if (!text.trim()) return [];

    try {
        // Parse the text into tokens
        const allTokens = await parseSentence(text);

        // Run all MyTextLint checks and collect error results
        const errorResults: MyTextLintErrorResult[] = [
            ...checkNoDroppingI(allTokens),
            ...checkNoDroppingRa(allTokens),
            ...checkTariTari(allTokens),
            ...checkNoSuccessiveWord(allTokens),
            ...checkOverlookedTypo(text),
            ...checkUsageError(text)
        ];

        // Convert to Diagnostics
        const diagnostics = errorResults.map(error => {
            // Use Information severity for overlooked-typo due to false positives
            const severity = error.code === "overlooked-typo"
                ? DiagnosticSeverity.Information
                : DiagnosticSeverity.Warning;

            return {
                range: new Range(doc.positionAt(error.startOffset), doc.positionAt(error.endOffset)),
                message: error.message,
                severity: severity,
                source: "My Text Lint",
                code: error.code,
            };
        });

        // Sort diagnostics by position
        diagnostics.sort((a, b) => {
            const lineCompare = a.range.start.line - b.range.start.line;
            if (lineCompare !== 0) return lineCompare;
            return a.range.start.character - b.range.start.character;
        });

        return diagnostics;

    } catch (error) {
        console.error('MyTextLint error:', error);
        return [];
    }
}

