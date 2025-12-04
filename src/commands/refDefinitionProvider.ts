import * as vscode from 'vscode';
import isInComment from '../LLText/isInComment';

export default class RefDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        // @ts-ignore
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
        // Get the word at the cursor position
        const wordRange = document.getWordRangeAtPosition(position, /\\(?:ref|cref|Cref)\{[^}]*\}/);
        if (!wordRange) return undefined;

        const text = document.getText(wordRange);

        // Extract the label name from \ref{xxx}, \cref{xxx}, or \Cref{xxx}
        const match = text.match(/\\(?:ref|cref|Cref)\{([^}]*)\}/);
        if (!match) return undefined;

        const labelName = match[1];
        if (!labelName) return undefined;

        // Search for \label{xxx} in the document
        const fullText = document.getText();
        const labelPattern = new RegExp(`(?<=\\\\label\\{)${this.escapeRegExp(labelName)}(?=\\})`, 'g');

        let labelMatch: RegExpExecArray | null;
        while ((labelMatch = labelPattern.exec(fullText)) !== null) {
            const labelIndex = labelMatch.index;

            // Get the line information for this match
            const labelPosition = document.positionAt(labelIndex);

            // Check if this label is in a comment
            if (isInComment(document.lineAt(labelPosition.line).text, labelPosition.character)) continue;

            // Found the first non-commented label
            const labelEndPosition = document.positionAt(labelIndex + labelMatch[0].length);
            const labelRange = new vscode.Range(labelPosition, labelEndPosition);

            return new vscode.Location(document.uri, labelRange);
        }

        return undefined;
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
