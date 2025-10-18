import { useState } from 'react';
import { lintLatex } from './latex-linter';
import type { WebDiagnostic } from './latex-linter';

const sample = `\\documentclass{article}
\\begin{document}
Hello, world!
\\end{document}
`;

export function LatexLinter() {
    const [text, setText] = useState(sample);
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


    const renderDiagnostics = () => {
        if (isLinting)
            return <div className="status linting">🔄 Linting...</div>;
        if (diagnostics.length === 0 && text.trim())
            return <div className="status no-issues">✅ No issues found!</div>;
        if (diagnostics.length === 0)
            return <div className="status no-issues">Click "Lint LaTeX" to check for issues</div>;

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