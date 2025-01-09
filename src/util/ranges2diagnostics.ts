import * as vscode from 'vscode';
import { LLCode, extensionDisplayName, severity } from '../util/constants';

export default function ranges2diagnostics(
    code: LLCode,
    message: string,
    ranges: vscode.Range[]
): vscode.Diagnostic[] {
    return ranges.map(range => ({
        code: {
            value: code,
            target: vscode.Uri.parse(`https://github.com/hari64boli64/latexlint?tab=readme-ov-file#${code.toLowerCase()}`),
        },
        message: message,
        range: range,
        severity: severity[code],
        source: extensionDisplayName,
    }));
}
