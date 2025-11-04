/// <reference types="vite/client" />

declare module "*.tex?raw" {
    const content: string;
    export default content;
}

// Type definitions for kuromoji.js
declare module "*/kuromoji.js" {
    export interface KuromojiToken {
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

    export interface Tokenizer {
        tokenize(text: string): KuromojiToken[];
    }

    export interface Builder {
        build(callback: (err: Error | null, tokenizer: Tokenizer) => void): void;
    }

    export interface KuromojiStatic {
        builder(options: { dicPath: string }): Builder;
    }

    const kuromoji: KuromojiStatic;
    export default kuromoji;
}