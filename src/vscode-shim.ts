// Mock VS Code API for web builds

export interface IPosition {
    line: number;
    character: number;
}

export interface IRange {
    start: IPosition;
    end: IPosition;
}

export interface Diagnostic {
    range: IRange;
    message: string;
    severity: DiagnosticSeverity;
    source?: string;
    code?: string | number;
}

export enum DiagnosticSeverity {
    Error = 0,
    Warning = 1,
    Information = 2,
    Hint = 3
}

export interface TextDocument {
    getText(range?: IRange): string;
    lineAt(line: number): { text: string };
    lineCount: number;
    positionAt(offset: number): IPosition;
    offsetAt(position: IPosition): number;
    languageId: string;
}

export class Range implements IRange {
    start: IPosition;
    end: IPosition;

    constructor(startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
        this.start = { line: startLine, character: startCharacter };
        this.end = { line: endLine, character: endCharacter };
    }
}

export class Position implements IPosition {
    line: number;
    character: number;

    constructor(line: number, character: number) {
        this.line = line;
        this.character = character;
    }
}

export class Uri {
    static file(path: string) {
        return new Uri(path);
    }

    constructor(private path: string) { }

    toString() {
        return this.path;
    }
}

export const workspace = {
    getConfiguration: (_section?: string) => ({
        get: <T>(key: string, defaultValue?: T): T => {
            // Return default values for web version
            if (key === 'disabledRules') return [] as any;
            if (key === 'exceptions') return [] as any;
            if (key === 'userDefinedRules') return [] as any;
            return defaultValue as any;
        }
    })
};

export const window = {
    showErrorMessage: (message: string) => {
        console.error(message);
    },
    showWarningMessage: (message: string) => {
        console.warn(message);
    },
    showInformationMessage: (message: string) => {
        console.info(message);
    }
};

// Export as default for compatibility
export default {
    Range,
    Position,
    Uri,
    DiagnosticSeverity,
    workspace,
    window
};