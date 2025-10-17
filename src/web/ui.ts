// Web UI TypeScript module for LaTeX Lint
import { lintLatex } from '../web';

// Sample LaTeX code templates
const samples = {
    basic: `\\documentclass{article}
\\usepackage{amsmath}
\\title{Sample Document}
\\author{Author Name}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Introduction}
This is a sample LaTeX document with some common issues.

\\section{Content}
Here is some text with double  spaces and trailing spaces.

\\end{document}`,

    math: `\\begin{align}
x + y &= z\\\\
a + b &= c
\\end{align}

\\begin{equation}
E = mc^2.
\\end{equation}

Inline math: $x + y = z$.`,

    citations: `\\section{References}
See \\cite{paper1} and \\cite{paper2}.

\\bibliography{references}
\\bibliographystyle{plain}`,

    errors: `\\documentclass{article}

\\begin{document}

% Common issues that the linter will catch:

% 1. Double spaces
This  has  double  spaces.

% 2. Inconsistent quotes
"Wrong quotes" versus \`\`correct quotes''.

% 3. Missing periods
The equation is
\\begin{equation}
E = mc^2
\\end{equation}

% 4. Wrong dash usage
Pages 1-10 should be 1--10.

\\end{document}`
};

// UI Controller class
export class LatexLintUI {
    private lintButton: HTMLButtonElement;
    private clearButton: HTMLButtonElement;
    private latexInput: HTMLTextAreaElement;
    private output: HTMLDivElement;

    constructor() {
        this.lintButton = document.getElementById('lintButton') as HTMLButtonElement;
        this.clearButton = document.getElementById('clearButton') as HTMLButtonElement;
        this.latexInput = document.getElementById('latexInput') as HTMLTextAreaElement;
        this.output = document.getElementById('output') as HTMLDivElement;

        this.initializeEventListeners();
        this.loadSample('basic');
    }

    private initializeEventListeners(): void {
        this.lintButton.addEventListener('click', () => this.handleLint());
        this.clearButton.addEventListener('click', () => this.handleClear());

        // Add sample button event listeners
        const sampleButtons = document.querySelectorAll('.sample-btn');
        sampleButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target as HTMLButtonElement;
                const sampleType = target.getAttribute('data-sample');
                if (sampleType && sampleType in samples)
                    this.loadSample(sampleType as keyof typeof samples);
            });
        });
    }

    private handleLint(): void {
        const text = this.latexInput.value;
        if (!text.trim()) {
            this.output.innerHTML = '<div class="no-issues">Please enter some LaTeX code to lint.</div>';
            return;
        }

        this.lintButton.disabled = true;
        this.lintButton.textContent = 'Linting...';

        try {
            // Add a small delay to show loading state
            setTimeout(() => {
                const diagnostics = lintLatex(text);
                this.updateOutput(diagnostics);

                this.lintButton.disabled = false;
                this.lintButton.textContent = 'Lint LaTeX';
            }, 100);
        } catch (error) {
            console.error('Linting error:', error);
            this.output.innerHTML = '<div class="diagnostic error"><div class="diagnostic-header">❌ Linting failed</div><div>An error occurred while linting your LaTeX code.</div></div>';

            this.lintButton.disabled = false;
            this.lintButton.textContent = 'Lint LaTeX';
        }
    }

    private handleClear(): void {
        this.latexInput.value = '';
        this.output.innerHTML = '<div class="no-issues">Click "Lint LaTeX" to check for issues</div>';
    }

    public loadSample(type: keyof typeof samples): void {
        this.latexInput.value = samples[type] || '';
        // Clear previous results
        this.output.innerHTML = '<div class="no-issues">Click "Lint LaTeX" to check for issues</div>';
    }

    private updateOutput(diagnostics: any[]): void {
        if (diagnostics.length === 0) {
            this.output.innerHTML = '<div class="no-issues">✅ No issues found!</div>';
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

        this.output.innerHTML = diagnosticHTML;
    }
}

// Initialize UI when DOM is loaded
export function initializeApp(): void {
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', () => new LatexLintUI());
    else
        new LatexLintUI();
}