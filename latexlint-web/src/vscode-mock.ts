// Mock VS Code API for web builds

// Mock Range class
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
}

// Mock Position class
export class Position {
    line: number;
    character: number;

    constructor(line: number, character: number) {
        this.line = line;
        this.character = character;
    }
}

// Mock Uri class
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
        // Simple URI parsing - this would need to be more robust in a real implementation
        return new Uri('file', '', value, '', '');
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

// Mock workspace
export const workspace = {
    // Add workspace methods as needed
};

// Mock window
export const window = {
    // Add window methods as needed
};

// Mock types
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

// Export as default for compatibility
const vscode = {
    Range,
    Position,
    Uri,
    DiagnosticSeverity,
    EndOfLine,
    workspace,
    window
};

export default vscode;