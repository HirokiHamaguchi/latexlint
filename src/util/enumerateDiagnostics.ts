import * as vscode from 'vscode';
import LLAlignAnd from '../LL/LLAlignAnd';
import LLAlignEnd from '../LL/LLAlignEnd';
import LLAlignSingleLine from '../LL/LLAlignSingleLine';
import LLColonEqq from '../LL/LLColonEqq';
import LLColonForMapping from '../LL/LLColonForMapping';
import LLCref from '../LL/LLCref';
import LLDoubleQuotes from '../LL/LLDoubleQuotes';
import LLENDash from '../LL/LLENDash';
import LLEqnarray from '../LL/LLEqnarray';
import LLNonASCII from '../LL/LLNonASCII';
import LLLlGg from '../LL/LLLlGg';
import LLRefEq from '../LL/LLRefEq';
import LLSharp from '../LL/LLSharp';
import LLSI from '../LL/LLSI';
import LLT from '../LL/LLT';
import LLTitle from '../LL/LLTitle';
import LLUserDefined from '../LL/LLUserDefined';

export default function enumerateDiagnostics(doc: vscode.TextDocument): vscode.Diagnostic[] {
    const config = vscode.workspace.getConfiguration('latexlint').get<string[]>('config') || [];
    const diagnostics: vscode.Diagnostic[] = [];
    const txt = doc.getText();
    for (const [ruleName, rule] of Object.entries({
        LLAlignAnd,
        LLAlignEnd,
        LLAlignSingleLine,
        LLColonEqq,
        LLColonForMapping,
        LLCref,
        LLDoubleQuotes,
        LLENDash,
        LLEqnarray,
        LLNonASCII,
        LLLlGg,
        LLRefEq,
        LLSharp,
        LLSI,
        LLT,
        LLTitle,
        LLUserDefined,
    })) {
        if (config.includes(ruleName)) continue;
        diagnostics.push(...rule(doc, txt));
    }
    return diagnostics;
}
