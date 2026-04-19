import type { LLTextLintErrorResult } from "./types";
import { getVocabularyData } from './vocabulary_loader';


const NUMBER_PLACEHOLDER = '__LLTEXTLINT_NUM_PLACEHOLDER__';


function escapeRegexLiteral(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function isRegexStylePattern(pattern: string): boolean {
    return /\\|\(\?|\[[^\]]*\]|\|/.test(pattern);
}


function toPatternSource(noPattern: string): string {
    const withPlaceholder = noPattern.replace(/\$num/g, NUMBER_PLACEHOLDER);
    const source = isRegexStylePattern(withPlaceholder)
        ? withPlaceholder
        : escapeRegexLiteral(withPlaceholder);

    return source.replace(new RegExp(NUMBER_PLACEHOLDER, 'g'), '(\\d+|[〇一二三四五六七八九十百千万億兆]+)');
}


function regexCheck(
    text: string,
    noPattern: string,
    yesPattern: string,
    memo: string,
    messageFormatter: (wrong: string, correct: string, memo: string) => string,
    disallowWordContinuation: boolean,
    errors: LLTextLintErrorResult[],
    matchedRanges: [number, number][]
): void {
    const patternSource = toPatternSource(noPattern);
    const pattern = disallowWordContinuation
        ? `(?<![A-Za-z0-9_-])(?:${patternSource})(?![A-Za-z0-9_-])`
        : patternSource;
    const regex = new RegExp(pattern, 'g');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        const index = match.index;
        const endIndex = index + match[0].length;
        if (!matchedRanges.some(([rStart, rEnd]) => index < rEnd && endIndex > rStart)) {
            errors.push({
                startOffset: index,
                endOffset: endIndex,
                message: messageFormatter(match[0], yesPattern.replace('$num', match[1]), memo),
                code: "usage-error",
            });
            matchedRanges.push([index, endIndex]);
        }
    }
}


function formatEnglishUsageError(wrong: string, correct: string, memo: string): string {
    return `The phrase "${wrong}" may be better written as "${correct}". ${memo}`;
}


function formatJapaneseUsageError(wrong: string, correct: string, memo: string): string {
    return `「${wrong}」という箇所は「${correct}」の方が正しいかも知れません。${memo}`;
}


function finalizeErrors(errors: LLTextLintErrorResult[]): LLTextLintErrorResult[] {
    errors.sort((a, b) => a.startOffset - b.startOffset);
    return errors;
}


export function checkUsageError(text: string): LLTextLintErrorResult[] {
    const dict = getVocabularyData();
    const errors: LLTextLintErrorResult[] = [];
    const matchedRanges: [number, number][] = [];
    const hasJapaneseHiragana = /[ぁ-ん]/.test(text);

    for (const entry of dict.entries_en) {
        const noPatterns = Array.isArray(entry.no) ? entry.no : [entry.no];
        for (const noPattern of noPatterns)
            regexCheck(text, noPattern, entry.yes, entry.memo, formatEnglishUsageError, true, errors, matchedRanges);
    }

    if (!hasJapaneseHiragana)
        return finalizeErrors(errors);

    for (const entry of dict.entries_ja) {
        const noPatterns = Array.isArray(entry.no) ? entry.no : [entry.no];
        for (const noPattern of noPatterns)
            regexCheck(text, noPattern, entry.yes, entry.memo, formatJapaneseUsageError, false, errors, matchedRanges);
    }

    return finalizeErrors(errors);
}
