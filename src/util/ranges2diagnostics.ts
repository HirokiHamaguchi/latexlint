import * as vscode from 'vscode';
import { LLCode, extensionDisplayName, severity } from '../util/constants';
import { getCodeWithURI } from './getCodeWithURI';
import isInCodeBlock from '../util/isInCodeBlock';

export default function ranges2diagnostics(
    doc: vscode.TextDocument,
    code: LLCode,
    messages: string | string[],
    ranges: vscode.Range[]
): vscode.Diagnostic[] {
    if (typeof messages === 'string') messages = [messages];
    else console.assert(messages.length === ranges.length);

    return (doc.languageId === "markdown"
        ? ranges.filter(range => !isInCodeBlock(doc, range))
        : ranges).map((range, i) => ({
            code: getCodeWithURI(code),
            message: messages[messages.length === 1 ? 0 : i],
            range,
            severity: severity[code],
            source: extensionDisplayName,
        }));
}
