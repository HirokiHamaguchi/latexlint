import type * as vscode from 'vscode';

// Build-time alias for the small public VS Code API surface used by lint rules.
// It deliberately has no editor state or process-wide module loader hooks.
export class Position {
    constructor(readonly line: number, readonly character: number) {}

    translate(lineDelta = 0, characterDelta = 0): Position {
        return new Position(this.line + lineDelta, this.character + characterDelta);
    }
}

export class Range {
    constructor(readonly start: Position, readonly end: Position) {}
}

export class Uri {
    private constructor(readonly value: string) {}

    static parse(value: string): Uri { return new Uri(value); }
    toString(): string { return this.value; }
}

export enum DiagnosticSeverity { Error, Warning, Information, Hint }

export const window = {
    // Invalid user rules must fail the CLI instead of disappearing into a UI notice.
    showErrorMessage(message: string): never { throw new Error(message); }
};

/** VS Code positions count UTF-16 code units and exclude line terminators.
 * https://code.visualstudio.com/api/references/vscode-api#TextDocument
 */
class TextCoordinates {
    readonly starts = [0];
    readonly lines: string[];

    constructor(readonly text: string) {
        for (const match of text.matchAll(/\r\n|\r|\n/g))
            this.starts.push(match.index + match[0].length);
        this.lines = text.split(/\r\n|\r|\n/);
    }

    offsetAt(position: { line: number; character: number }): number {
        if (position.line < 0) return 0;
        if (position.line >= this.lines.length) return this.text.length;
        return this.starts[position.line] + Math.max(0, Math.min(position.character, this.lines[position.line].length));
    }

    positionAt(offset: number): { line: number; character: number } {
        offset = Math.max(0, Math.min(offset, this.text.length));
        let low = 0;
        let high = this.starts.length;
        while (low + 1 < high) {
            const middle = Math.floor((low + high) / 2);
            if (this.starts[middle] > offset) high = middle;
            else low = middle;
        }
        return { line: low, character: Math.min(offset - this.starts[low], this.lines[low].length) };
    }
}

export function createDocument(text: string, languageId: string): vscode.TextDocument {
    const coordinates = new TextCoordinates(text);
    const offsetAt = (position: vscode.Position) => coordinates.offsetAt(position);
    const positionAt = (offset: number) => {
        const pos = coordinates.positionAt(offset);
        return new Position(pos.line, pos.character);
    };
    // Rules only consume these read-only TextDocument operations. The adapter
    // cannot save, edit or access VS Code; file I/O belongs to the CLI entry point.
    return {
        languageId,
        offsetAt,
        positionAt,
        getText: (range?: vscode.Range) => range
            ? text.slice(offsetAt(range.start), offsetAt(range.end)) : text,
        lineCount: coordinates.lines.length,
        lineAt: (line: number | vscode.Position) => {
            const lineNumber = typeof line === 'number' ? line : line.line;
            const content = coordinates.lines[lineNumber];
            if (content === undefined) throw new Error(`Invalid line: ${lineNumber}`);
            const start = new Position(lineNumber, 0);
            const end = new Position(lineNumber, content.length);
            return {
                lineNumber, text: content, range: new Range(start, end),
                rangeIncludingLineBreak: new Range(start, lineNumber + 1 < coordinates.lines.length
                    ? new Position(lineNumber + 1, 0) : end),
                firstNonWhitespaceCharacterIndex: content.search(/\S/) < 0 ? content.length : content.search(/\S/),
                isEmptyOrWhitespace: content.trim().length === 0
            };
        }
    } as unknown as vscode.TextDocument;
}
