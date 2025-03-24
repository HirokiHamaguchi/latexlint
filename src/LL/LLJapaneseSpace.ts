import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLJapaneseSpace(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLJapaneseSpace",
        /(?:\$[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー])|(?:[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー])\$/gu,
    );
}
