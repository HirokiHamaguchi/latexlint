import dictRaw from './my_vocabulary.json';

export interface VocabularyEntry {
    yes: string;
    no: string | string[];
    memo: string;
}

export interface VocabularyData {
    entries_ja: VocabularyEntry[];
    entries_en: VocabularyEntry[];
}

let cachedVocabularyData: VocabularyData | null = null;

function preprocessMemo(memo: string | string[] | null | undefined): string {
    if (!memo) return '';

    const memoList = Array.isArray(memo) ? memo : [memo];
    if (memoList.length === 0) return '';

    const processedMemo = [...memoList];
    if (processedMemo[0] === '[重言]')
        processedMemo[0] = 'この表現は重言の可能性があり、修辞技法として意図されていれば問題ありませんが、誤用の可能性もあるので注意が必要です。';

    return processedMemo.join('\n');
}

export function getVocabularyData(): VocabularyData {
    if (cachedVocabularyData) return cachedVocabularyData;

    const convertEntries = (entries: Array<{ yes: string; no: string | string[]; memo?: string | string[] | null | undefined }>): VocabularyEntry[] =>
        entries.map(entry => ({
            yes: entry.yes,
            no: entry.no,
            memo: preprocessMemo(entry.memo),
        }));

    cachedVocabularyData = {
        entries_ja: convertEntries(dictRaw.entries_ja ?? []),
        entries_en: convertEntries(dictRaw.entries_en ?? []),
    };

    return cachedVocabularyData;
}
