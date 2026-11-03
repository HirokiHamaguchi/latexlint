const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const executable = path.join(root, 'dist/cli.cjs');
const packageData = require('../package.json');

function fixture(t, files = {}, config = { default: false, LLSpaceJapanese: true }) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'latexlint-cli-'));
    t.after(() => {
        // Only remove the temporary directory allocated by this test.
        assert.ok(directory.startsWith(path.resolve(os.tmpdir()) + path.sep));
        assert.ok(path.basename(directory).startsWith('latexlint-cli-'));
        fs.rmSync(directory, { recursive: true, force: true });
    });
    if (config !== null) files = { '.latexlint.json': JSON.stringify(config), ...files };
    for (const [filename, content] of Object.entries(files)) {
        const target = path.join(directory, filename);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, content);
    }
    return {
        directory,
        read: filename => fs.readFileSync(path.join(directory, filename)),
        run: (...args) => {
            const result = spawnSync(process.execPath, [executable, ...args], {
                cwd: directory, encoding: 'utf8', timeout: 30000
            });
            assert.ifError(result.error);
            return result;
        }
    };
}

test('help, version and argument errors', t => {
    const f = fixture(t);
    for (const args of [[], ['--help'], ['-h']]) {
        const result = f.run(...args);
        assert.equal(result.status, 0);
        assert.match(result.stdout, /Usage: latexlint/);
    }
    assert.equal(f.run('-V').stdout.trim(), packageData.version);
    assert.equal(f.run('--unknown').status, 4);
    assert.equal(f.run('--config').status, 4);
    assert.equal(f.run('--enable', 'LLSpaceJapanese').status, 4);
});

test('Information diagnostics fail without modifying files or printing performance logs', t => {
    // 𠮷 (U+20BB7) is one code point but two UTF-16 units; the next column must not shift.
    const f = fixture(t, { 'paper.tex': '𠮷日本語$x$日本語\n' });
    const original = f.read('paper.tex');
    const result = f.run('paper.tex');
    assert.equal(result.status, 1);
    assert.match(result.stderr, /paper\.tex:1:5 LLSpaceJapanese/);
    assert.equal(result.stdout, '');
    assert.doesNotMatch(result.stderr, /Performance|Total:|timings/);
    assert.deepEqual(f.read('paper.tex'), original);
    const quiet = f.run('--quiet', 'paper.tex');
    assert.equal(quiet.status, 1);
    assert.equal(quiet.stderr, '');
});

test('VS Code default disabled rules are respected, and --fix does not enable them', t => {
    const f = fixture(t, { 'paper.tex': '日本語$x$日本語\n' }, null);
    assert.equal(f.run('paper.tex').status, 0);
    const noFix = f.run('--fix', 'paper.tex');
    assert.equal(noFix.status, 0);
    assert.match(noFix.stderr, /LLSpaceJapanese is disabled/);
    assert.equal(f.read('paper.tex').toString(), '日本語$x$日本語\n');
    assert.equal(f.run('--enable', 'LLSpaceJapanese', '--', 'paper.tex').status, 1);
    assert.equal(f.run('--fix', '--enable', 'LLSpaceJapanese', '--', 'paper.tex').status, 0);
    assert.equal(f.read('paper.tex').toString(), '日本語 $x$ 日本語\n');
});

test('CLI overrides JSON and --disable wins in either order', t => {
    const f = fixture(t, { 'paper.tex': '日本語$x$日本語\n' }, { default: false });
    assert.equal(f.run('--enable', 'LLSpaceJapanese', '--', 'paper.tex').status, 1);
    assert.equal(f.run('--enable=LLSpaceJapanese', '--', 'paper.tex').status, 1);
    for (const args of [
        ['--enable', 'LLSpaceJapanese', '--disable', 'LLSpaceJapanese'],
        ['--disable', 'LLSpaceJapanese', '--enable', 'LLSpaceJapanese']
    ]) assert.equal(f.run(...args, '--', 'paper.tex').status, 0);
    assert.equal(f.run('--enable', 'LLSpaceJapanese', 'LLT', '--', 'paper.tex').status, 1);
});

test('explicit configuration and array exceptions use the existing diagnostic text', t => {
    const f = fixture(t, {
        'paper.tex': '日本語$x$日本語\n',
        'custom.json': JSON.stringify({ default: false, LLSpaceJapanese: true, exceptions: ['語$', '$日'] })
    });
    assert.equal(f.run('--config', 'custom.json', '--fix', 'paper.tex').status, 0);
    assert.equal(f.read('paper.tex').toString(), '日本語$x$日本語\n');
});

const fixCases = [
    // 𠮷 checks that surrogate-pair length does not displace spacing insertions.
    ['dollar and supplementary kanji', '𠮷日本語$x$日本語\n', '𠮷日本語 $x$ 日本語\n'],
    ['parentheses', '日本語\\(x\\)日本語\n', '日本語 \\(x\\) 日本語\n'],
    ['comment', '% 日本語$x$日本語\n本文$x$本文\n', '% 日本語$x$日本語\n本文 $x$ 本文\n'],
    ['verbatim', '\\begin{verbatim}\n日本語$x$日本語\n\\end{verbatim}\n', '\\begin{verbatim}\n日本語$x$日本語\n\\end{verbatim}\n'],
    ['LLDisable tex', '本文$x$本文 % LLDisable\n本文$x$本文\n', '本文$x$本文 % LLDisable\n本文 $x$ 本文\n'],
    ['LLDisable markdown', '本文$x$本文 <!-- LLDisable -->\n本文$x$本文\n', '本文$x$本文 <!-- LLDisable -->\n本文 $x$ 本文\n', 'md'],
    ['Markdown fenced code', '```tex\n日本語$x$日本語\n```\n本文$x$本文\n', '```tex\n日本語$x$日本語\n```\n本文 $x$ 本文\n', 'md'],
    // Existing rules exclude fenced blocks, but do inspect Markdown inline code.
    ['Markdown inline code compatibility', '`日本語$x$日本語` 本文$x$本文\n', '`日本語 $x$ 日本語` 本文 $x$ 本文\n', 'md'],
    ['adjacent matches', '日$本$語\n', '日 $ 本 $ 語\n'],
    ['already spaced', '日本語 $x$ 日本語\n', '日本語 $x$ 日本語\n'],
    ['CRLF with BOM', '\uFEFF𠮷本文$x$本文\r\n本文\\(y\\)本文\r\n', '\uFEFF𠮷本文 $x$ 本文\r\n本文 \\(y\\) 本文\r\n'],
    ['mixed newlines', '本文$x$本文\r\n本文$x$本文\n', '本文 $x$ 本文\r\n本文 $x$ 本文\n'],
    ['LF without final newline', '本文$x$本文', '本文 $x$ 本文']
];
for (const [name, input, expected, extension = 'tex'] of fixCases)
    test(`fix and repeat: ${name}`, t => {
        const filename = `paper.${extension}`;
        const f = fixture(t, { [filename]: input });
        const first = f.run('--fix', filename);
        assert.equal(first.status, 0, first.stderr);
        assert.deepEqual(f.read(filename), Buffer.from(expected));
        const second = f.run('--fix', filename);
        assert.equal(second.status, 0, second.stderr);
        assert.deepEqual(f.read(filename), Buffer.from(expected));
    });

test('only requested files are written and unfixable diagnostics remain', t => {
    const f = fixture(t, {
        'paper.tex': '本文$x$本文 ^T\n', 'other.tex': '本文$x$本文\n'
    }, { default: false, LLSpaceJapanese: true, LLT: true });
    const result = f.run('--fix', 'paper.tex', 'paper.tex');
    assert.equal(result.status, 1);
    assert.match(result.stderr, /LLT/);
    assert.doesNotMatch(result.stderr, /LLSpaceJapanese/);
    assert.equal(f.read('paper.tex').toString(), '本文 $x$ 本文 ^T\n');
    assert.equal(f.read('other.tex').toString(), '本文$x$本文\n');
});

test('multiple files continue after errors, with execution errors taking precedence', t => {
    const f = fixture(t, { 'a.tex': '本文$x$本文', 'z.md': '本文$x$本文' });
    const result = f.run('--fix', 'a.tex', 'missing.tex', 'z.md');
    assert.equal(result.status, 4);
    assert.match(result.stderr, /missing\.tex/);
    assert.equal(f.read('a.tex').toString(), '本文 $x$ 本文');
    assert.equal(f.read('z.md').toString(), '本文 $x$ 本文');
    assert.equal(f.run('missing.tex', 'a.tex').status, 4);
});

test('bad configuration fails before any write', t => {
    const invalid = [
        '{', '[]', 'null', '{"default": "false"}', '{"LLJapaneseSpace": true}',
        '{"LLSpaceJapanese": 1}', '{"exceptions": "word"}', '{"exceptions": [1]}',
        '{"userDefinedRules": ["["]}'
    ];
    const f = fixture(t, { 'paper.tex': '本文$x$本文' });
    for (const data of invalid) {
        fs.writeFileSync(path.join(f.directory, 'bad.json'), data);
        assert.equal(f.run('--fix', '-c', 'bad.json', 'paper.tex').status, 4, data);
        assert.equal(f.read('paper.tex').toString(), '本文$x$本文');
    }
    assert.equal(f.run('-c', 'missing.json', 'paper.tex').status, 4);
    assert.equal(f.run('--enable', 'LLJapaneseSpace', '--', 'paper.tex').status, 4);
    assert.equal(f.run('--disable', 'LLJapaneseSpace', '--', 'paper.tex').status, 4);
});

test('non-UTF-8 input is rejected without writing', t => {
    const input = Buffer.from([0xFF, 0xFE, 0x61, 0x00]);
    const f = fixture(t, { 'paper.tex': input });
    assert.equal(f.run('--fix', 'paper.tex').status, 4);
    assert.deepEqual(f.read('paper.tex'), input);
});

test('directories, globs, dotfiles, ignore patterns and ignore files', t => {
    const f = fixture(t, {
        'docs/a.tex': '本文$x$本文', 'docs/sub/b.md': '本文$x$本文',
        'docs/ignored.tex': '本文$x$本文', 'docs/.hidden.tex': '本文$x$本文',
        'docs/irrelevant.txt': '本文$x$本文', '.latexlintignore': 'docs/ignored.tex\n',
        'custom.ignore': 'docs/a.tex\ndocs/sub/\n'
    });
    const directory = f.run('docs');
    assert.equal(directory.status, 1);
    assert.match(directory.stderr, /a\.tex/);
    assert.match(directory.stderr, /b\.md/);
    assert.doesNotMatch(directory.stderr, /ignored\.tex|hidden|irrelevant/);
    assert.match(f.run('--dot', 'docs').stderr, /hidden\.tex/);
    assert.equal(f.run('docs', '-i', 'docs/a.tex', '-i', 'docs/sub').status, 0);
    assert.equal(f.run('docs', '-i', '**/*.tex', '-i', '**/*.md').status, 0);
    assert.match(f.run('docs/**/*.tex').stderr, /a\.tex/);
    if (process.platform === 'win32')
        assert.match(f.run('docs\\**\\*.tex').stderr, /a\.tex/);
    assert.equal(f.run('docs', '-p', 'custom.ignore', '-i', 'docs/ignored.tex').status, 0);
    assert.equal(f.run('docs', '-p', 'missing.ignore').status, 4);
    assert.equal(f.run('empty/**/*.tex').status, 0);
});

test('vocabulary data and user-defined rules work without external assets', t => {
    const f = fixture(t, { 'paper.md': 'marker\n' }, {
        default: false, LLUserDefined: true, userDefinedRules: ['marker']
    });
    const result = f.run('paper.md');
    assert.equal(result.status, 1);
    assert.match(result.stderr, /LLUserDefined/);
    const vocabulary = require('../src/TextLint/my_vocabulary.json');
    const wrong = vocabulary.entries_ja.flatMap(item => item.no).find(item => !/[\\\[($]/.test(item));
    assert.ok(wrong);
    fs.writeFileSync(path.join(f.directory, 'paper.md'), wrong);
    fs.writeFileSync(path.join(f.directory, '.latexlint.json'), JSON.stringify({ default: false, LLTextLint: true }));
    assert.match(f.run('paper.md').stderr, /LLTextLint/);
});

// Expected text remains independent of the fixer. JSON consolidates the edge
// cases without losing byte comparisons, BOM/CRLF or the two runnable examples.
const manualDirectory = path.join(root, 'sample/cli');
const manualFixtures = require('../sample/cli/fixtures.json');
for (const { file: filename, config: configName, input: content, expected: expectedText, fixedStatus } of manualFixtures.cases)
    test(`manual fixture: ${filename}`, t => {
        const config = manualFixtures.configurations[configName];
        const input = content === undefined ? fs.readFileSync(path.join(manualDirectory, filename)) : Buffer.from(content);
        const expected = Buffer.from(expectedText);
        const f = fixture(t, { [filename]: input }, config);
        assert.equal(f.run(filename).status, 1);
        assert.deepEqual(f.read(filename), input, 'check mode must not write');
        const first = f.run('--fix', filename);
        assert.equal(first.status, fixedStatus, first.stderr);
        if (fixedStatus === 1) {
            assert.match(first.stderr, /LLT/);
            assert.doesNotMatch(first.stderr, /LLSpaceJapanese/);
        }
        assert.deepEqual(f.read(filename), expected);
        assert.equal(f.run('--fix', filename).status, fixedStatus);
        assert.deepEqual(f.read(filename), expected, 'second fix must be byte-identical');
    });

test('manual unknown-rule configuration fails without modifying input', t => {
    const input = fs.readFileSync(path.join(manualDirectory, 'spacing.tex'));
    const invalid = JSON.stringify(manualFixtures.configurations['unknown-rule']);
    const f = fixture(t, { 'paper.tex': input, 'unknown-rule.json': invalid });
    const result = f.run('--fix', '--config', 'unknown-rule.json', 'paper.tex');
    assert.equal(result.status, 4);
    assert.match(result.stderr, /Unknown rule: LLJapaneseSpace/);
    assert.deepEqual(f.read('paper.tex'), input);
});
