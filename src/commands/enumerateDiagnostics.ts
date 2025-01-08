import * as vscode from 'vscode';
import LLAlignAnd from '../LL/LLAlignAnd';
import LLAlignSingleLine from '../LL/LLAlignSingleLine';
import LLColonEqq from '../LL/LLColonEqq';
import LLColonForMapping from '../LL/LLColonForMapping';
import LLCref from '../LL/LLCref';
import LLDoubleQuotation from '../LL/LLDoubleQuotation';
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
    console.log(`Enumerating diagnostics for ${doc.uri}`);
    const config = vscode.workspace.getConfiguration('latexlint').get('config') as string[];
    const diagnostics: vscode.Diagnostic[] = [];
    for (const [ruleName, rule] of Object.entries({
        LLAlignAnd,
        LLAlignSingleLine,
        LLColonEqq,
        LLColonForMapping,
        LLCref,
        LLDoubleQuotation,
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
        console.log(`Check: ${ruleName}`);
        diagnostics.push(...rule(doc));
    }

    return diagnostics;
}
