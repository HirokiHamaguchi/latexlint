import { parseSentence } from "../src/my-text-lint/parser";
import { describe, it } from "vitest";


describe("checkParse", () => {
    it("should not detect errors", () => {
        const text = "これはペンです。";
        parseSentence(text);
    });
});
