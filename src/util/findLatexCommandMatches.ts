export type LatexCommandMatch = {
    index: number;
    fullEnd: number;
    content: string;
};

export default function findLatexCommandMatches(
    text: string,
    commandRegex: RegExp
): LatexCommandMatch[] {
    const flags = commandRegex.flags.includes('g')
        ? commandRegex.flags
        : commandRegex.flags + 'g';
    const regex = new RegExp(commandRegex.source, flags);
    const matches: LatexCommandMatch[] = [];

    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        if (match.index === undefined) continue;

        const openBraceIndex = match.index + match[0].length - 1;
        if (text[openBraceIndex] !== '{') continue;

        const closeBraceIndex = findClosingBrace(text, openBraceIndex);
        if (closeBraceIndex === undefined) continue;

        matches.push({
            index: match.index,
            fullEnd: closeBraceIndex + 1,
            content: text.slice(openBraceIndex + 1, closeBraceIndex),
        });

        regex.lastIndex = closeBraceIndex + 1;
    }

    return matches;
}

function findClosingBrace(text: string, openBraceIndex: number): number | undefined {
    let depth = 1;

    for (let i = openBraceIndex + 1; i < text.length; i++) {
        if (text[i] === '\\') {
            i++;
            continue;
        }
        if (text[i] === '{') depth++;
        else if (text[i] === '}') {
            depth--;
            if (depth === 0) return i;
        }
    }

    return undefined;
}
