import type { LLTextLintErrorResult } from "./types";

const KANJI_TO_KATAKANA: Record<string, string> = {
    "工": "エ",
    "力": "カ",
    "夕": "タ",
    "千": "チ",
    "卜": "ト",
    "二": "ニ",
    "八": "ハ",
    "匕": "ヒ",
    "三": "ミ",
    "口": "ロ",
};

const KATAKANA = "ァ-ヿ"; // カタカナ
const HIRAGANA = "ぁ-ゟ"; // ひらがな
const EXT_KATAKANA = "ァ-・ヽ-ヿ"; // 中点・繰返し記号を含むカタカナ拡張

const KANJI_LIKE_KATAKANA = "工力夕千卜二八匕三口";
const KATAKANA_LIKE_HIRAGANA = "ヘベペリ";

// カタカナに混じる漢字
const UNNATURAL_KANJI_WITH_KATAKANA = new RegExp(
    `([${KANJI_LIKE_KATAKANA}](?=[${KATAKANA}])|` +
    `(?<=[${KATAKANA}])[${KANJI_LIKE_KATAKANA}](?=[${KATAKANA}])|` +
    `(?<=[${KATAKANA}])[${KANJI_LIKE_KATAKANA}])`,
    "g"
);

// カタカナに混じるひらがな
const UNNATURAL_HIRAGANA_WITH_KATAKANA = new RegExp(
    `(?:[べぺ](?=[${EXT_KATAKANA}]{2})|` +
    `(?<=[${EXT_KATAKANA}]{2})[べぺり]|` +
    `(?<=[${EXT_KATAKANA}])[り](?=[${EXT_KATAKANA}]))`,
    "g"
);

// ひらがなに混じるカタカナ
const UNNATURAL_KATAKANA_WITH_HIRAGANA = new RegExp(
    `(?:(?<=[^${KATAKANA}])[${KATAKANA_LIKE_HIRAGANA}](?=[${HIRAGANA}]{2})|` +
    `(?<=[${HIRAGANA}]{2})[${KATAKANA_LIKE_HIRAGANA}](?=[^${KATAKANA}])|` +
    `(?<=[${HIRAGANA}])[${KATAKANA_LIKE_HIRAGANA}](?=[${HIRAGANA}]))`,
    "g"
);

const BUILTIN_ALLOWS = [
    "アール", "アト", "アンペア", "インチ", "ウォン", "エーカー", "エクサ", "オーム", "オクターブ", "オクテット", "オングストローム", "オンス",
    "ガウス", "カラット", "カロリー", "ガロン", "ガウス", "カンデラ", "ギガ", "キュビット", "キロ", "クーロン", "クエクト", "クエタ", "グラム", "クローネ", "クロム酸", "ケルビン",
    "シーベルト", "ジュール", "スタディオン", "ステラジアン", "ゼタ", "ゼプト", "センチ", "セント",
    "デカ", "デシ", "テラ", "ドゥカート", "ドット", "ドル", "トン",
    "ナット", "ナノ", "ニュートン", "ノット",
    "パーセク", "パーセント", "バーツ", "バイト", "パスカル", "ピース", "ビット", "ピクセル", "ピコ", "フィート", "フェムト", "フローリン", "フラン", "ページ", "ヘクタール", "ヘクト", "ベクレル", "ペソ", "ペタ", "ベルスタ", "ヘルツ", "ポイント", "ボルト", "ポンド",
    "マイル", "マイクロ", "ミリ", "メートル", "メガ", "モル",
    "ヤード", "ユーロ", "ヨクト", "ヨタ",
    "ライン", "ラジアン", "リットル", "リラ", "ルーメン", "ルクス", "ルピー", "ロナ", "ロント",
    "ワード", "ワット",
];
const MAX_LEN_OF_ALLOW = Math.max(...BUILTIN_ALLOWS.map(x => x.length));

export function checkOverlookedTypo(text: string): LLTextLintErrorResult[] {
    const errors: LLTextLintErrorResult[] = [];

    // カタカナに混じる漢字
    for (const match of text.matchAll(UNNATURAL_KANJI_WITH_KATAKANA)) {
        const wrong = match[0];
        const correct = KANJI_TO_KATAKANA[wrong];

        if (["二", "三", "八"].includes(wrong)) {
            const prev3 = text.slice(Math.max(0, match.index! - 3), match.index);
            if (prev3 === "マッハ") continue;
            const prev4 = text.slice(Math.max(0, match.index! - 4), match.index);
            if (prev4 === "ステップ") continue;
            const nextN = text.slice(match.index! + wrong.length, match.index! + MAX_LEN_OF_ALLOW);
            if (BUILTIN_ALLOWS.some(x => nextN.startsWith(x))) continue;
        } else if (wrong === "力") {
            const prev1 = text.slice(Math.max(0, match.index! - 1), match.index);
            if (prev1 === "入") continue;
        }

        if (correct)
            errors.push({
                startOffset: match.index!,
                endOffset: match.index! + wrong.length,
                message: `漢字の「${wrong}」はカタカナの「${correct}」の誤りの可能性があります`,
                code: "overlooked-typo",
            });
    }

    // カタカナに混じるひらがな
    for (const match of text.matchAll(UNNATURAL_HIRAGANA_WITH_KATAKANA)) {
        const wrong = match[0];
        if (wrong === "り") {
            const prev2 = text.slice(Math.max(0, match.index! - 2), match.index);
            if (["ハマ"].includes(prev2)) continue;
        }
        const correct = String.fromCharCode(wrong.charCodeAt(0) + 0x60); // 平仮名→片仮名

        errors.push({
            startOffset: match.index!,
            endOffset: match.index! + wrong.length,
            message: `ひらがなの「${wrong}」はカタカナの「${correct}」の誤りの可能性があります`,
            code: "overlooked-typo",
        });
    }

    // ひらがなに混じるカタカナ
    for (const match of text.matchAll(UNNATURAL_KATAKANA_WITH_HIRAGANA)) {
        const wrong = match[0];
        const correct = String.fromCharCode(wrong.charCodeAt(0) - 0x60); // 片仮名→平仮名

        errors.push({
            startOffset: match.index!,
            endOffset: match.index! + wrong.length,
            message: `カタカナの「${wrong}」はひらがなの「${correct}」の誤りの可能性があります`,
            code: "overlooked-typo",
        });
    }

    return errors;
}
