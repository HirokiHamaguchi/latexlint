import * as vscode from 'vscode';

import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

const operatorCommandPattern = /(?:^|[^_^]\s*)\\mathrm\{([A-Za-z]{2,})\}\s*[0-9A-Za-z]/g;
const operatorDefinitionPattern = /\\newcommand\{\\[A-Za-z]+\}\{\\mathrm\{([A-Za-z]{2,})\}\}/g;

const commandsToDetect = new Set<string>([
    // Linear algebra
    'det',
    'rank',
    'tr',
    'trace',
    'span',
    'dim',
    'ker',
    'coker',
    'im',
    'img',
    'null',
    'nullity',
    'diag',
    'spec',
    'spr', // spectral radius
    'adj',
    'cof', // cofactor
    'minor',
    'char',
    'eig',
    'eigval',
    'eigvec',

    // Algebra / number theory
    'gcd',
    'lcm',
    'sgn',
    'sign',
    'ord',
    'val',
    'disc',
    'res', // resultant
    'rad',
    'gal',
    'aut',
    'end',
    'hom',
    'iso',
    'ext',
    'tor',
    'ann',
    'spec',
    'proj',

    // Complex analysis / real-imaginary parts
    're',
    'im',
    'arg',
    'log',
    'res',
    'supp',

    // Optimization
    'argmax',
    'argmin',
    'esssup',
    'essinf',
    'prox',
    'proj',

    // Probability / statistics
    'pr',
    'var',
    'cov',
    'corr',
    'sd', // standard deviation
    'se', // standard error
    'bias',
    'mse',
    'med',
    'mode',
    'quantile',
    'exp',
    'kl',
    'tv',

    // Geometry / vector calculus
    'vol',
    'area',
    'diam',
    'dist',
    'length',
    'grad',
    'div',
    'curl',
    'rot',
    'lap',
    'hess',
    'jac',
    'ric',
    'scal',

    // Functional analysis / operators
    'op',
    'ess',
    'dom',
    'ran',
    'graph',
    'id',
    'supp',
    'conv',
    'cl',
    'int',
    'bd',
    'relint',

    // Category theory / logic / CS-adjacent math
    'ob',
    'mor',
    'nat',
    'colim',
    'codim',
    'codom',
    'dom',
    'fix',
    'poly',
    'polylog'
]);

export default function LLOperator(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = 'LLOperator';
    const message = messages[code];
    const ranges: vscode.Range[] = [];

    for (const pattern of [operatorCommandPattern, operatorDefinitionPattern])
        for (const match of txt.text.matchAll(pattern)) {
            if (match.index === undefined) continue;
            if (!txt.isValid(match.index)) continue;
            if (!commandsToDetect.has(match[1].toLowerCase())) continue;
            ranges.push(new vscode.Range(doc.positionAt(match.index), doc.positionAt(match.index + match[0].length)));
        }

    return ranges2diagnostics(code, message, ranges);
}
