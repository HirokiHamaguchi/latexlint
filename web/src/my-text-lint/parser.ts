import "../kuromoji/kuromoji_types.d.ts";

export interface Token {
    word_id: number;                // word_id: 509800,          // 辞書内での単語ID
    word_type: "KNOWN" | "UNKNOWN"; // word_type: 'KNOWN',       // 単語タイプ(辞書に登録されている単語ならKNOWN, 未知語ならUNKNOWN)
    surface_form: string;           // surface_form: '黒文字',    // 表層形
    pos: string;                    // pos: '名詞',               // 品詞
    pos_detail_1: string;           // pos_detail_1: '一般',      // 品詞細分類1
    pos_detail_2: string;           // pos_detail_2: '*',        // 品詞細分類2
    pos_detail_3: string;           // pos_detail_3: '*',        // 品詞細分類3
    conjugated_type: string;        // conjugated_type: '*',     // 活用型
    conjugated_form: string;        // conjugated_form: '*',     // 活用形
    basic_form: string;             // basic_form: '黒文字',       // 基本形
    reading: string;                // reading: 'クロモジ',        // 読み
    pronunciation: string;          // pronunciation: 'クロモジ'   // 発音

    // extended
    word_position: number;          // word_position: 1,         // 単語の開始位置
    range: [number, number]; // [開始位置, 終了位置] (終了位置は含まない)
}

function splitSentences(markdown: string): string[] {
    // 「。」や「．」などの句点、感嘆符、疑問符、改行の直後を検出
    // 改行の直後で、次の行がリスト（* または - で始まる）である場合を検出
    const sentences = markdown.split(/(?<=[。．.！!？?\n])|(?=\n(?=(?:\s*[*-]\s)))/u);
    const sumSentences = sentences.reduce((acc, s) => acc + s.length, 0);
    console.assert(markdown.length === sumSentences, `splitSentences: length mismatch: ${markdown.length} vs ${sumSentences}`);
    return sentences;
}


// kuromojiのtokenizerをキャッシュするための変数
let tokenizerCache: Tokenizer | null = null;
let tokenizerPromise: Promise<Tokenizer> | null = null;

/**
 * kuromojiのtokenizerを取得（初回のみビルド、以降はキャッシュを使用）
 */
async function getTokenizer(): Promise<Tokenizer> {
    if (tokenizerCache) return tokenizerCache;
    if (tokenizerPromise) return tokenizerPromise;

    tokenizerPromise = new Promise((resolve, reject) => {
        const dicPath = `/latexlint/dict`;
        kuromoji.builder({
            dicPath: dicPath,
        }).build((err: Error | null, tokenizer: Tokenizer) => {
            if (err) {
                reject(err);
                return;
            }
            tokenizerCache = tokenizer;
            resolve(tokenizer);
        });
    });

    return tokenizerPromise;
}

export async function parseSentence(text: string): Promise<Token[][]> {
    const sentences = splitSentences(text);
    const nonEmptySentences = sentences.filter(sent => sent);

    if (nonEmptySentences.length === 0) {
        return [];
    }

    const tokenizer = await getTokenizer();
    const result: Token[][] = [];

    for (const sentence of sentences) {
        const tokens: Token[] = [];
        const kuromojiTokens = tokenizer.tokenize(sentence);
        let position = 0;
        for (const kt of kuromojiTokens) {
            const start = position;
            const end = start + kt.surface_form.length;
            position = end;
            const token = {
                ...kt,
                word_position: start + 1,
                range: [start, end],
            } as Token;
            tokens.push(token);
        }
        result.push(tokens);
    }

    return result;
}