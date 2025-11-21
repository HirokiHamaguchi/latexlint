import { parseSentence } from "../src/LLTextLint/parser";
import { describe, it } from "vitest";


describe("checkParse", () => {
    it("should not detect errors", async () => {
        const text = "これはペンです。";
        await parseSentence(text);
    });
});
