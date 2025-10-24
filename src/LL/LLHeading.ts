import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import isInComment from '../util/isInComment';

export default function LLHeading(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLHeading";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    // Define heading levels
    const headingLevels: Record<string, number> = {
        'chapter': 1,
        'section': 2,
        'subsection': 3,
        'subsubsection': 4
    };

    const headingNames = ['chapter', 'section', 'subsection', 'subsubsection'];

    // Track the last seen heading level
    let lastLevel = 0;

    // Find all heading commands
    const headingRegex = /\\(chapter|section|subsection|subsubsection)\*?\{/g;

    for (const headingMatch of txt.matchAll(headingRegex)) {
        console.log(headingMatch);
        const headingType = headingMatch[1];
        const currentLevel = headingLevels[headingType];

        // Skip if the heading is in a comment
        const pos = doc.positionAt(headingMatch.index!);
        const line = doc.lineAt(pos.line);
        const idx = headingMatch.index! - doc.offsetAt(line.range.start);
        if (isInComment(line.text, idx)) continue;

        // Check if we're skipping levels
        // Shoddy implementation: set lastLevel > 0 to avoid expectedLevelName handling
        if (lastLevel > 0 && currentLevel - lastLevel > 1) {
            const currentLevelName = headingNames[currentLevel - 1];
            const expectedLevel = lastLevel + 1;
            const expectedLevelName = headingNames[expectedLevel - 1];
            message.push(messages[code].replaceAll("%1", currentLevelName).replaceAll("%2", expectedLevelName));
            ranges.push(match2range(doc, headingMatch));
        }

        // Update the last seen level
        lastLevel = currentLevel;
    }

    return ranges2diagnostics(doc, code, message, ranges);
}