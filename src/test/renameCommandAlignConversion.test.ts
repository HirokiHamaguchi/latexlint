import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import findBeginEndTargets from '../util/findBeginEndTargets';
import convertAlignBodyToEquationBody from '../util/renameCommandAlignConversion';

function getOffsetFromLineAndColumn(text: string, line1: number, column1: number): number {
    const lines = text.split('\n');
    const prefix = lines.slice(0, line1 - 1).join('\n');
    return (prefix.length === 0 ? 0 : prefix.length + 1) + (column1 - 1);
}

function countOccurrences(text: string, pattern: RegExp): number {
    return (text.match(pattern) ?? []).length;
}

suite('renameCommand align conversion test suite', () => {
    test('line 34 col 8 points to align and conversion counts match expectations', () => {
        const filePath = path.resolve(__dirname, '../../sample/otherFeature.tex');
        const text = fs.readFileSync(filePath, 'utf8');

        // 1-indexed cursor position specified by the user request.
        const cursorOffset = getOffsetFromLineAndColumn(text, 34, 8);
        const resBE = findBeginEndTargets(text, cursorOffset);

        assert.ok(resBE.result !== undefined, 'begin/end target should be detected');
        assert.strictEqual(resBE.result?.originalText, 'align');

        const originalContent = text.slice(resBE.result!.firstWordEnd, resBE.result!.secondWordStart);
        assert.strictEqual(countOccurrences(originalContent, /&/g), 10);
        assert.strictEqual(countOccurrences(originalContent, /\\\\/g), 8);

        const convertedContent = convertAlignBodyToEquationBody(originalContent);
        assert.strictEqual(countOccurrences(convertedContent, /&/g), 6);
        assert.strictEqual(countOccurrences(convertedContent, /\\\\/g), 5);
    });
});
