import { existsSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import ignore from 'ignore';

// glob 10's transitive lru-cache declarations conflict with newer MapIterator
// types. Describe only the documented APIs we use rather than disabling library
// checks for the entire extension. Runtime code still uses upstream glob.
const { globSync, hasMagic } = require('glob') as {
    globSync(pattern: string, options: {
        cwd: string; dot: boolean; nodir: boolean; absolute: boolean; windowsPathsNoEscape: boolean;
    }): string[];
    hasMagic(pattern: string, options: { magicalBraces: boolean; windowsPathsNoEscape: boolean }): boolean;
};

export interface FileOptions {
    cwd: string;
    dot?: boolean;
    ignore?: string[];
    'ignore-path'?: string;
}

const posix = (path: string) => path.split(sep).join('/');

export function collectFiles(inputs: string[], options: FileOptions): string[] {
    const { cwd, dot = false } = options;
    // https://github.com/isaacs/node-glob/tree/v10.5.0#usage
    const globOptions = { cwd, dot, nodir: true, absolute: true, windowsPathsNoEscape: true };
    const expand = (input: string, exclusions = false): string[] => {
        const absolute = resolve(cwd, input);
        if (existsSync(absolute)) {
            if (statSync(absolute).isDirectory())
                // Literal directory names may contain glob syntax such as [1].
                // Keep them in cwd so discovery cannot select a sibling instead.
                return globSync('**/*.{tex,md}', { ...globOptions, cwd: absolute });
            return [absolute];
        }
        if (hasMagic(input, { magicalBraces: true, windowsPathsNoEscape: true })) return globSync(input, globOptions);
        // Preserve explicit missing paths so the file loop reports them as errors.
        return exclusions ? [] : [absolute];
    };
    const ignored = new Set((options.ignore ?? []).flatMap(input => expand(input, true)));
    const ignorePath = resolve(cwd, options['ignore-path'] ?? '.latexlintignore');
    // https://github.com/kaelzhang/node-ignore/tree/7.0.6#usage
    const matcher = ignore();
    if (options['ignore-path'] !== undefined || existsSync(ignorePath))
        matcher.add(readFileSync(ignorePath, 'utf8'));
    return [...new Set(inputs.flatMap(input => expand(input)))].filter(filename => {
        if (ignored.has(filename)) return false;
        const fromCwd = posix(relative(cwd, filename));
        // Gitignore paths are relative to cwd; outside files are still linted.
        return isAbsolute(fromCwd) || fromCwd === '..' || fromCwd.startsWith('../') || !matcher.ignores(fromCwd);
    }).sort();
}
