import { readFileSync, writeFileSync } from 'node:fs';
import { extname, relative } from 'node:path';
import { TextDecoder, parseArgs } from 'node:util';
import { readConfiguration, version } from './config';
import { collectFiles } from './files';
import { diagnose, fix, ruleName } from './engine';

const help = `Usage: latexlint [options] [files|directories|globs...]

Options:
  -c, --config <file>       JSON configuration (default: .latexlint.json in cwd)
  -f, --fix                 Fix active LLSpaceJapanese diagnostics in place
  --enable <rules...>       Enable rules; end the list with -- before files
  --disable <rules...>      Disable rules (takes precedence over --enable)
  -i, --ignore <pattern>    Exclude a file/directory/glob (repeatable)
  -p, --ignore-path <file>  Gitignore-style exclusions (default: .latexlintignore)
  -d, --dot                 Include dotfiles/directories during discovery
  -q, --quiet               Suppress diagnostic output, preserving exit status
  -V, --version             Print version
  -h, --help                Print help

Exit codes: 0 no remaining diagnostics; 1 diagnostics remain; 4 execution error.
Input: UTF-8 .tex and .md files. --fix preserves BOM and line endings.
Only explicitly enabled Japanese spacing is fixed; --fix does not enable rules.
`;

function parseArguments(args: string[]) {
    // https://nodejs.org/api/util.html#utilparseargsconfig
    const parsed = parseArgs({
        args, allowPositionals: true, tokens: true,
        options: {
            config: { type: 'string', short: 'c' },
            fix: { type: 'boolean', short: 'f' },
            enable: { type: 'string', multiple: true },
            disable: { type: 'string', multiple: true },
            ignore: { type: 'string', short: 'i', multiple: true },
            'ignore-path': { type: 'string', short: 'p' },
            dot: { type: 'boolean', short: 'd' },
            quiet: { type: 'boolean', short: 'q' },
            help: { type: 'boolean', short: 'h' },
            version: { type: 'boolean', short: 'V' }
        }
    });
    const files: string[] = [];
    const enable: string[] = [];
    const disable: string[] = [];
    let rules: string[] | undefined;
    for (const token of parsed.tokens)
        if (token.kind === 'option-terminator') rules = undefined;
        else if (token.kind === 'option') {
            rules = token.name === 'enable' ? enable : token.name === 'disable' ? disable : undefined;
            if (rules) rules.push(token.value!);
        } else if (rules) rules.push(token.value);
        else files.push(token.value);
    return { ...parsed.values, files, enable, disable };
}

export function main(args: string[]): number {
    try {
        const options = parseArguments(args);
        if (options.version) { console.log(version); return 0; }
        if (options.help || args.length === 0) { console.log(help); return 0; }
        if (options.files.length === 0) throw new Error('No input files specified. Use --help for usage.');
        const cwd = process.cwd();
        const config = readConfiguration(cwd, options.config, options.enable, options.disable);
        const files = collectFiles(options.files, { ...options, cwd });
        if (options.fix && config.disabledRules.includes('LLSpaceJapanese') && !options.quiet)
            console.error('LLSpaceJapanese is disabled; use --enable LLSpaceJapanese -- to enable spacing fixes.');
        let status = 0;
        for (const filename of files) {
            const display = relative(cwd, filename) || filename;
            try {
                const extension = extname(filename).toLowerCase();
                if (extension !== '.tex' && extension !== '.md')
                    throw new Error('Expected a .tex or .md file');
                const bytes = readFileSync(filename);
                const bom = bytes.subarray(0, 3).equals(Buffer.from([0xEF, 0xBB, 0xBF]));
                // Fatal decoding prevents --fix from silently corrupting non-UTF-8 input.
                let text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })
                    .decode(bom ? bytes.subarray(3) : bytes);
                const language = extension === '.md' ? 'markdown' : 'latex';
                let diagnostics = diagnose(text, language, config);
                if (options.fix) {
                    const updated = fix(text, language, diagnostics);
                    if (updated !== text) {
                        // Recheck before saving; a rule failure leaves this file untouched.
                        diagnostics = diagnose(updated, language, config);
                        writeFileSync(filename, (bom ? '\uFEFF' : '') + updated, 'utf8');
                        text = updated;
                    }
                }
                if (diagnostics.length && status !== 4) status = 1;
                if (!options.quiet)
                    for (const diagnostic of diagnostics) {
                        const { line, character } = diagnostic.range.start;
                        console.error(`${display}:${line + 1}:${character + 1} ${ruleName(diagnostic)} ${diagnostic.message.replace(/[\r\n]+/g, ' ')}`);
                    }
            } catch (error) {
                console.error(`${display}: ${error instanceof Error ? error.message : String(error)}`);
                status = 4;
            }
        }
        return status;
    } catch (error) {
        console.error(`latexlint: ${error instanceof Error ? error.message : String(error)}`);
        return 4;
    }
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));
