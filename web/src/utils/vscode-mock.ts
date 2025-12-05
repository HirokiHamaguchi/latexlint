// Simplified mock VS Code API for web builds using Monaco Editor
// This version leverages Monaco Editor's built-in types and functionality

import type * as monaco from 'monaco-editor';

// Thenable type definition
export interface Thenable<T> {
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | Thenable<TResult1>) | undefined | null,
        onrejected?: ((reason: unknown) => TResult2 | Thenable<TResult2>) | undefined | null
    ): Thenable<TResult1 | TResult2>;
}

// Re-export Monaco's Position as VS Code Position
export class Position {
    line: number;
    character: number;

    constructor(line: number, character: number) {
        this.line = Math.max(0, line);
        this.character = Math.max(0, character);
    }

    isBefore(other: Position): boolean {
        return this.line < other.line || (this.line === other.line && this.character < other.character);
    }

    isBeforeOrEqual(other: Position): boolean {
        return this.line < other.line || (this.line === other.line && this.character <= other.character);
    }

    isAfter(other: Position): boolean {
        return this.line > other.line || (this.line === other.line && this.character > other.character);
    }

    isAfterOrEqual(other: Position): boolean {
        return this.line > other.line || (this.line === other.line && this.character >= other.character);
    }

    isEqual(other: Position): boolean {
        return this.line === other.line && this.character === other.character;
    }

    compareTo(other: Position): number {
        if (this.line < other.line) return -1;
        if (this.line > other.line) return 1;
        if (this.character < other.character) return -1;
        if (this.character > other.character) return 1;
        return 0;
    }

    translate(lineDelta?: number, characterDelta?: number): Position;
    translate(change: { lineDelta?: number; characterDelta?: number }): Position;
    translate(lineDeltaOrChange?: number | { lineDelta?: number; characterDelta?: number }, characterDelta?: number): Position {
        let lineDelta: number;
        let charDelta: number;

        if (typeof lineDeltaOrChange === 'object') {
            lineDelta = lineDeltaOrChange.lineDelta || 0;
            charDelta = lineDeltaOrChange.characterDelta || 0;
        } else {
            lineDelta = lineDeltaOrChange || 0;
            charDelta = characterDelta || 0;
        }

        return new Position(this.line + lineDelta, this.character + charDelta);
    }

    with(line?: number, character?: number): Position;
    with(change: { line?: number; character?: number }): Position;
    with(lineOrChange?: number | { line?: number; character?: number }, character?: number): Position {
        if (typeof lineOrChange === 'object') {
            return new Position(
                lineOrChange.line !== undefined ? lineOrChange.line : this.line,
                lineOrChange.character !== undefined ? lineOrChange.character : this.character
            );
        } else {
            return new Position(
                lineOrChange !== undefined ? lineOrChange : this.line,
                character !== undefined ? character : this.character
            );
        }
    }

    // Convert to Monaco Position (0-based line, 1-based column)
    toMonacoPosition(): monaco.IPosition {
        return { lineNumber: this.line + 1, column: this.character + 1 };
    }

    // Create from Monaco Position
    static fromMonacoPosition(pos: monaco.IPosition): Position {
        return new Position(pos.lineNumber - 1, pos.column - 1);
    }
}

// Re-export Monaco's Range as VS Code Range
export class Range {
    start: Position;
    end: Position;

    constructor(start: Position, end: Position);
    constructor(startLine: number, startCharacter: number, endLine: number, endCharacter: number);
    constructor(startOrLine: Position | number, endOrCharacter: Position | number, endLine?: number, endCharacter?: number) {
        if (typeof startOrLine === 'number' && typeof endOrCharacter === 'number' && endLine !== undefined && endCharacter !== undefined) {
            this.start = new Position(startOrLine, endOrCharacter);
            this.end = new Position(endLine, endCharacter);
        } else {
            this.start = startOrLine as Position;
            this.end = endOrCharacter as Position;
        }
    }

    isEmpty: boolean = false;
    isSingleLine: boolean = true;

    contains(positionOrRange: Position | Range): boolean {
        if (positionOrRange instanceof Position) {
            return this.start.line <= positionOrRange.line &&
                this.end.line >= positionOrRange.line &&
                (this.start.line < positionOrRange.line || this.start.character <= positionOrRange.character) &&
                (this.end.line > positionOrRange.line || this.end.character >= positionOrRange.character);
        } else {
            return this.contains(positionOrRange.start) && this.contains(positionOrRange.end);
        }
    }

    isEqual(other: Range): boolean {
        return this.start.isEqual(other.start) && this.end.isEqual(other.end);
    }

    intersection(range: Range): Range | undefined {
        const start = this.start.isAfter(range.start) ? this.start : range.start;
        const end = this.end.isBefore(range.end) ? this.end : range.end;

        if (start.isAfterOrEqual(end)) {
            return undefined;
        }

        return new Range(start, end);
    }

    union(other: Range): Range {
        const start = this.start.isBefore(other.start) ? this.start : other.start;
        const end = this.end.isAfter(other.end) ? this.end : other.end;
        return new Range(start, end);
    }

    with(change: { start?: Position; end?: Position }): Range;
    with(start?: Position, end?: Position): Range;
    with(startOrChange?: Position | { start?: Position; end?: Position }, end?: Position): Range {
        if (startOrChange && typeof startOrChange === 'object' && 'start' in startOrChange) {
            return new Range(
                startOrChange.start || this.start,
                startOrChange.end || this.end
            );
        } else {
            return new Range(
                (startOrChange as Position) || this.start,
                end || this.end
            );
        }
    }

    // Convert to Monaco Range
    toMonacoRange(): monaco.IRange {
        return {
            startLineNumber: this.start.line + 1,
            startColumn: this.start.character + 1,
            endLineNumber: this.end.line + 1,
            endColumn: this.end.character + 1,
        };
    }

    // Create from Monaco Range
    static fromMonacoRange(range: monaco.IRange): Range {
        return new Range(
            range.startLineNumber - 1,
            range.startColumn - 1,
            range.endLineNumber - 1,
            range.endColumn - 1
        );
    }
}

// Mock Uri class (simplified, as Monaco doesn't provide this)
export class Uri {
    scheme: string;
    authority: string;
    path: string;
    query: string;
    fragment: string;

    constructor(scheme: string, authority: string, path: string, query: string, fragment: string) {
        this.scheme = scheme;
        this.authority = authority;
        this.path = path;
        this.query = query;
        this.fragment = fragment;
    }

    static file(path: string): Uri {
        return new Uri('file', '', path, '', '');
    }

    static parse(value: string): Uri {
        try {
            const url = new URL(value);
            return new Uri(url.protocol.slice(0, -1), url.hostname, url.pathname, url.search.slice(1), url.hash.slice(1));
        } catch {
            return new Uri('file', '', value, '', '');
        }
    }

    toString(): string {
        let result = this.scheme + ':';
        if (this.authority) {
            result += '//' + this.authority;
        }
        result += this.path;
        if (this.query) {
            result += '?' + this.query;
        }
        if (this.fragment) {
            result += '#' + this.fragment;
        }
        return result;
    }

    get fsPath(): string {
        if (this.scheme !== 'file') {
            return this.path;
        }
        let path = this.path;
        if (path.startsWith('/') && /^[a-zA-Z]:/.test(path.substring(1))) {
            path = path.substring(1);
        }
        return path.replace(/\//g, '\\');
    }
}

// Mock DiagnosticSeverity enum
export enum DiagnosticSeverity {
    Error = 0,
    Warning = 1,
    Information = 2,
    Hint = 3
}

// Mock EndOfLine enum
export enum EndOfLine {
    LF = 1,
    CRLF = 2
}

// Minimal TextDocument interface
export interface TextDocument {
    uri: Uri;
    fileName: string;
    isUntitled: boolean;
    languageId: string;
    version: number;
    isDirty: boolean;
    isClosed: boolean;
    save(): Thenable<boolean>;
    eol: EndOfLine;
    lineCount: number;
    encoding: string;
    lineAt(line: number): TextLine;
    lineAt(position: Position): TextLine;
    offsetAt(position: Position): number;
    positionAt(offset: number): Position;
    getText(range?: Range): string;
    getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined;
    validateRange(range: Range): Range;
    validatePosition(position: Position): Position;
}

export interface TextLine {
    lineNumber: number;
    text: string;
    range: Range;
    rangeIncludingLineBreak: Range;
    firstNonWhitespaceCharacterIndex: number;
    isEmptyOrWhitespace: boolean;
}

export interface Diagnostic {
    range: Range;
    message: string;
    severity?: DiagnosticSeverity;
    source?: string;
    code?: string | number;
    relatedInformation?: DiagnosticRelatedInformation[];
}

export interface DiagnosticRelatedInformation {
    location: Location;
    message: string;
}

export interface Location {
    uri: Uri;
    range: Range;
}

// Helper function to create TextDocument from plain text
export function createMockTextDocument(content: string, uri: Uri, languageId: string): TextDocument {
    const lines = content.split('\n');

    const offsetAt = (position: Position): number => {
        let offset = 0;
        for (let i = 0; i < position.line && i < lines.length; i++) {
            offset += lines[i].length + 1;
        }
        return offset + Math.min(position.character, lines[position.line]?.length || 0);
    };

    const positionAt = (offset: number): Position => {
        let currentOffset = 0;
        for (let line = 0; line < lines.length; line++) {
            const lineLength = lines[line].length;
            if (currentOffset + lineLength >= offset) {
                return new Position(line, offset - currentOffset);
            }
            currentOffset += lineLength + 1;
        }
        return new Position(lines.length - 1, lines[lines.length - 1]?.length || 0);
    };

    return {
        uri,
        fileName: uri.fsPath,
        isUntitled: uri.scheme !== 'file',
        languageId: languageId,
        version: 1,
        isDirty: false,
        isClosed: false,
        save: (): Thenable<boolean> => Promise.resolve(true),
        eol: EndOfLine.LF,
        lineCount: lines.length,
        encoding: 'utf8',

        lineAt: (lineOrPosition: number | Position): TextLine => {
            const lineNumber = typeof lineOrPosition === 'number' ? lineOrPosition : lineOrPosition.line;
            const text = lines[lineNumber] || '';
            return {
                lineNumber,
                text,
                range: new Range(new Position(lineNumber, 0), new Position(lineNumber, text.length)),
                rangeIncludingLineBreak: new Range(
                    new Position(lineNumber, 0),
                    new Position(lineNumber + 1, 0)
                ),
                firstNonWhitespaceCharacterIndex: text.search(/\S/),
                isEmptyOrWhitespace: text.trim().length === 0
            };
        },

        offsetAt,
        positionAt,

        getText: (range?: Range): string => {
            if (!range) {
                return content;
            }
            const startOffset = offsetAt(range.start);
            const endOffset = offsetAt(range.end);
            return content.substring(startOffset, endOffset);
        },

        getWordRangeAtPosition: (position: Position, regex?: RegExp): Range | undefined => {
            const line = lines[position.line];
            if (!line) return undefined;

            const wordRegex = regex || /\w+/g;
            let match: RegExpExecArray | null;

            while ((match = wordRegex.exec(line)) !== null) {
                const start = match.index;
                const end = start + match[0].length;

                if (start <= position.character && position.character <= end) {
                    return new Range(
                        new Position(position.line, start),
                        new Position(position.line, end)
                    );
                }
            }

            return undefined;
        },

        validateRange: (range: Range): Range => {
            const maxLine = Math.max(0, lines.length - 1);
            const startLine = Math.max(0, Math.min(range.start.line, maxLine));
            const endLine = Math.max(0, Math.min(range.end.line, maxLine));

            const startChar = Math.max(0, Math.min(range.start.character, lines[startLine]?.length || 0));
            const endChar = Math.max(0, Math.min(range.end.character, lines[endLine]?.length || 0));

            return new Range(
                new Position(startLine, startChar),
                new Position(endLine, endChar)
            );
        },

        validatePosition: (position: Position): Position => {
            const maxLine = Math.max(0, lines.length - 1);
            const line = Math.max(0, Math.min(position.line, maxLine));
            const character = Math.max(0, Math.min(position.character, lines[line]?.length || 0));
            return new Position(line, character);
        }
    };
}

// Minimal workspace mock (configuration only)
export const workspace = {
    getConfiguration: (section?: string) => {
        return {
            get: <T>(key: string, defaultValue?: T): T => {
                const storageKey = section ? `${section}.${key}` : key;
                const stored = localStorage.getItem(`vscode-config-${storageKey}`);
                if (stored !== null) {
                    try {
                        return JSON.parse(stored);
                    } catch {
                        return stored as T;
                    }
                }
                return defaultValue as T;
            },
        };
    },
};

// Minimal window mock for error messages
export const window = {
    showErrorMessage: (message: string): Thenable<string | undefined> => {
        console.error(message);
        // In a real web implementation, you might show a modal or notification
        return Promise.resolve(undefined);
    },
    showWarningMessage: (message: string): Thenable<string | undefined> => {
        console.warn(message);
        return Promise.resolve(undefined);
    },
    showInformationMessage: (message: string): Thenable<string | undefined> => {
        console.info(message);
        return Promise.resolve(undefined);
    },
};

// Export as default for compatibility
const vscode = {
    Range,
    Position,
    Uri,
    DiagnosticSeverity,
    EndOfLine,
    workspace,
    window,
    createMockTextDocument,
};

export default vscode;
