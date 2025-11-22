import dictRaw from './my_vocabulary.json';

export interface VocabularyEntry {
    yes: string;
    no: string | string[];
    memo: string;
}

let cachedVocabularyData: VocabularyEntry[] | null = null;

function preprocessMemo(memo: string[] | null | undefined): string {
    if (!memo || memo.length === 0) return '';

    const processedMemo = [...memo];
    if (processedMemo[0] === '[重言]')
        processedMemo[0] = 'この表現は重言の可能性があり、修辞技法として意図されていれば問題ありませんが、誤用の可能性もあるので注意が必要です。';

    return processedMemo.join('\n');
}

export function getVocabularyData(): VocabularyEntry[] {
    if (cachedVocabularyData) return cachedVocabularyData;

    cachedVocabularyData = dictRaw.entries.map(entry => ({
        yes: entry.yes,
        no: entry.no,
        memo: preprocessMemo(entry.memo),
    }));

    return cachedVocabularyData;
}
