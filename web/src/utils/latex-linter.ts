import { checkNoDroppingI } from "@latexlint/TextLint/no_dropping_i";
import { checkNoDroppingRa } from "@latexlint/TextLint/no_dropping_ra";
import { checkNoSuccessiveWord } from "@latexlint/TextLint/no_successive_word";
import { checkOverlookedTypo } from "@latexlint/TextLint/overlooked_typo";
import { parseSentence } from "@latexlint/TextLint/parser";
import { checkTariTari } from "@latexlint/TextLint/tari_tari";
import type { LLTextLintErrorResult } from "@latexlint/TextLint/types";
import filterDisabledLineDiagnostics from "@latexlint/util/filterDisabledLineDiagnostics";
import formatException from "@latexlint/util/formatException";
import { getCodeWithURI } from "@latexlint/util/getCodeWithURI";
import {
  displayPerformanceReport,
  lintWithPerformanceTracking,
} from "@latexlint/util/lintWithPerformanceTracking";
import * as monaco from "monaco-editor";
import type { LintConfig } from "../config";
import { getConfig } from "../config";
import * as vscode from "./vscode-mock";
import { DiagnosticSeverity, Range } from "./vscode-mock";

const VSCODE_TO_MONACO_SEVERITY: Record<number, monaco.MarkerSeverity> = {
  0: 8,
  1: 4,
  2: 2,
  3: 1,
};

// TextLint readiness state
let isTextLintReady = false;
let textLintPreloadPromise: Promise<void> | null = null;

export async function preloadTextLintDictionary(): Promise<void> {
  if (isTextLintReady || textLintPreloadPromise) {
    return textLintPreloadPromise || Promise.resolve();
  }

  textLintPreloadPromise = parseSentence("")
    .then(() => {
      isTextLintReady = true;
    })
    .catch((error) => {
      console.error("Failed to preload TextLint dictionary:", error);
      textLintPreloadPromise = null;
    });

  return textLintPreloadPromise;
}

function convertToMonacoMarker(
  diag: import("vscode").Diagnostic
): monaco.editor.IMarkerData {
  const severity =
    VSCODE_TO_MONACO_SEVERITY[diag.severity ?? DiagnosticSeverity.Information] ??
    2;

  const codeValue = String(
    typeof diag.code === "object" ? diag.code.value : diag.code
  );
  let code: string | { value: string; target: monaco.Uri } = "";
  if (typeof diag.code === "object" && diag.code.target) {
    const targetUrl = diag.code.target.toString();
    const hashMatch = targetUrl.match(/#(.+)$/);
    if (hashMatch) {
      const code_target = monaco.Uri.parse(
        `${window.location.origin}${window.location.pathname}#${hashMatch[1]}`
      );
      code = { value: codeValue, target: code_target };
    }
  }
  if (!code) code = codeValue;

  return {
    startLineNumber: diag.range.start.line + 1, // Monaco uses 1-based line numbers
    startColumn: diag.range.start.character + 1, // Monaco uses 1-based column numbers
    endLineNumber: diag.range.end.line + 1,
    endColumn: diag.range.end.character + 1,
    message: diag.message,
    severity: severity,
    source: diag.source,
    code: code,
  };
}

// Main lint function for web version
export async function lintLatex(
  text: string,
  docType: "latex" | "markdown",
  forceTextLint: boolean
): Promise<monaco.editor.IMarkerData[]> {
  const ext = docType === "latex" ? ".tex" : ".md";
  const doc = vscode.createMockTextDocument(
    text,
    vscode.Uri.file(`untitled${ext}`),
    docType === "latex" ? "latex" : "markdown"
  );
  const vscodeDoc = doc as unknown as import("vscode").TextDocument;

  const config = getConfig();
  const disabledRules = config.disabledRules || [];

  // Lint with performance tracking
  const { diagnostics, disabledLines, timings } = lintWithPerformanceTracking({
    doc: vscodeDoc,
    disabledRules,
    getConfigValue: (configKey: string) =>
      config[configKey as keyof LintConfig],
    onRuleError: (ruleName: string, error: unknown) => {
      console.warn(`Rule ${ruleName} failed:`, error);
    },
  });

  // LLTextLint checks
  if (!disabledRules.includes("LLTextLint")) {
    if (isTextLintReady || forceTextLint) {
      const textLintStart = performance.now();
      try {
        // Parse the text into tokens
        const allTokens = await parseSentence(text);

        // Run all LLTextLint checks and collect error results
        const errorResults: LLTextLintErrorResult[] = [
          ...checkNoDroppingI(allTokens),
          ...checkNoDroppingRa(allTokens),
          ...checkTariTari(allTokens),
          ...checkNoSuccessiveWord(allTokens),
          ...checkOverlookedTypo(text),
        ];

        // Convert to Diagnostics
        errorResults.forEach((error) => {
          diagnostics.push({
            code: getCodeWithURI("LLTextLint"),
            message: error.message,
            range: new Range(
              doc.positionAt(error.startOffset),
              doc.positionAt(error.endOffset)
            ),
            severity: DiagnosticSeverity.Information,
            source: "LaTeX Lint",
          });
        });
      } catch (error) {
        console.warn("LLTextLint failed:", error);
      }
      const textLintEnd = performance.now();
      timings.push({ name: "LLTextLint", time: textLintEnd - textLintStart });
    } else {
      console.log("Skipping LLTextLint");
    }
  }

  // Display performance report
  displayPerformanceReport(timings);

  const diagnosticsWithoutDisabledLines = filterDisabledLineDiagnostics(
    diagnostics,
    disabledLines
  );

  return diagnosticsWithoutDisabledLines
    .filter(
      (diag) =>
        !config.exceptions.includes(
          formatException(vscodeDoc.getText(diag.range))
        )
    )
    .map(convertToMonacoMarker);
}
