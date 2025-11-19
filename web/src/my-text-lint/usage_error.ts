import type { MyTextLintErrorResult } from "./types";
import _dict from './my_vocabulary.json';

interface UsageEntry {
    no: string[];
    yes: string;
    memo?: string[];
}

function isOverlapping(start: number, end: number, ranges: [number, number][]): boolean {
    return ranges.some(([rStart, rEnd]) => start < rEnd && end > rStart);
}

function escapeRegexExceptNum(str: string): string {
    return str.replace(/\$num\$/g, '(\\d+|[〇一二三四五六七八九十百千万億兆]+)');
}

function naiveCheck(
    text: string,
    noPattern: string,
    yesPattern: string,
    memo: string[] | undefined,
    errors: MyTextLintErrorResult[],
    matchedRanges: [number, number][]
): void {
    let searchIndex = 0;
    while (true) {
        const index = text.indexOf(noPattern, searchIndex);
        if (index === -1) break;
        const endIndex = index + noPattern.length;
        if (!isOverlapping(index, endIndex, matchedRanges)) {
            const memoText = memo && memo.length > 0
                ? (() => {
                    if (memo[0] === '[重言]') {
                        memo[0] = 'この表現は重言の可能性があり、理解して使えば問題のない修辞技法となりますが、誤用の可能性もあるので注意が必要です。';
                    }
                    return memo.join('\n');
                })()
                : '';

            errors.push({
                startOffset: index,
                endOffset: endIndex,
                message: `「${noPattern}」ではなく「${yesPattern}」?\n${memoText}`,
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
    memo: string[] | undefined,
    errors: MyTextLintErrorResult[],
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
                message: `「${match[0]}」は一般に誤用とされており、「${yesPattern.replace('$num$', match[1])}」が正しい表現かも知れません。${memo ? memo.join('') : ''}`,
                code: "usage-error",
            });
            matchedRanges.push([index, endIndex]);
        }
    }
}


export function checkUsageError(text: string): MyTextLintErrorResult[] {
    const dict = _dict.entries as UsageEntry[];
    const errors: MyTextLintErrorResult[] = [];
    const matchedRanges: [number, number][] = [];

    for (const entry of dict) {
        // Check each 'no' pattern in the array
        for (const noPattern of entry.no) {
            if (noPattern.includes("$num$")) {
                regexCheck(text, noPattern, entry.yes, entry.memo, errors, matchedRanges);
            } else {
                naiveCheck(text, noPattern, entry.yes, entry.memo, errors, matchedRanges);
            }
        }
    }

    // Sort errors by position (already done in main.ts, but keep for standalone use)
    errors.sort((a, b) => a.startOffset - b.startOffset);

    return errors;
}