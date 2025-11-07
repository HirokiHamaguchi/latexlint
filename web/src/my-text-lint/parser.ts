import * as kuromojiModule from "../kuromoji/kuromoji.js";

interface KuromojiToken {
    word_id: number;
    word_type: "KNOWN" | "UNKNOWN";
    surface_form: string;
    pos: string;
    pos_detail_1: string;
    pos_detail_2: string;
    pos_detail_3: string;
    conjugated_type: string;
    conjugated_form: string;
    basic_form: string;
    reading: string;
    pronunciation: string;
}

interface Tokenizer {
    tokenize(text: string): KuromojiToken[];
}

interface Builder {
    build(callback: (err: Error | null, tokenizer: Tokenizer) => void): void;
}


interface KuromojiStatic {
    builder(options: { dicPath: string }): Builder;
}

// Extend Window interface to include kuromoji
declare global {
    interface Window {
        kuromoji?: KuromojiStatic;
    }
}

// kuromoji.js uses UMD format and exports as global window.kuromoji in browser
// In browser environment, access it via window.kuromoji
// In test environment with Node.js, use the imported module
const kuromoji: KuromojiStatic = (() => {
    // Try to get from window object (browser environment)
    if (typeof window !== 'undefined' && window.kuromoji) {
        return window.kuromoji;
    }
    // Fallback to module import (test environment)
    return kuromojiModule as unknown as KuromojiStatic;
})();


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
    range: [number, number];        // [開始位置, 終了位置] (終了位置は含まない)
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

export async function parseSentence(text: string): Promise<Token[]> {
    if (!text) return [];

    const tokenizer = await getTokenizer();
    const kuromojiTokens = tokenizer.tokenize(text);

    const tokens: Token[] = [];
    let position = 0;

    for (let i = 0; i < kuromojiTokens.length; i++) {
        const len = kuromojiTokens[i].surface_form.length;
        tokens.push({
            ...kuromojiTokens[i],
            word_position: position + 1,
            range: [position, position + len],
        });
        position += len;
    }

    return tokens;
}