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

declare const kuromoji: {
    builder(options: { dicPath: string }): {
        build(callback: (err: Error | null, tokenizer: Tokenizer) => void): void;
    };
};
