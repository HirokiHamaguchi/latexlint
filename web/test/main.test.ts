import { describe, it, expect } from "vitest";
import { parseSentence, Token } from "../src/my-text-lint/parser";
import type { MyTextLintErrorResult } from "../src/my-text-lint/types";
import { checkNoDroppingI } from "../src/my-text-lint/no_dropping_i";
import { checkNoDroppingRa } from "../src/my-text-lint/no_dropping_ra";
import { checkOverlookedTypo } from "../src/my-text-lint/overlooked_typo";
import { checkTariTari } from "../src/my-text-lint/tari_tari";
import { checkUsageError } from "../src/my-text-lint/usage_error";

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
  checkFunction: (tokens: Token[]) => MyTextLintErrorResult[]
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
  checkFunction: (text: string) => MyTextLintErrorResult[]
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
runCommonTestsSync("usage_error", "usage_error.json", checkUsageError);
