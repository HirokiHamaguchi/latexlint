import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { buildSync } from 'esbuild';
import enumerateDiagnostics from '../util/enumerateDiagnostics';
import createLLTextVSCode from '../LLText/createLLTextVSCode';
import detectMathSpace from '../util/detectMathSpace';
import { fixJapaneseSpace } from '../util/fixJapaneseSpace';
import type { Configuration } from '../cli/config';

suite('CLI and VS Code parity', () => {
    const root = path.resolve(__dirname, '../..');
    const output = path.join(root, 'out/cli-engine.cjs');
    let engine: typeof import('../cli/engine') & typeof import('../cli/config') & typeof import('../cli/vscode');
    let mock: {
        createMockTextDocument: (text: string, uri: unknown, language: string) => vscode.TextDocument;
        Uri: { file: (filename: string) => unknown };
    };

    suiteSetup(() => {
        const options = require(path.join(root, 'script/build-cli.cjs'));
        buildSync({
            ...options, entryPoints: undefined, banner: undefined, outfile: output,
            stdin: {
                contents: `export * from './src/cli/engine'; export * from './src/cli/config'; export * from './src/cli/vscode';`,
                resolveDir: root, loader: 'ts'
            }
        });
        engine = require(output);
        // Compile the standalone mock only for tests; its runtime loader stays unchanged.
        const mockOutput = path.join(root, 'out/vscode-mock-test.cjs');
        buildSync({
            ...options, entryPoints: [path.join(root, 'script/vscode-mock.ts')],
            banner: undefined, outfile: mockOutput
        });
        mock = require(mockOutput);
    });

    test('diagnostics match the extension for every existing rule fixture, Markdown and CRLF', async () => {
        const settings = vscode.workspace.getConfiguration('latexlint');
        const config: Configuration = {
            disabledRules: settings.get<string[]>('disabledRules')!,
            exceptions: settings.get<string[]>('exceptions')!,
            LLCrefExceptions: settings.get<string[]>('LLCrefExceptions')!,
            userDefinedRules: settings.get<string[]>('userDefinedRules')!
        };
        const expectedDefaults = Object.fromEntries(Object.keys(config)
            .map(key => [key, settings.inspect(key)!.defaultValue]));
        assert.deepStrictEqual(engine.readConfiguration(root), expectedDefaults);
        const fixtures = fs.readdirSync(path.join(root, 'rules')).filter(name => name.startsWith('LL'))
            .map(name => fs.readFileSync(path.join(root, 'rules', name, 'lint.tex'), 'utf8'));
        // 𠮷 is one code point but two UTF-16 units, exposing shifted columns after it.
        fixtures.push('𠮷本文$x$本文\n% comment\n\\begin{align}a&=b\\end{align}\n');
        const normalize = (diagnostics: vscode.Diagnostic[]) => diagnostics.map(diagnostic => ({
            message: diagnostic.message, severity: diagnostic.severity,
            code: typeof diagnostic.code === 'object' ? diagnostic.code.value : diagnostic.code,
            start: [diagnostic.range.start.line, diagnostic.range.start.character],
            end: [diagnostic.range.end.line, diagnostic.range.end.character]
        }));
        for (const language of ['latex', 'markdown'])
            for (const original of fixtures) {
                const content = original.replace(/\r?\n/g, '\r\n');
                const document = await vscode.workspace.openTextDocument({ language, content });
                const originalLog = console.log;
                const originalTable = console.table;
                try {
                    console.log = () => {};
                    console.table = () => {};
                    assert.deepStrictEqual(normalize(engine.diagnose(document.getText(), language, config)),
                        normalize(enumerateDiagnostics(document)));
                } finally {
                    console.log = originalLog;
                    console.table = originalTable;
                }
            }
    });

    test('CLI and mock line positions match VS Code for LF, CRLF, empty lines and EOF', async () => {
        const rangeCoordinates = (range: vscode.Range) =>
            [range.start.line, range.start.character, range.end.line, range.end.character];
        // 𠮷 exercises both halves of a UTF-16 surrogate pair in offset/position checks.
        for (const content of ['', 'a\nb', 'a\r\nb', 'a\r\n', 'a\r\n\r\nb\r\n', '𠮷日本\r\n\r\n終\n', ' \t\r\n𠮷\r\n', 'a\rb']) {
            const document = await vscode.workspace.openTextDocument({ language: 'latex', content });
            for (const adapter of [engine.createDocument(document.getText(), 'latex'),
                mock.createMockTextDocument(document.getText(), mock.Uri.file('test.tex'), 'latex')]) {
                assert.equal(adapter.getText(), document.getText());
                assert.equal(adapter.lineCount, document.lineCount);
                if (document.getText().includes('\n') && 'eol' in adapter)
                    assert.equal(adapter.eol, document.eol);
                for (let offset = -1; offset <= document.getText().length + 2; offset++) {
                    const actual = adapter.positionAt(offset);
                    const expected = document.positionAt(offset);
                    assert.deepStrictEqual([actual.line, actual.character], [expected.line, expected.character]);
                }
                for (let line = 0; line < document.lineCount; line++) {
                    const actual = adapter.lineAt(line);
                    const expected = document.lineAt(line);
                    assert.equal(actual.text, expected.text);
                    assert.deepStrictEqual(rangeCoordinates(actual.range), rangeCoordinates(expected.range));
                    assert.deepStrictEqual(rangeCoordinates(actual.rangeIncludingLineBreak), rangeCoordinates(expected.rangeIncludingLineBreak));
                    assert.equal(actual.firstNonWhitespaceCharacterIndex, expected.firstNonWhitespaceCharacterIndex);
                    assert.equal(actual.isEmptyOrWhitespace, expected.isEmptyOrWhitespace);
                    assert.equal(adapter.getText(actual.rangeIncludingLineBreak), document.getText(expected.rangeIncludingLineBreak));
                }
                for (let line = 0; line < document.lineCount + 2; line++) {
                    const length = line < document.lineCount ? document.lineAt(line).text.length : 0;
                    for (let column = 0; column <= length + 2; column++) {
                        const position = new vscode.Position(line, column);
                        assert.equal(adapter.offsetAt(position), document.offsetAt(position));
                    }
                }
            }
        }
    });

    test('mock preserves raw mixed line endings and clamps positions inside CRLF', () => {
        // 𠮷 must retain two UTF-16 offsets even in a document with mixed newlines.
        const content = 'a\r\nb\n𠮷\r\n';
        const document = mock.createMockTextDocument(content, mock.Uri.file('mixed.tex'), 'latex');
        assert.equal(document.getText(), content);
        assert.equal(document.lineAt(0).text, 'a');
        assert.equal(document.lineAt(0).range.end.character, 1);
        for (const [line, offset] of [[0, 0], [1, 3], [2, 5], [3, 9]])
            assert.equal(document.offsetAt(new vscode.Position(line, 0)), offset);
        for (const [offset, line, character] of [[1, 0, 1], [2, 0, 1], [4, 1, 1], [7, 2, 2], [8, 2, 2]]) {
            const position = document.positionAt(offset);
            assert.deepStrictEqual([position.line, position.character], [line, character]);
        }
        assert.equal(document.lineAt(3).rangeIncludingLineBreak.end.line, 3);
        assert.equal(document.lineAt(3).rangeIncludingLineBreak.end.character, 0);
    });

    test('spacing matches the existing command except for documented diagnostic exclusions', async () => {
        const config = { ...engine.readConfiguration(root), disabledRules: [] };
        // 𠮷 must not shift insertion offsets when comparing CLI and editor fixes.
        for (const content of [
            '𠮷日本語$x$日本語\r\n日本語\\(x\\)日本語\r\n',
            '% 本文$x$本文\n本文$x$本文\n',
            '\\begin{verbatim}\n本文$x$本文\n\\end{verbatim}\n',
            '日$本$語\n', '本文 $x$ 本文\n'
        ]) {
            const document = await vscode.workspace.openTextDocument({ language: 'latex', content });
            const [txt] = createLLTextVSCode(document);
            const ranges = detectMathSpace(document, txt);
            const command = fixJapaneseSpace(document, ranges);
            const diagnostics = engine.diagnose(document.getText(), 'latex', config);
            assert.equal(engine.fix(document.getText(), 'latex', diagnostics), command.text);
            assert.equal(fixJapaneseSpace(document, [...ranges, ...ranges]).text, command.text);
        }
        for (const [content, exceptions] of [
            ['本文$x$本文 % LLDisable\n', []],
            ['本文$x$本文\n', ['文$', '$本']]
        ] as [string, string[]][]) {
            const document = await vscode.workspace.openTextDocument({ language: 'latex', content });
            const [txt] = createLLTextVSCode(document);
            assert.notEqual(fixJapaneseSpace(document, detectMathSpace(document, txt)).text, content);
            const diagnostics = engine.diagnose(content, 'latex', { ...config, exceptions });
            assert.equal(engine.fix(content, 'latex', diagnostics), content);
        }
    });
});
