import * as vscode from 'vscode';
import LLAlignAnd from '../LL/LLAlignAnd';
import LLAlignEnd from '../LL/LLAlignEnd';
import LLAlignSingleLine from '../LL/LLAlignSingleLine';
import LLBig from '../LL/LLBig';
import LLBracketCurly from '../LL/LLBracketCurly';
import LLBracketMissing from '../LL/LLBracketMissing';
import LLBracketRound from '../LL/LLBracketRound';
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
import formatException from './formatException';

export default function enumerateDiagnostics(doc: vscode.TextDocument): vscode.Diagnostic[] {
    const disabledRules = vscode.workspace.getConfiguration('latexlint').get<string[]>('disabledRules') || [];
    const exceptions = vscode.workspace.getConfiguration('latexlint').get<string[]>('exceptions') || [];
    const diagnostics: vscode.Diagnostic[] = [];
    const txt = doc.getText();
    for (const [ruleName, rule] of Object.entries({
        LLAlignAnd,
        LLAlignEnd,
        LLAlignSingleLine,
        LLBig,
        LLBracketCurly,
        LLBracketMissing,
        LLBracketRound,
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
        if (disabledRules.includes(ruleName)) continue;
        for (const diagnostic of rule(doc, txt))
            if (!exceptions.includes(formatException(doc.getText(diagnostic.range))))
                diagnostics.push(diagnostic);
    }
    return diagnostics;
}
