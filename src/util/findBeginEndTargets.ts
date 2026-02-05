import * as vscode from 'vscode';
import isInComment from '../LLText/isInComment';

export type BeginEndResult = {
    originalText: string;
    cursorPos: number;
    newTextCountForCursor: number;
    firstWordStart: number;
    firstWordEnd: number;
    secondWordStart: number;
    secondWordEnd: number;
};

export type BeginEndTargetSearchResult = {
    result: BeginEndResult | undefined;
    message: string;
};

class Command {
    success: boolean = false;
    errorMessage: string = '';
    isBegin: boolean = false;
    commandStart: number = -1; // open interval
    braceStart: number = -1;   // open interval
    wordStart: number = -1;    // open interval
    wordEnd: number = -1;      // closed interval
    braceEnd: number = -1;     // closed interval

    //  \begin { XXX }     (In LaTeX, no spaces or line breaks are allowed in braces)
    // 0      6 7   A B    (Thus, wordStart = braceStart + 1, wordEnd = braceEnd - 1)

    constructor(text: string | undefined, cursorOffset: number | undefined) {
        if (text === undefined || cursorOffset === undefined) return;

        // Find the backslash before the cursor
        let index = cursorOffset;
        while (index > 0 && text[index - 1] !== '\n' && text[index] !== '\\') index--;
        if (text[index] !== '\\') return;
        this.commandStart = index;

        // Check if the cursor is inside \begin{...} or \end{...}
        if (text.slice(index, index + 6) === '\\begin') {
            this.isBegin = true;
            this.braceStart = index + 6;
        } else if (text.slice(index, index + 4) === '\\end') {
            this.isBegin = false;
            this.braceStart = index + 4;
        } else
            return;

        this.wordStart = this.braceStart + 1;

        // Find the closing brace
        let wordEnd = this.wordStart;
        let braceDepth = 1;
        while (wordEnd < text.length && text[wordEnd] !== '\n') {
            if (text[wordEnd] === '{') braceDepth++;
            if (text[wordEnd] === '}') braceDepth--;
            if (braceDepth === 0) break;
            wordEnd++;
        }
        if (braceDepth !== 0 || text[wordEnd] !== '}') {
            this.errorMessage = 'Failed to find the command to rename.';
            vscode.window.showErrorMessage(this.errorMessage);
            return;
        }
        this.wordEnd = wordEnd;
        this.braceEnd = wordEnd + 1;

        // Check if the content inside the braces is a single word
        const content = text.substring(this.wordStart, this.wordEnd);
        if (!content.match(/^\w+\*?$/)) { // This matches [1+ word characters][optional *]
            this.errorMessage = 'The content inside the braces is not a single word.';
            vscode.window.showErrorMessage(this.errorMessage);
            return;
        }

        // Check if the cursor is inside the command
        if (cursorOffset < this.commandStart || cursorOffset > this.braceEnd) {
            this.errorMessage = 'The cursor is not inside the command.';
            vscode.window.showErrorMessage(this.errorMessage);
            return;
        }

        this.success = true;
    }

    parseFromIndex(text: string, delta: number, index: number): Command {
        // From the index at "\", parse the command
        console.assert(text[index] === '\\');
        this.commandStart = index;
        this.braceStart = text.indexOf('{', this.commandStart);
        this.braceEnd = text.indexOf('}', this.braceStart) + 1;
        if (text[this.braceStart] !== '{' || text[this.braceEnd - 1] !== '}') {
            this.errorMessage = 'bug: parseFromIndex failed.';
            vscode.window.showErrorMessage(this.errorMessage);
            return this;
        }
        this.wordStart = this.braceStart + 1;
        this.wordEnd = this.braceEnd - 1;
        this.isBegin = delta === 1;
        return this;
    }
}

function findCorrespondingCommand(text: string, command: Command): Command {
    let otherCommand = new Command(undefined, undefined);

    // Extract all \begin{...} and \end{...} commands
    let cmdPairs = [];
    for (const { regex, delta } of [
        { regex: /\\begin\{.*\}/g, delta: +1 },
        { regex: /\\end\{.*\}/g, delta: -1 }
    ])
        for (const match of text.matchAll(regex)) {
            if (isInComment(text, match.index)) continue;
            cmdPairs.push({ index: match.index, delta, depth: 0 });
        }
    cmdPairs.sort((a, b) => a.index - b.index);

    // Check if the commands are properly nested
    let depth = 0;
    for (let pair of cmdPairs) {
        pair.depth = (depth += pair.delta);
        if (pair.depth < 0) break;
    }
    if (depth !== 0) {
        otherCommand.errorMessage = "Unmatched \\begin and \\end commands. Are the commands valid and properly nested?";
        vscode.window.showErrorMessage(otherCommand.errorMessage);
        return otherCommand;
    }

    // Find the corresponding command
    const commandIndex = cmdPairs.findIndex(pair => pair.index === command.commandStart);
    if (commandIndex === -1) {
        otherCommand.errorMessage = 'bug: the selected command is not found in the text.';
        vscode.window.showErrorMessage(otherCommand.errorMessage);
        return otherCommand;
    }
    const delta = cmdPairs[commandIndex].delta;
    let targetIndex = commandIndex;
    while (
        delta === +1 ?
            cmdPairs[commandIndex].depth - cmdPairs[commandIndex].delta !== cmdPairs[targetIndex].depth :
            cmdPairs[targetIndex].depth - cmdPairs[targetIndex].delta !== cmdPairs[commandIndex].depth
    ) {
        targetIndex += delta;
        if (targetIndex < 0 || targetIndex >= cmdPairs.length) {
            otherCommand.errorMessage = 'bug: the corresponding command is not found.';
            vscode.window.showErrorMessage(otherCommand.errorMessage);
            return otherCommand;
        }
    }

    otherCommand.success = true;
    return otherCommand.parseFromIndex(text, cmdPairs[targetIndex].delta, cmdPairs[targetIndex].index);
}

export default function findBeginEndTargets(
    text: string,
    cursorOffset: number,
): BeginEndTargetSearchResult {
    let command = new Command(text, cursorOffset);
    if (!command.success) return { result: undefined, message: command.errorMessage };

    let otherCommand = findCorrespondingCommand(text, command);
    if (!otherCommand.success) return { result: undefined, message: otherCommand.errorMessage };

    if (text.substring(command.wordStart, command.wordEnd) !== text.substring(otherCommand.wordStart, otherCommand.wordEnd))
        return { result: undefined, message: 'The content inside \\begin{...} and \\end{...} should be the same.' };


    const s1 = Math.min(command.wordStart, otherCommand.wordStart);
    const e1 = Math.min(command.wordEnd, otherCommand.wordEnd);
    const s2 = Math.max(command.wordStart, otherCommand.wordStart);
    const e2 = Math.max(command.wordEnd, otherCommand.wordEnd);

    const originalText = text.substring(command.wordStart, command.wordEnd);
    const cursorPos = (command.wordStart === s1)
        ? s1 // + newText.length
        : s1 + s2 - e1; // + 2 * newText.length
    const newTextCountForCursor = 2 - Number(command.wordStart === s1);

    return {
        result: {
            originalText,
            cursorPos,
            newTextCountForCursor,
            firstWordStart: s1,
            firstWordEnd: e1,
            secondWordStart: s2,
            secondWordEnd: e2,
        },
        message: "",
    };
}
