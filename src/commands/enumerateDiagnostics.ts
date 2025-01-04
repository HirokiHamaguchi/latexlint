import * as vscode from 'vscode';
import LLAlignAnd from '../LL/LLAlignAnd';
import LLColonEqq from '../LL/LLColonEqq';
import LLCref from '../LL/LLCref';
import LLDoubleQuotation from '../LL/LLDoubleQuotation';
import LLENDash from '../LL/LLENDash';
import LLNonASCII from '../LL/LLNonASCII';
import LLSI from '../LL/LLSI';
import LLT from '../LL/LLT';
import LLTitle from '../LL/LLTitle';
import LLUserDefined from '../LL/LLUserDefined';

export default function enumerateDiagnostics(doc: vscode.TextDocument): vscode.Diagnostic[] {
    console.log(`Enumerating diagnostics for ${doc.uri}`);
    const diagnostics: vscode.Diagnostic[] = [];
    console.log('Enum: LLAlignAnd');
    diagnostics.push(...LLAlignAnd(doc));
    console.log('Enum: LLColonEqq');
    diagnostics.push(...LLColonEqq(doc));
    console.log('Enum: LLCref');
    diagnostics.push(...LLCref(doc));
    console.log('Enum: LLDoubleQuotation');
    diagnostics.push(...LLDoubleQuotation(doc));
    console.log('Enum: LLENDash');
    diagnostics.push(...LLENDash(doc));
    console.log('Enum: LLNonASCII');
    diagnostics.push(...LLNonASCII(doc));
    console.log('Enum: LLSI');
    diagnostics.push(...LLSI(doc));
    console.log('Enum: LLT');
    diagnostics.push(...LLT(doc));
    console.log('Enum: LLTitle');
    diagnostics.push(...LLTitle(doc));
    console.log('Enum: LLUserDefined');
    diagnostics.push(...LLUserDefined(doc));
    return diagnostics;
}
