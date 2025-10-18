import { useState } from 'react';
import { lintLatex } from '../latex-linter';
import type { WebDiagnostic } from '../latex-linter';
import './LatexLinter.css';

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

export function LatexLinter() {
    const [text, setText] = useState(samples.basic);
    const [diagnostics, setDiagnostics] = useState<WebDiagnostic[]>([]);
    const [isLinting, setIsLinting] = useState(false);

    const handleLint = () => {
        if (!text.trim()) {
            setDiagnostics([]);
            return;
        }

        setIsLinting(true);

        // Add a small delay to show loading state
        setTimeout(() => {
            try {
                const results = lintLatex(text);
                setDiagnostics(results);
            } catch (error) {
                console.error('Linting error:', error);
                setDiagnostics([]);
            } finally {
                setIsLinting(false);
            }
        }, 100);
    };

    const handleClear = () => {
        setText('');
        setDiagnostics([]);
    };

    const loadSample = (type: keyof typeof samples) => {
        setText(samples[type] || '');
        setDiagnostics([]);
    };

    const renderDiagnostics = () => {
        if (isLinting) {
            return <div className="status linting">🔄 Linting...</div>;
        }

        if (diagnostics.length === 0 && text.trim()) {
            return <div className="status no-issues">✅ No issues found!</div>;
        }

        if (diagnostics.length === 0) {
            return <div className="status no-issues">Click "Lint LaTeX" to check for issues</div>;
        }

        return (
            <div className="diagnostics">
                {diagnostics.map((diag, index) => {
                    const severityIcon = diag.severity === 'error' ? '❌' :
                        diag.severity === 'warning' ? '⚠️' : 'ℹ️';

                    return (
                        <div key={index} className={`diagnostic ${diag.severity}`}>
                            <div className="diagnostic-header">
                                {severityIcon} {diag.message}
                            </div>
                            <div className="diagnostic-location">
                                Line {diag.range.start.line + 1}, Column {diag.range.start.character + 1}
                                {diag.code ? ` (${diag.code})` : ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="latex-linter">
            <header className="header">
                <h1>LaTeX Lint - Online LaTeX Linter</h1>
                <p>Check your LaTeX code for common issues and style problems</p>
            </header>

            <div className="controls">
                <div className="sample-buttons">
                    <span>Load sample:</span>
                    <button onClick={() => loadSample('basic')} className="sample-btn">Basic</button>
                    <button onClick={() => loadSample('math')} className="sample-btn">Math</button>
                    <button onClick={() => loadSample('citations')} className="sample-btn">Citations</button>
                    <button onClick={() => loadSample('errors')} className="sample-btn">Errors</button>
                </div>

                <div className="action-buttons">
                    <button
                        onClick={handleLint}
                        disabled={isLinting}
                        className="lint-btn"
                    >
                        {isLinting ? 'Linting...' : 'Lint LaTeX'}
                    </button>
                    <button onClick={handleClear} className="clear-btn">Clear</button>
                </div>
            </div>

            <div className="main-content">
                <div className="input-section">
                    <label htmlFor="latex-input">LaTeX Code:</label>
                    <textarea
                        id="latex-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your LaTeX code here..."
                        className="latex-input"
                    />
                </div>

                <div className="output-section">
                    <label>Lint Results:</label>
                    <div className="output">
                        {renderDiagnostics()}
                    </div>
                </div>
            </div>
        </div>
    );
}