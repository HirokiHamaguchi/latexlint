import type { LLTextLintErrorResult } from "./types";
import { getVocabularyData } from './vocabulary_loader';


function regexCheck(
    text: string,
    noPattern: string,
    yesPattern: string,
    memo: string,
    errors: LLTextLintErrorResult[],
    matchedRanges: [number, number][]
): void {
    const escaped = noPattern.replace(/\$num/g, '(\\d+|[〇一二三四五六七八九十百千万億兆]+)');
    const regex = new RegExp(escaped, 'g');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        const index = match.index;
        const endIndex = index + match[0].length;
        if (!matchedRanges.some(([rStart, rEnd]) => index < rEnd && endIndex > rStart)) {
            errors.push({
                startOffset: index,
                endOffset: endIndex,
                message: `「${match[0]}」という箇所は「${yesPattern.replace('$num', match[1])}」の方が正しいかも知れません。${memo}`,
                code: "usage-error",
            });
            matchedRanges.push([index, endIndex]);
        }
    }
}


export function checkUsageError(text: string): LLTextLintErrorResult[] {
    const dict = getVocabularyData();
    const errors: LLTextLintErrorResult[] = [];
    const matchedRanges: [number, number][] = [];

    for (const entry of dict) {
        // Check each 'no' pattern in the array
        const noPatterns = Array.isArray(entry.no) ? entry.no : [entry.no];
        for (const noPattern of noPatterns)
            regexCheck(text, noPattern, entry.yes, entry.memo, errors, matchedRanges);
    }

    // Sort errors by position (already done in main.ts, but keep for standalone use)
    errors.sort((a, b) => a.startOffset - b.startOffset);

    return errors;
}
