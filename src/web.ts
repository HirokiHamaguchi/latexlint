// Web version entry point for LaTeX Lint
import LLAlignAnd from './LL/LLAlignAnd';
import LLAlignEnd from './LL/LLAlignEnd';
import LLAlignSingleLine from './LL/LLAlignSingleLine';
import LLArticle from './LL/LLArticle';
import LLBig from './LL/LLBig';
import LLBracketCurly from './LL/LLBracketCurly';
import LLBracketMissing from './LL/LLBracketMissing';
import LLBracketRound from './LL/LLBracketRound';
import LLColonEqq from './LL/LLColonEqq';
import LLColonForMapping from './LL/LLColonForMapping';
import LLCref from './LL/LLCref';
import LLDoubleQuotes from './LL/LLDoubleQuotes';
import LLENDash from './LL/LLENDash';
import LLEqnarray from './LL/LLEqnarray';
import LLFootnote from './LL/LLFootnote';
import LLJapaneseSpace from './LL/LLJapaneseSpace';
import LLLlGg from './LL/LLLlGg';
import LLNonASCII from './LL/LLNonASCII';
import LLPeriod from './LL/LLPeriod';
import LLRefEq from './LL/LLRefEq';
import LLSharp from './LL/LLSharp';
import LLSI from './LL/LLSI';
import LLSortedCites from './LL/LLSortedCites';
import LLT from './LL/LLT';
import LLThousands from './LL/LLThousands';
import LLTitle from './LL/LLTitle';
import LLURL from './LL/LLURL';
import LLUserDefined from './LL/LLUserDefined';


// Allow using 'document' without requiring the DOM lib in tsconfig
declare const document: any;

// Minimal DOM type aliases for environments without lib.dom
declare type HTMLButtonElement = any;
declare type HTMLTextAreaElement = any;
declare type HTMLDivElement = any;

// Simplified diagnostic interface for web version
interface WebDiagnostic {
    range: {
        start: { line: number; character: number };
        end: { line: number; character: number };
    };
    message: string;
    severity: 'error' | 'warning' | 'info';
    source: string;
    code?: string;
}

// Mock document interface for web version
interface WebTextDocument {
    getText(range?: any): string;
    lineAt(line: number): { text: string };
    lineCount: number;
    positionAt(offset: number): { line: number; character: number };
    offsetAt(position: { line: number; character: number }): number;
    languageId: string;
}

// Create a mock document from text
function createMockDocument(text: string): WebTextDocument {
    const lines = text.split('\n');

    return {
        getText(range?: any): string {
            if (!range) return text;
            // For simplified implementation, return full text
            return text;
        },
        lineAt(line: number) {
            return { text: lines[line] || '' };
        },
        get lineCount() {
            return lines.length;
        },
        positionAt(offset: number) {
            let line = 0;
            let character = 0;
            for (let i = 0; i < offset && i < text.length; i++)
                if (text[i] === '\n') {
                    line++;
                    character = 0;
                } else
                    character++;

            return { line, character };
        },
        offsetAt(position: { line: number; character: number }) {
            let offset = 0;
            for (let i = 0; i < position.line && i < lines.length; i++)
                offset += lines[i].length + 1; // +1 for newline

            offset += position.character;
            return offset;
        },
        languageId: 'latex'
    };
}

// Convert VS Code diagnostic to web diagnostic
function convertDiagnostic(diag: any): WebDiagnostic {
    return {
        range: {
            start: { line: diag.range.start.line, character: diag.range.start.character },
            end: { line: diag.range.end.line, character: diag.range.end.character }
        },
        message: diag.message,
        severity: diag.severity === 0 ? 'error' : diag.severity === 1 ? 'warning' : 'info',
        source: diag.source || 'latexlint',
        code: diag.code
    };
}

// Mock enumAlignEnvs function for web version
function enumAlignEnvs(_doc: WebTextDocument, _txt: string): any[] {
    // Simplified implementation for web version
    // This would need to be implemented based on the actual enumAlignEnvs function
    return [];
}

// Main lint function for web version
function lintLatex(text: string, disabledRules: string[] = [], _exceptions: string[] = []): WebDiagnostic[] {
    const doc = createMockDocument(text);
    const txt = text;
    const alignLikeEnvs = enumAlignEnvs(doc, txt);

    let diagnostics: any[] = [];

    const t0 = performance.now();

    // Rules that need align environments
    for (const [ruleName, rule] of Object.entries({
        LLAlignAnd,
        LLAlignEnd,
        LLAlignSingleLine,
    })) {
        if (disabledRules.includes(ruleName)) continue;
        try {
            const diags = rule(doc as any, txt, alignLikeEnvs);
            diagnostics.push(...diags);
        } catch (error) {
            console.warn(`Rule ${ruleName} failed:`, error);
        }
    }

    // Rules that don't need align environments
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
        LLSharp,
        LLSI,
        LLSortedCites,
        LLT,
        LLThousands,
        LLTitle,
        LLURL,
        LLUserDefined,
    })) {
        if (disabledRules.includes(ruleName)) continue;
        try {
            const diags = rule(doc as any, txt);
            diagnostics.push(...diags);
        } catch (error) {
            console.warn(`Rule ${ruleName} failed:`, error);
        }
    }

    // Filter exceptions (simplified)
    // diagnostics = diagnostics.filter(diag => !exceptions.includes(formatException(doc.getText(diag.range))));

    const t1 = performance.now();

    console.log(`Linting took ${(t1 - t0).toFixed(2)} ms`);

    return diagnostics.map(convertDiagnostic);
}

// Web UI functionality
function initializeWebUI() {
    const lintButton = document.getElementById('lintButton') as HTMLButtonElement;
    const clearButton = document.getElementById('clearButton') as HTMLButtonElement;
    const latexInput = document.getElementById('latexInput') as HTMLTextAreaElement;
    const output = document.getElementById('output') as HTMLDivElement;

    function updateOutput(diagnostics: WebDiagnostic[]) {
        if (diagnostics.length === 0) {
            output.innerHTML = '<div class="no-issues">✅ No issues found!</div>';
            return;
        }

        const diagnosticHTML = diagnostics.map(diag => {
            const severityClass = diag.severity;
            const severityIcon = diag.severity === 'error' ? '❌' :
                diag.severity === 'warning' ? '⚠️' : 'ℹ️';

            return `
        <div class="diagnostic ${severityClass}">
          <div class="diagnostic-header">
            ${severityIcon} ${diag.message}
          </div>
          <div class="diagnostic-location">
            Line ${diag.range.start.line + 1}, Column ${diag.range.start.character + 1}
            ${diag.code ? ` (${diag.code})` : ''}
          </div>
        </div>
      `;
        }).join('');

        output.innerHTML = diagnosticHTML;
    }

    lintButton.addEventListener('click', () => {
        const text = latexInput.value;
        if (!text.trim()) {
            output.innerHTML = '<div class="no-issues">Please enter some LaTeX code to lint.</div>';
            return;
        }

        lintButton.disabled = true;
        lintButton.textContent = 'Linting...';

        try {
            // Add a small delay to show loading state
            setTimeout(() => {
                const diagnostics = lintLatex(text);
                updateOutput(diagnostics);

                lintButton.disabled = false;
                lintButton.textContent = 'Lint LaTeX';
            }, 100);
        } catch (error) {
            console.error('Linting error:', error);
            output.innerHTML = '<div class="diagnostic error"><div class="diagnostic-header">❌ Linting failed</div><div>An error occurred while linting your LaTeX code.</div></div>';

            lintButton.disabled = false;
            lintButton.textContent = 'Lint LaTeX';
        }
    });

    clearButton.addEventListener('click', () => {
        latexInput.value = '';
        output.innerHTML = '<div class="no-issues">Click "Lint LaTeX" to check for issues</div>';
    });
}

// Initialize when DOM is loaded
if (typeof document !== 'undefined')
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', initializeWebUI);
    else
        initializeWebUI();

// Export for potential use as library
export { lintLatex, WebDiagnostic };