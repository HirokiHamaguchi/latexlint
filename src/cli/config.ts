import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LLCodeStrings } from '../util/constants';

// Injected from the generated extension manifest by script/build-cli.cjs.
// There is one source of default values for both products, not a CLI copy.
declare const __LATEXLINT_DEFAULTS__: Record<string, unknown>;
declare const __LATEXLINT_VERSION__: string;
const defaults = __LATEXLINT_DEFAULTS__;
export const version = __LATEXLINT_VERSION__;

export interface Configuration {
    disabledRules: string[];
    exceptions: string[];
    LLCrefExceptions: string[];
    userDefinedRules: string[];
}

function stringArray(value: unknown, key: string): string[] {
    if (!Array.isArray(value) || value.some(item => typeof item !== 'string'))
        throw new Error(`${key} must be an array of strings`);
    return value;
}

export function validateRule(name: string): void {
    if (!LLCodeStrings.includes(name)) throw new Error(`Unknown rule: ${name}`);
}

export function readConfiguration(
    cwd: string, filename?: string, enable: string[] = [], disable: string[] = []
): Configuration {
    const config: Configuration = {
        disabledRules: [...defaults.disabledRules as string[]],
        exceptions: [...defaults.exceptions as string[]],
        LLCrefExceptions: [...defaults.LLCrefExceptions as string[]],
        userDefinedRules: [...defaults.userDefinedRules as string[]]
    };
    const configPath = resolve(cwd, filename ?? '.latexlint.json');
    let data: Record<string, unknown> = {};
    if (filename !== undefined || existsSync(configPath)) {
        const parsed: unknown = JSON.parse(readFileSync(configPath, 'utf8').replace(/^\uFEFF/, ''));
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed))
            throw new Error('Configuration must be a JSON object');
        data = parsed as Record<string, unknown>;
    }
    let disabled = new Set(config.disabledRules);
    if ('default' in data) {
        if (typeof data.default !== 'boolean') throw new Error('default must be true or false');
        disabled = new Set(data.default ? [] : LLCodeStrings);
    }
    for (const [key, value] of Object.entries(data)) {
        if (key === 'default') continue;
        if (key === 'exceptions' || key === 'LLCrefExceptions' || key === 'userDefinedRules') {
            config[key] = stringArray(value, key);
            continue;
        }
        validateRule(key);
        if (typeof value !== 'boolean') throw new Error(`${key} must be true or false`);
        if (value) disabled.delete(key);
        else disabled.add(key);
    }
    for (const name of enable) {
        validateRule(name);
        disabled.delete(name);
    }
    // Match markdownlint-cli: --disable wins regardless of argument order.
    for (const name of disable) {
        validateRule(name);
        disabled.add(name);
    }
    for (const pattern of config.userDefinedRules)
        try { new RegExp(pattern, 'g'); }
        catch { throw new Error(`Invalid regular expression in userDefinedRules: ${pattern}`); }
    config.disabledRules = [...disabled];
    return config;
}
