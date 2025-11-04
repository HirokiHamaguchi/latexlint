import type { MyTextLintError } from "./types";
import _dict from './dict.json';

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
    errors: MyTextLintError[],
    matchedRanges: [number, number][]
): void {
    let searchIndex = 0;
    while (true) {
        const index = text.indexOf(entry.no, searchIndex);
        if (index === -1) break;
        const endIndex = index + entry.no.length;
        if (!isOverlapping(index, endIndex, matchedRanges)) {
            errors.push({
                message: `「${entry.no}」は一般に誤用とされており、「${entry.yes}」が正しい表現かも知れません。${entry.memo ? entry.memo.join('') : ''}`,
                range: [index, endIndex],
            });
            matchedRanges.push([index, endIndex]);
        }
        searchIndex = index + 1;
    }
}

function regexCheck(
    text: string,
    entry: UsageEntry,
    errors: MyTextLintError[],
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
                message: `「${match[0]}」は一般に誤用とされており、「${entry.yes.replace('$num', match[1])}」が正しい表現かも知れません。${entry.memo ? entry.memo.join('') : ''}`,
                range: [index, endIndex],
            });
            matchedRanges.push([index, endIndex]);
        }
    }
}


export function checkUsageError(text: string): MyTextLintError[] {
    const dict = _dict.entries as UsageEntry[];
    const errors: MyTextLintError[] = [];
    const matchedRanges: [number, number][] = [];

    for (const entry of dict) {
        if (entry.no.includes("$num")) {
            regexCheck(text, entry, errors, matchedRanges);
        } else {
            naiveCheck(text, entry, errors, matchedRanges);
        }
    }

    // Sort errors by position
    errors.sort((a, b) => a.range[0] - b.range[0]);

    return errors;
}