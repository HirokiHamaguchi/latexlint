// Mock VS Code API for web builds

// Thenable type definition
export interface Thenable<T> {
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | Thenable<TResult1>) | undefined | null,
        onrejected?: ((reason: unknown) => TResult2 | Thenable<TResult2>) | undefined | null
    ): Thenable<TResult1 | TResult2>;
}

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
}

// Mock Position class
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
        try {
            const url = new URL(value);
            return new Uri(url.protocol.slice(0, -1), url.hostname, url.pathname, url.search.slice(1), url.hash.slice(1));
        } catch {
            // Fallback for simple file paths
            return new Uri('file', '', value, '', '');
        }
    }

    static from(components: {
        scheme: string;
        authority?: string;
        path?: string;
        query?: string;
        fragment?: string;
    }): Uri {
        return new Uri(
            components.scheme,
            components.authority || '',
            components.path || '',
            components.query || '',
            components.fragment || ''
        );
    }

    toString(skipEncoding?: boolean): string {
        // Note: skipEncoding parameter is part of VS Code API but not implemented here
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

    toJSON(): UriComponents {
        return {
            scheme: this.scheme,
            authority: this.authority,
            path: this.path,
            query: this.query,
            fragment: this.fragment
        };
    }

    get fsPath(): string {
        if (this.scheme !== 'file') {
            return this.path;
        }

        // Convert file URI to file system path
        let path = this.path;
        if (path.startsWith('/') && /^[a-zA-Z]:/.test(path.substring(1))) {
            // Windows path: /C:/Users/... -> C:/Users/...
            path = path.substring(1);
        }
        return path.replace(/\//g, '\\'); // Convert to Windows path separators
    }

    with(change: {
        scheme?: string;
        authority?: string;
        path?: string;
        query?: string;
        fragment?: string;
    }): Uri {
        return new Uri(
            change.scheme !== undefined ? change.scheme : this.scheme,
            change.authority !== undefined ? change.authority : this.authority,
            change.path !== undefined ? change.path : this.path,
            change.query !== undefined ? change.query : this.query,
            change.fragment !== undefined ? change.fragment : this.fragment
        );
    }
}

export interface UriComponents {
    scheme: string;
    authority: string;
    path: string;
    query: string;
    fragment: string;
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
    getConfiguration: (section?: string, resource?: Uri) => {
        // Note: resource parameter is part of VS Code API but not used in this mock
        // Return a configuration object that works for web
        return {
            get: <T>(key: string, defaultValue?: T): T => {
                // For web version, return sensible defaults or values from localStorage
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
            update: (key: string, value: unknown, _configurationTarget?: ConfigurationTarget | boolean) => {
                // Note: _configurationTarget parameter is part of VS Code API but not used in this mock
                // Store configuration in localStorage for web
                const storageKey = section ? `${section}.${key}` : key;
                localStorage.setItem(`vscode-config-${storageKey}`, JSON.stringify(value));
                return Promise.resolve();
            },
            has: (key: string): boolean => {
                const storageKey = section ? `${section}.${key}` : key;
                return localStorage.getItem(`vscode-config-${storageKey}`) !== null;
            },
            inspect: <T>(key: string): WorkspaceConfigurationInspect<T> | undefined => {
                const value = localStorage.getItem(`vscode-config-${section ? `${section}.${key}` : key}`);
                if (value !== null) {
                    try {
                        const parsedValue = JSON.parse(value);
                        return {
                            key,
                            defaultValue: undefined,
                            globalValue: parsedValue,
                            workspaceValue: undefined,
                            workspaceFolderValue: undefined
                        };
                    } catch {
                        return undefined;
                    }
                }
                return undefined;
            }
        };
    },
    workspaceFolders: undefined,
    name: undefined,
    rootPath: undefined,
    asRelativePath: (pathOrUri: string | Uri, _includeWorkspaceFolder?: boolean): string => {
        // Note: _includeWorkspaceFolder parameter is part of VS Code API but not used in this mock
        const path = typeof pathOrUri === 'string' ? pathOrUri : pathOrUri.fsPath;
        return path; // Simplified implementation
    },
    findFiles: (_include: GlobPattern, _exclude?: GlobPattern | null, _maxResults?: number, _token?: CancellationToken): Thenable<Uri[]> => {
        // Note: parameters are part of VS Code API but this is a simplified mock implementation
        return Promise.resolve([]);
    },
    openTextDocument: (uri?: Uri | string): Thenable<TextDocument> => {
        // Simplified implementation
        const content = '';
        const docUri = typeof uri === 'string' ? Uri.parse(uri) : uri || Uri.file('untitled.tex');
        return Promise.resolve(createMockTextDocument(content, docUri));
    },
    registerTextDocumentContentProvider: (_scheme: string, _provider: TextDocumentContentProvider): Disposable => {
        // Note: parameters are part of VS Code API but this is a simplified mock implementation
        return { dispose: () => { } };
    }
};

export enum ConfigurationTarget {
    Global = 1,
    Workspace = 2,
    WorkspaceFolder = 3
}

export interface WorkspaceConfigurationInspect<T> {
    key: string;
    defaultValue?: T;
    globalValue?: T;
    workspaceValue?: T;
    workspaceFolderValue?: T;
}

export interface Disposable {
    dispose(): unknown;
}

export interface CancellationToken {
    isCancellationRequested: boolean;
    onCancellationRequested: Event<unknown>;
}

export interface Event<T> {
    (listener: (e: T) => unknown, thisArgs?: unknown, disposables?: Disposable[]): Disposable;
}

export type GlobPattern = string | RelativePattern;

export interface RelativePattern {
    base: string;
    pattern: string;
}

export interface TextDocumentContentProvider {
    provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string>;
    onDidChange?: Event<Uri>;
}

export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;

// Helper function to create mock TextDocument
function createMockTextDocument(content: string, uri: Uri): TextDocument {
    const lines = content.split('\n');

    const offsetAt = (position: Position): number => {
        let offset = 0;
        for (let i = 0; i < position.line && i < lines.length; i++) {
            offset += lines[i].length + 1; // +1 for newline
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
            currentOffset += lineLength + 1; // +1 for newline
        }
        return new Position(lines.length - 1, lines[lines.length - 1]?.length || 0);
    };

    return {
        uri,
        fileName: uri.fsPath,
        isUntitled: uri.scheme !== 'file',
        languageId: 'latex',
        version: 1,
        isDirty: false,
        isClosed: false,
        save: (): Thenable<boolean> => Promise.resolve(true),
        eol: EndOfLine.LF,
        lineCount: lines.length,

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

// Mock window
export const window = {
    showErrorMessage: <T extends string>(message: string, ..._items: T[]): Thenable<T | undefined> => {
        console.error(message);
        alert(`Error: ${message}`);
        return Promise.resolve(undefined);
    },
    showWarningMessage: <T extends string>(message: string, ..._items: T[]): Thenable<T | undefined> => {
        console.warn(message);
        alert(`Warning: ${message}`);
        return Promise.resolve(undefined);
    },
    showInformationMessage: <T extends string>(message: string, ..._items: T[]): Thenable<T | undefined> => {
        console.info(message);
        alert(`Info: ${message}`);
        return Promise.resolve(undefined);
    },
    showInputBox: (options?: InputBoxOptions): Thenable<string | undefined> => {
        const defaultValue = options?.value || '';
        const prompt = options?.prompt || 'Please enter a value:';
        const result = globalThis.prompt(prompt, defaultValue);
        return Promise.resolve(result === null ? undefined : result);
    },
    showQuickPick: <T extends QuickPickItem>(_items: readonly T[] | Thenable<readonly T[]>, _options?: QuickPickOptions): Thenable<T | undefined> => {
        // Simplified implementation using confirm for web
        return Promise.resolve(undefined);
    },
    activeTextEditor: undefined,
    visibleTextEditors: [],
    onDidChangeActiveTextEditor: createEvent<TextEditor | undefined>(),
    onDidChangeVisibleTextEditors: createEvent<TextEditor[]>(),
    showTextDocument: (document: TextDocument | Uri, _column?: ViewColumn | TextDocumentShowOptions, _preserveFocus?: boolean): Thenable<TextEditor> => {
        // Mock implementation
        const mockEditor: TextEditor = {
            document: typeof document === 'object' && 'uri' in document ? document : createMockTextDocument('', document as Uri),
            selection: new Selection(0, 0, 0, 0),
            selections: [new Selection(0, 0, 0, 0)],
            visibleRanges: [],
            options: { tabSize: 4, insertSpaces: true },
            viewColumn: ViewColumn.Active,
            edit: () => Promise.resolve(true),
            insertSnippet: () => Promise.resolve(true),
            setDecorations: () => { },
            revealRange: () => { },
            show: () => { },
            hide: () => { }
        };
        return Promise.resolve(mockEditor);
    },
    createStatusBarItem: (alignment?: StatusBarAlignment, priority?: number): StatusBarItem => {
        return {
            alignment: alignment || StatusBarAlignment.Left,
            priority: priority || 0,
            text: '',
            tooltip: '',
            color: '',
            command: '',
            show: () => { },
            hide: () => { },
            dispose: () => { }
        };
    }
};

// Additional interfaces needed
export interface InputBoxOptions {
    value?: string;
    valueSelection?: [number, number];
    prompt?: string;
    placeHolder?: string;
    password?: boolean;
    ignoreFocusOut?: boolean;
    validateInput?: (value: string) => string | undefined | null | Thenable<string | undefined | null>;
}

export interface QuickPickItem {
    label: string;
    description?: string;
    detail?: string;
    picked?: boolean;
    alwaysShow?: boolean;
}

export interface QuickPickOptions {
    matchOnDescription?: boolean;
    matchOnDetail?: boolean;
    placeHolder?: string;
    ignoreFocusOut?: boolean;
    canPickMany?: boolean;
}

export interface TextEditor {
    document: TextDocument;
    selection: Selection;
    selections: Selection[];
    visibleRanges: Range[];
    options: TextEditorOptions;
    viewColumn?: ViewColumn;
    edit(callback: (editBuilder: TextEditorEdit) => void, options?: { undoStopBefore: boolean; undoStopAfter: boolean }): Thenable<boolean>;
    insertSnippet(snippet: SnippetString, location?: Position | Range | Position[] | Range[], options?: { undoStopBefore: boolean; undoStopAfter: boolean }): Thenable<boolean>;
    setDecorations(decorationType: TextEditorDecorationType, rangesOrOptions: Range[] | DecorationOptions[]): void;
    revealRange(range: Range, revealType?: TextEditorRevealType): void;
    show(column?: ViewColumn): void;
    hide(): void;
}

export interface TextEditorOptions {
    tabSize?: number;
    insertSpaces?: boolean;
    cursorStyle?: TextEditorCursorStyle;
    lineNumbers?: TextEditorLineNumbersStyle;
}

export interface TextEditorEdit {
    replace(location: Position | Range | Selection, value: string): void;
    insert(location: Position, value: string): void;
    delete(location: Range | Selection): void;
}

export class Selection extends Range {
    anchor: Position;
    active: Position;

    constructor(anchor: Position, active: Position);
    constructor(anchorLine: number, anchorCharacter: number, activeLine: number, activeCharacter: number);
    constructor(anchorOrLine: Position | number, activeOrCharacter: Position | number, activeLine?: number, activeCharacter?: number) {
        if (typeof anchorOrLine === 'number' && typeof activeOrCharacter === 'number' && activeLine !== undefined && activeCharacter !== undefined) {
            const anchor = new Position(anchorOrLine, activeOrCharacter);
            const active = new Position(activeLine, activeCharacter);
            super(anchor, active);
            this.anchor = anchor;
            this.active = active;
        } else {
            const anchor = anchorOrLine as Position;
            const active = activeOrCharacter as Position;
            super(anchor, active);
            this.anchor = anchor;
            this.active = active;
        }
    }

    get isReversed(): boolean {
        return this.anchor.isAfter(this.active);
    }
}

export class SnippetString {
    value: string;

    constructor(value?: string) {
        this.value = value || '';
    }

    appendText(string: string): SnippetString {
        this.value += string;
        return this;
    }

    appendTabstop(number?: number): SnippetString {
        this.value += `$${number || 0}`;
        return this;
    }

    appendPlaceholder(value: string | ((snippet: SnippetString) => unknown), number?: number): SnippetString {
        if (typeof value === 'string') {
            this.value += `\${${number || 0}:${value}}`;
        }
        return this;
    }

    appendChoice(values: string[], number?: number): SnippetString {
        this.value += `\${${number || 0}|${values.join(',')}|}`;
        return this;
    }

    appendVariable(name: string, defaultValue: string | ((snippet: SnippetString) => unknown)): SnippetString {
        if (typeof defaultValue === 'string') {
            this.value += `\${${name}:${defaultValue}}`;
        } else {
            this.value += `$${name}`;
        }
        return this;
    }
}

export enum ViewColumn {
    Active = -1,
    Beside = -2,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9
}

export interface TextDocumentShowOptions {
    viewColumn?: ViewColumn;
    preserveFocus?: boolean;
    preview?: boolean;
    selection?: Range;
}

export enum StatusBarAlignment {
    Left = 1,
    Right = 2
}

export interface StatusBarItem extends Disposable {
    alignment: StatusBarAlignment;
    priority: number;
    text: string;
    tooltip?: string;
    color?: string;
    command?: string | Command;
    show(): void;
    hide(): void;
}

export interface Command {
    title: string;
    command: string;
    tooltip?: string;
    arguments?: unknown[];
}

export enum TextEditorCursorStyle {
    Line = 1,
    Block = 2,
    Underline = 3,
    LineThin = 4,
    BlockOutline = 5,
    UnderlineThin = 6
}

export enum TextEditorLineNumbersStyle {
    Off = 0,
    On = 1,
    Relative = 2
}

export enum TextEditorRevealType {
    Default = 0,
    InCenter = 1,
    InCenterIfOutsideViewport = 2,
    AtTop = 3
}

export interface TextEditorDecorationType extends Disposable {
    key: string;
}

export interface DecorationOptions {
    range: Range;
    hoverMessage?: string | MarkdownString | (string | MarkdownString)[];
    renderOptions?: DecorationInstanceRenderOptions;
}

export interface DecorationInstanceRenderOptions {
    before?: DecorationAttachmentRenderOptions;
    after?: DecorationAttachmentRenderOptions;
}

export interface DecorationAttachmentRenderOptions {
    contentText?: string;
    contentIconPath?: string | Uri;
    border?: string;
    borderColor?: string;
    fontStyle?: string;
    fontWeight?: string;
    textDecoration?: string;
    color?: string;
    backgroundColor?: string;
    margin?: string;
    width?: string;
    height?: string;
}

export class MarkdownString {
    value: string;
    isTrusted?: boolean;
    supportThemeIcons?: boolean;
    supportHtml?: boolean;
    baseUri?: Uri;

    constructor(value?: string, supportThemeIcons?: boolean) {
        this.value = value || '';
        this.supportThemeIcons = supportThemeIcons;
    }

    appendText(value: string): MarkdownString {
        this.value += value;
        return this;
    }

    appendMarkdown(value: string): MarkdownString {
        this.value += value;
        return this;
    }

    appendCodeblock(value: string, language?: string): MarkdownString {
        this.value += `\n\`\`\`${language || ''}\n${value}\n\`\`\`\n`;
        return this;
    }
}

// Helper function to create mock events
function createEvent<T>(): Event<T> {
    const listeners: Array<(e: T) => unknown> = [];
    const event = (listener: (e: T) => unknown, _thisArgs?: unknown, disposables?: Disposable[]): Disposable => {
        listeners.push(listener);
        const disposable = {
            dispose: () => {
                const index = listeners.indexOf(listener);
                if (index >= 0) {
                    listeners.splice(index, 1);
                }
            }
        };
        if (disposables) {
            disposables.push(disposable);
        }
        return disposable;
    };
    return event;
}

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
    ConfigurationTarget,
    ViewColumn,
    StatusBarAlignment,
    TextEditorCursorStyle,
    TextEditorLineNumbersStyle,
    TextEditorRevealType,
    Selection,
    SnippetString,
    MarkdownString,
    workspace,
    window
};

export default vscode;