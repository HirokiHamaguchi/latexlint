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
});

