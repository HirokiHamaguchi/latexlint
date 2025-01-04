/* To Title Case © 2018 David Gouch | https://github.com/gouch/to-title-case */

// hari64boli64 modified the function in
// https://github.com/gouch/to-title-case/blob/master/to-title-case.js
// to use for our project

export default function toTitleCase(input: string): string {
    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
    const alphanumericPattern = /([A-Za-z0-9\\])/;
    const wordSeparators = /([ ~-])/;

    return input
        .split(wordSeparators)
        .map((current: string, index: number, array: string[]) => {
            if (
                /* Check for small words */
                current.search(smallWords) > -1 &&
                /* Skip first and last word */
                index !== 0 &&
                index !== array.length - 1 &&
                /* Ignore small words that start a hyphenated phrase */
                (array[index + 1] !== '-' ||
                    (array[index - 1] === '-' && array[index + 1] === '-'))
            )
                return current.toLowerCase();

            /* Ignore intentional capitalization */
            if (current.substring(1).search(/[A-Z]|\../) > -1) return current;

            /* Capitalize the first letter */
            return current.replace(alphanumericPattern, (match: string) => match.toUpperCase());
        })
        .join('');
}
