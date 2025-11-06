import { checkNoDroppingI } from "../src/my-text-lint/no_dropping_i";
import { checkOverlookedTypo } from "../src/my-text-lint/overlooked_typo";
import { parseSentence } from "../src/my-text-lint/parser";
import { checkTariTari } from "../src/my-text-lint/tari_tari";

import * as fs from "fs";
import * as path from "path";
import { describe, it } from "vitest";


// Additional tests for each function
describe("TextLint corpus", () => {
    it("should run without errors", async () => {
        // ファイルリストを読み込む
        const fileListPath = path.resolve("test/util/japanese_markdown_files.txt");

        let fileNames = fs.readFileSync(fileListPath, "utf-8").split(/\r?\n/).filter(Boolean);
        fileNames = fileNames.slice(0, 10); // 最初の10ファイルに制限

        for (const fileName of fileNames) {
            console.log(`\n=== ${fileName} ===`);
            const filePath = path.resolve("../" + fileName);
            if (!fs.existsSync(filePath)) {
                console.warn(`File not found: ${filePath}`);
                continue;
            }
            const content = fs.readFileSync(filePath, "utf-8");
            const allTokens = await parseSentence(content);
            const typoResults = checkOverlookedTypo(content);
            const droppingIResults = checkNoDroppingI(allTokens);
            const tariResults = checkTariTari(allTokens);

            const results = [
                ...typoResults,
                ...droppingIResults,
                ...tariResults
            ];

            if (results.length === 0) {
                continue;
            }

            // allTokensはToken[][]なので、各Token[]を結合して1文とみなす
            const sentences = allTokens.map(tokens => tokens.map(token => token.surface_form).join(""));

            for (const result of results) {
                let sentenceIndex = -1;
                let charCount = 0;
                for (let i = 0; i < sentences.length; i++) {
                    const sentence = sentences[i];
                    const start = charCount;
                    const end = charCount + sentence.length;
                    if (result.range[0] >= start && result.range[0] < end) {
                        sentenceIndex = i;
                        break;
                    }
                    charCount = end;
                }
                const matchedSentence = sentenceIndex >= 0 ? sentences[sentenceIndex] : "(文が特定できません)";
                console.log(`- ${result.message}(${result.range[0] - charCount})\n  ${matchedSentence.trim()}`);
            }
        }
    });
});

