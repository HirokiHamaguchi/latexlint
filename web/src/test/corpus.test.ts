import { checkNoDroppingI } from "@latexlint/TextLint/no_dropping_i";
import { checkOverlookedTypo } from "@latexlint/TextLint/overlooked_typo";
import { parseSentence } from "@latexlint/TextLint/parser";
import { checkTariTari } from "@latexlint/TextLint/tari_tari";

import * as fs from "fs";
import * as path from "path";
import { describe, it } from "vitest";


// Additional tests for each function
describe("TextLint corpus", () => {
    it("should run without errors", async () => {
        // ファイルリストを読み込む
        const fileListPath = path.resolve("src/test/util/japanese_markdown_files.txt");

        let fileNames = fs.readFileSync(fileListPath, "utf-8").split(/\r?\n/).filter(Boolean);
        fileNames = fileNames.slice(0, 10); // 最初の10ファイルに制限

        for (const fileName of fileNames) {
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

            for (const result of results) {
                console.log(`- ${fileName}: ${result.message} (offset ${result.startOffset})`);
            }
        }
    });
}, 60000); // Increase timeout for file processing
