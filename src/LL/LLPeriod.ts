import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

const abbreviations = [
    "[iI]\\.e\\.",
    "[eE]\\.g\\.",
    "[aA]\\.k\\.a\\.",
    "[iI]\\.i\\.d\\.",
    "[wW]\\.r\\.t\\.",
    "[wW]\\.l\\.o\\.g\\.",
    "resp\\.",
    "Mr\\.",
    "Mrs\\.",
    "Ms\\.",
];
const pattern = new RegExp(`\\b(?:${abbreviations.join("|")}) `, "g");

export default function LLPeriod(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLPeriod";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(pattern)) {
        if (!txt.isValid(match.index)) continue;
        const abbreviation = match[0].trim();
        let customizedMessage: string;
        if (["ie", "Ie", "eg", "Eg", "aka", "Aka"].includes(abbreviation.replaceAll(".", "")))
            customizedMessage = messages[code].replaceAll("%1", abbreviation).slice(0, -1) + ", or a comma \"" + abbreviation + ",\" in American English.";
        else
            customizedMessage = messages[code].replaceAll("%1", abbreviation);

        message.push(customizedMessage);
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(code, message, ranges);
}
