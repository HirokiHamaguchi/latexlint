
export type LabelResult = {
    originalText: string;
    labelStart: number;
    labelEnd: number;
};

export type LabelTargetSearchResult = {
    result: LabelResult | undefined;
    message: string;
};

export default function findLabelTargets(
    text: string,
    cursorOffset: number,
): LabelTargetSearchResult {
    // Find the backslash before the cursor
    let index = cursorOffset;
    while (index > 0 && text[index - 1] !== '\n' && text[index] !== '\\') index--;
    if (text[index] !== '\\') return { result: undefined, message: "" };

    // Check if this is a \label{...} command
    if (text.slice(index, index + 6) !== '\\label') return { result: undefined, message: "" };

    const braceStart = index + 6;
    if (text[braceStart] !== '{') return { result: undefined, message: "" };

    // Find the closing brace
    let braceEnd = braceStart + 1;
    let braceDepth = 1;
    while (braceEnd < text.length && text[braceEnd] !== '\n') {
        if (text[braceEnd] === '{') braceDepth++;
        if (text[braceEnd] === '}') braceDepth--;
        if (braceDepth === 0) break;
        braceEnd++;
    }
    if (braceDepth !== 0 || text[braceEnd] !== '}')
        return { result: undefined, message: 'Failed to find the closing brace for the label command.' };


    const labelStart = braceStart;
    const labelEnd = braceEnd + 1;
    const originalText = text.substring(labelStart, labelEnd);

    // Check if the cursor is inside the label command
    if (cursorOffset < index || cursorOffset > labelEnd) return { result: undefined, message: "" };

    return {
        result: {
            originalText,
            labelStart,
            labelEnd,
        },
        message: "",
    };
}
