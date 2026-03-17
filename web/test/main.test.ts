import { checkNoDroppingI } from "@latexlint/TextLint/no_dropping_i";
import { checkNoDroppingRa } from "@latexlint/TextLint/no_dropping_ra";
import { checkOverlookedTypo } from "@latexlint/TextLint/overlooked_typo";
import { parseSentence, Token } from "@latexlint/TextLint/parser";
import { checkTariTari } from "@latexlint/TextLint/tari_tari";
import type { LLTextLintErrorResult } from "@latexlint/TextLint/types";
import { describe, expect, it } from "vitest";

import fs from "fs";
import path from "path";

interface TestData {
  valid: string[];
  invalid: string[];
}

function loadTestData(fileName: string): TestData {
  const filePath = path.join(__dirname, "json", fileName);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return data as TestData;
}

function runCommonTests(
  testName: string,
  jsonFileName: string,
  checkFunction: (tokens: Token[]) => LLTextLintErrorResult[]
) {
  const testData = loadTestData(jsonFileName);

  describe(testName, () => {
    it("should not detect errors in valid cases", async () => {
      for (const text of testData.valid) {
        const allTokens = await parseSentence(text);
        const errors = checkFunction(allTokens);
        expect(errors.length).toBe(0);
      }
    });

    it("should detect errors in invalid cases", async () => {
      for (const text of testData.invalid) {
        const allTokens = await parseSentence(text);
        const errors = checkFunction(allTokens);
        expect(errors.length).toBeGreaterThan(0);
      }
    });
  });
}

function runCommonTestsSync(
  testName: string,
  jsonFileName: string,
  checkFunction: (text: string) => LLTextLintErrorResult[]
) {
  const testData = loadTestData(jsonFileName);

  describe(testName, () => {
    it("should not detect errors in valid cases", () => {
      for (const text of testData.valid) {
        const errors = checkFunction(text);
        expect(errors.length).toBe(0);
      }
    });

    it("should detect errors in invalid cases", () => {
      for (const text of testData.invalid) {
        const errors = checkFunction(text);
        expect(errors.length, text).toBeGreaterThan(0);
      }
    });
  });
}

runCommonTests("checkNoDroppingI", "no_dropping_i.json", checkNoDroppingI);
runCommonTests("checkNoDroppingRa", "no_dropping_ra.json", checkNoDroppingRa);
runCommonTests("checkTariTari", "tari_tari.json", checkTariTari);

runCommonTestsSync("checkOverlookedTypo", "overlooked_typo.json", checkOverlookedTypo);
