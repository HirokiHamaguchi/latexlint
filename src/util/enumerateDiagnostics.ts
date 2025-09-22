import * as vscode from 'vscode';
import LLAlignAnd from '../LL/LLAlignAnd';
import LLAlignEnd from '../LL/LLAlignEnd';
import LLAlignSingleLine from '../LL/LLAlignSingleLine';
import LLArticle from '../LL/LLArticle';
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
import LLFootnote from '../LL/LLFootnote';
import LLJapaneseSpace from '../LL/LLJapaneseSpace';
import LLLlGg from '../LL/LLLlGg';
import LLNonASCII from '../LL/LLNonASCII';
import LLPeriod from '../LL/LLPeriod';
import LLRefEq from '../LL/LLRefEq';
import LLSI from '../LL/LLSI';
import LLSharp from '../LL/LLSharp';
import LLT from '../LL/LLT';
import LLThousands from '../LL/LLThousands';
import LLTitle from '../LL/LLTitle';
import LLUserDefined from '../LL/LLUserDefined';
import formatException from './formatException';
import enumAlignEnvs from './enumAlignEnvs';

export default function enumerateDiagnostics(doc: vscode.TextDocument): vscode.Diagnostic[] {
    const disabledRules = vscode.workspace.getConfiguration('latexlint').get<string[]>('disabledRules') || [];
    const exceptions = vscode.workspace.getConfiguration('latexlint').get<string[]>('exceptions') || [];
    const txt = doc.getText();
    const alignLikeEnvs = enumAlignEnvs(doc, txt);

    let diagnostics: vscode.Diagnostic[] = [];

    const t0 = performance.now();

    for (const [ruleName, rule] of Object.entries({
        LLAlignAnd,
        LLAlignEnd,
        LLAlignSingleLine,
    })) {
        if (disabledRules.includes(ruleName)) continue;
        const diags = rule(doc, txt, alignLikeEnvs);
        diagnostics.push(...diags);
    }

    for (const [ruleName, rule] of Object.entries({
        LLArticle,
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
        LLFootnote,
        LLJapaneseSpace,
        LLLlGg,
        LLNonASCII,
        LLPeriod,
        LLRefEq,
        LLSI,
        LLSharp,
        LLT,
        LLThousands,
        LLTitle,
        LLUserDefined,
    })) {
        if (disabledRules.includes(ruleName)) continue;
        const diags = rule(doc, txt);
        diagnostics.push(...diags);
    }

    diagnostics = diagnostics.filter(diag => !exceptions.includes(formatException(doc.getText(diag.range))));

    const t1 = performance.now();

    console.log(`enum took ${(t1 - t0).toFixed(2)} ms`);
    return diagnostics;
}

