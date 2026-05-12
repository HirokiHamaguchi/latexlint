import type { LLTextLintErrorResult } from "./types";
import { getVocabularyData } from "./vocabulary_loader";

const NUMBER_PLACEHOLDER = "__LLTEXTLINT_NUM_PLACEHOLDER__";

type MessageFormatter = (wrong: string, correct: string, memo: string) => string;

type CompiledUsageRule = {
    regex: RegExp;
    yesPattern: string;
    memo: string;
    messageFormatter: MessageFormatter;
};

function escapeRegexLiteral(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRegexStylePattern(pattern: string): boolean {
    return /\\|\(\?|\[[^\]]*\]|\|/.test(pattern);
}

function toPatternSource(noPattern: string): string {
    const withPlaceholder = noPattern.replace(/\$num/g, NUMBER_PLACEHOLDER);
    const source = isRegexStylePattern(withPlaceholder)
        ? withPlaceholder
        : escapeRegexLiteral(withPlaceholder);

    return source.replace(
        new RegExp(NUMBER_PLACEHOLDER, "g"),
        "(\\d+|[〇一二三四五六七八九十百千万億兆]+)"
    );
}

function compileUsageRegex(noPattern: string, disallowWordContinuation: boolean): RegExp {
    const patternSource = toPatternSource(noPattern);
    const pattern = disallowWordContinuation
        ? `(?<![A-Za-z0-9_-])(?:${patternSource})(?![A-Za-z0-9_-])`
        : patternSource;

    return new RegExp(pattern, "g");
}

function formatEnglishUsageError(wrong: string, correct: string, memo: string): string {
    return `The phrase "${wrong}" may be better written as "${correct}". ${memo}`;
}

function formatJapaneseUsageError(wrong: string, correct: string, memo: string): string {
    return `「${wrong}」という箇所は「${correct}」の方が正しいかも知れません。${memo}`;
}

function compileUsageRules(): {
    entriesEn: CompiledUsageRule[];
    entriesJa: CompiledUsageRule[];
} {
    const dict = getVocabularyData();

    const entriesEn: CompiledUsageRule[] = [];
    const entriesJa: CompiledUsageRule[] = [];

    for (const entry of dict.entries_en) {
        const noPatterns = Array.isArray(entry.no) ? entry.no : [entry.no];

        for (const noPattern of noPatterns)
            entriesEn.push({
                regex: compileUsageRegex(noPattern, true),
                yesPattern: entry.yes,
                memo: entry.memo,
                messageFormatter: formatEnglishUsageError,
            });

    }

    for (const entry of dict.entries_ja) {
        const noPatterns = Array.isArray(entry.no) ? entry.no : [entry.no];

        for (const noPattern of noPatterns)
            entriesJa.push({
                regex: compileUsageRegex(noPattern, false),
                yesPattern: entry.yes,
                memo: entry.memo,
                messageFormatter: formatJapaneseUsageError,
            });

    }

    return { entriesEn, entriesJa };
}

const COMPILED_USAGE_RULES = compileUsageRules();

function regexCheck(
    text: string,
    rule: CompiledUsageRule,
    errors: LLTextLintErrorResult[],
    matchedRanges: [number, number][]
): void {
    const { regex, yesPattern, memo, messageFormatter } = rule;

    regex.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        const index = match.index;
        const endIndex = index + match[0].length;

        if (!matchedRanges.some(([rStart, rEnd]) => index < rEnd && endIndex > rStart)) {
            errors.push({
                startOffset: index,
                endOffset: endIndex,
                message: messageFormatter(
                    match[0],
                    yesPattern.replace("$num", match[1] ?? ""),
                    memo
                ),
                code: "usage-error",
            });

            matchedRanges.push([index, endIndex]);
        }

        // Defensive guard against zero-length regex matches.
        if (match[0].length === 0)
            regex.lastIndex++;

    }
}

function finalizeErrors(errors: LLTextLintErrorResult[]): LLTextLintErrorResult[] {
    errors.sort((a, b) => a.startOffset - b.startOffset);
    return errors;
}

export function checkUsageError(text: string): LLTextLintErrorResult[] {
    const errors: LLTextLintErrorResult[] = [];
    const matchedRanges: [number, number][] = [];
    const hasJapaneseHiragana = /[ぁ-ん]/.test(text);

    for (const rule of COMPILED_USAGE_RULES.entriesEn)
        regexCheck(text, rule, errors, matchedRanges);


    if (!hasJapaneseHiragana)
        return finalizeErrors(errors);


    for (const rule of COMPILED_USAGE_RULES.entriesJa)
        regexCheck(text, rule, errors, matchedRanges);


    return finalizeErrors(errors);
}
