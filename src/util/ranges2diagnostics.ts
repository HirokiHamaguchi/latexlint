import * as vscode from 'vscode';
import { LLCode, extensionDisplayName, severity } from '../util/constants';
import { getCodeWithURI } from './getCodeWithURI';

export default function ranges2diagnostics(
    code: LLCode,
    message: string,
    ranges: vscode.Range[]
): vscode.Diagnostic[] {
    return ranges.map(range => ({
        code: getCodeWithURI(code),
        message: message,
        range: range,
        severity: severity[code],
        source: extensionDisplayName,
    }));
}
