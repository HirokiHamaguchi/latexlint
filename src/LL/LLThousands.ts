import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLThousands(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    if (txt.includes('\n\\usepackage{icomma}')) return [];
    return regex2diagnostics(
        doc, txt,
        "LLThousands",
        /(\d{1,3}),(\d{3})(?=\$|\\\))/g, // capture needed
    );
}
