import computeValidRanges from '../LLText/computeValidRanges';

export default function convertAlignBodyToEquationBody(content: string): string {
    const validRanges = computeValidRanges(content, 'latex');
    let nest = 0;
    let rangeIndex = 0;
    let isInsideValidRange = false;
    let nextRangeBoundary = 0;
    let i = 0;
    let out = '';

    const refreshValidity = (index: number) => {
        while (rangeIndex < validRanges.length && index >= validRanges[rangeIndex][1])
            rangeIndex++;

        if (rangeIndex >= validRanges.length) {
            isInsideValidRange = false;
            nextRangeBoundary = Number.POSITIVE_INFINITY;
            return;
        }

        const [start, end] = validRanges[rangeIndex];
        isInsideValidRange = start <= index && index < end;
        nextRangeBoundary = isInsideValidRange ? end : start;
    };

    refreshValidity(0);

    while (i < content.length) {
        if (i >= nextRangeBoundary)
            refreshValidity(i);

        if (content.startsWith('\\begin{', i)) {
            if (isInsideValidRange) nest++;
            out += '\\begin{';
            i += '\\begin{'.length;
            continue;
        }

        if (content.startsWith('\\end{', i)) {
            if (isInsideValidRange) nest = Math.max(0, nest - 1);
            out += '\\end{';
            i += '\\end{'.length;
            continue;
        }

        if (content.startsWith('\\\\', i)) {
            if (isInsideValidRange && nest === 0)
                out += '  ';
            else
                out += '\\\\';
            i += 2;
            continue;
        }

        if (content[i] === '&' && isInsideValidRange && nest === 0)
            out += ' ';
        else
            out += content[i];

        i++;
    }

    return out;
}
