import type { MyTextLintErrorResult } from "./types";
import _dict from './my_vocabulary.json';

interface UsageEntry {
    no: string;
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
    entry: UsageEntry,
    errors: MyTextLintErrorResult[],
    matchedRanges: [number, number][]
): void {
    let searchIndex = 0;
    while (true) {
        const index = text.indexOf(entry.no, searchIndex);
        if (index === -1) break;
        const endIndex = index + entry.no.length;
        if (!isOverlapping(index, endIndex, matchedRanges)) {
            errors.push({
                startOffset: index,
                endOffset: endIndex,
                message: `「${entry.no}」は一般に誤用とされており、「${entry.yes}」が正しい表現かも知れません。${entry.memo ? entry.memo.join('') : ''}`,
                code: "usage-error",
            });
            matchedRanges.push([index, endIndex]);
        }
        searchIndex = index + 1;
    }
}

function regexCheck(
    text: string,
    entry: UsageEntry,
    errors: MyTextLintErrorResult[],
    matchedRanges: [number, number][]
): void {
    const escaped = escapeRegexExceptNum(entry.no);
    const regex = new RegExp(escaped, 'g');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        const index = match.index;
        const endIndex = index + match[0].length;
        if (!isOverlapping(index, endIndex, matchedRanges)) {
            errors.push({
                startOffset: index,
                endOffset: endIndex,
                message: `「${match[0]}」は一般に誤用とされており、「${entry.yes.replace('$num', match[1])}」が正しい表現かも知れません。${entry.memo ? entry.memo.join('') : ''}`,
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
        if (entry.no.includes("$num")) {
            regexCheck(text, entry, errors, matchedRanges);
        } else {
            naiveCheck(text, entry, errors, matchedRanges);
        }
    }

    // Sort errors by position (already done in main.ts, but keep for standalone use)
    errors.sort((a, b) => a.startOffset - b.startOffset);

    return errors;
}