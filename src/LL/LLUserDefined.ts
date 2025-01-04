import * as vscode from 'vscode';
import regex2ranges from '../util/regex2ranges';

export default function LLUserDefined(doc: vscode.TextDocument): vscode.Diagnostic[] {
    console.log(doc.fileName);
    return []; // TODO
    // return regex2ranges(
    //     doc,
    //     "LLUserDefined",
    //     /TODO/g,
    // );
}