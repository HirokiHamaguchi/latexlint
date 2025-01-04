import * as vscode from 'vscode';
import { LLCode, messages, extensionDisplayName } from '../util/constants';

export default function ranges2diagnostics(code: LLCode, ranges: vscode.Range[]) {
    return ranges.map(range => ({
        code: code,
        message: messages[code],
        range: range,
        severity: vscode.DiagnosticSeverity.Warning,
        source: extensionDisplayName,
    }));
}
