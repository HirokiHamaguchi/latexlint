import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLPeriod(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLPeriod";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    const abbreviations = [
        "i\\.e\\.",
        "e\\.g\\.",
        "i\\.i\\.d\\.",
        "w\\.r\\.t\\.",
        "w\\.l\\.o\\.g\\.",
        "resp\\.",
    ];
    const pattern = new RegExp(`\\b(?:${abbreviations.join("|")}) `, "g");

    for (const match of txt.text.matchAll(pattern)) {
        if (!txt.isValid(match.index)) continue;
        const abbreviation = match[0].trim();
        let customizedMessage: string;
        if (abbreviation === "i.e." || abbreviation === "e.g.")
            customizedMessage = messages[code].replaceAll("%1", abbreviation).slice(0, -1) + ", or a comma \"" + abbreviation + ",\" in American English.";
        else
            customizedMessage = messages[code].replaceAll("%1", abbreviation);

        message.push(customizedMessage);
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(code, message, ranges);
}
