import type { LLTextLintErrorResult } from "./types";
import { getVocabularyData } from './vocabulary_loader';

function isOverlapping(start: number, end: number, ranges: [number, number][]): boolean {
    return ranges.some(([rStart, rEnd]) => start < rEnd && end > rStart);
}

function escapeRegexExceptNum(str: string): string {
    return str.replace(/\$num/g, '(\\d+|[〇一二三四五六七八九十百千万億兆]+)');
}

function naiveCheck(
    text: string,
    noPattern: string,
    yesPattern: string,
    memo: string,
    errors: LLTextLintErrorResult[],
    matchedRanges: [number, number][]
): void {
    let searchIndex = 0;
    while (true) {
        const index = text.indexOf(noPattern, searchIndex);
        if (index === -1) break;
        const endIndex = index + noPattern.length;
        if (!isOverlapping(index, endIndex, matchedRanges)) {
            errors.push({
                startOffset: index,
                endOffset: endIndex,
                message: `「${noPattern}」ではなく「${yesPattern}」?\n${memo}`,
                code: "usage-error",
            });
            matchedRanges.push([index, endIndex]);
        }
        searchIndex = index + 1;
    }
}

function regexCheck(
    text: string,
    noPattern: string,
    yesPattern: string,
    memo: string,
    errors: LLTextLintErrorResult[],
    matchedRanges: [number, number][]
): void {
    const escaped = escapeRegexExceptNum(noPattern);
    const regex = new RegExp(escaped, 'g');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        const index = match.index;
        const endIndex = index + match[0].length;
        if (!isOverlapping(index, endIndex, matchedRanges)) {
            errors.push({
                startOffset: index,
                endOffset: endIndex,
                message: `「${match[0]}」は一般に誤用とされており、「${yesPattern.replace('$num', match[1])}」が正しい表現かも知れません。${memo}`,
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
            if (noPattern.includes("$num"))
                regexCheck(text, noPattern, entry.yes, entry.memo, errors, matchedRanges);
            else
                naiveCheck(text, noPattern, entry.yes, entry.memo, errors, matchedRanges);
    }

    // Sort errors by position (already done in main.ts, but keep for standalone use)
    errors.sort((a, b) => a.startOffset - b.startOffset);

    return errors;
}