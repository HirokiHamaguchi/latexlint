import sampleMdBefore from '../../sample/sample_before.md?raw';
import sampleTexBefore from '../../sample/sample_before.tex?raw';
import type { DocType } from '../types';

export const DEFAULT_DOC_TYPE: DocType = 'latex';

export const SAMPLES: Record<DocType, string> = {
    latex: sampleTexBefore,
    markdown: sampleMdBefore,
};
