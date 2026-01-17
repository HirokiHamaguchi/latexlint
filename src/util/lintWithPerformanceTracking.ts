import type * as vscode from "vscode";
import createLLTextVSCode from "../LLText/createLLTextVSCode";
import { configuredRules, standardRules } from "./rules";

export interface PerformanceTiming {
  name: string;
  time: number;
}

export interface LintOptions {
  doc: vscode.TextDocument;
  disabledRules: string[];
  getConfigValue: (configKey: string) => unknown;
  onRuleError?: (ruleName: string, error: unknown) => void;
}

/**
 * Lint rules with performance tracking
 * This function executes all standard and configured rules while measuring execution time
 */
export function lintWithPerformanceTracking(options: LintOptions): {
  diagnostics: vscode.Diagnostic[];
  timings: PerformanceTiming[];
} {
  const { doc, disabledRules, getConfigValue, onRuleError } = options;
  const timings: PerformanceTiming[] = [];

  // Create LLText object with all computed metadata
  const createLLTextStart = performance.now();
  const [txt, diagnostics] = createLLTextVSCode(doc);
  const createLLTextEnd = performance.now();
  timings.push({
    name: "createLLText",
    time: createLLTextEnd - createLLTextStart,
  });

  // Process all standard rules (now includes former align rules)
  for (const [ruleName, rule] of Object.entries(standardRules)) {
    if (disabledRules.includes(ruleName)) continue;

    const ruleStart = performance.now();
    try {
      const diags = rule(doc, txt);
      diagnostics.push(...diags);
    } catch (error) {
      if (onRuleError) onRuleError(ruleName, error);
      else throw error;
    }
    const ruleEnd = performance.now();
    timings.push({ name: ruleName, time: ruleEnd - ruleStart });
  }

  // Process rules that require configuration
  for (const [ruleName, { rule, configKey }] of Object.entries(
    configuredRules
  )) {
    if (disabledRules.includes(ruleName)) continue;

    const ruleStart = performance.now();
    try {
      const diags = rule(doc, txt, getConfigValue(configKey));
      diagnostics.push(...diags);
    } catch (error) {
      if (onRuleError) onRuleError(ruleName, error);
      else throw error;
    }
    const ruleEnd = performance.now();
    timings.push({ name: ruleName, time: ruleEnd - ruleStart });
  }

  return { diagnostics, timings };
}

/**
 * Display performance report in console
 */
export function displayPerformanceReport(timings: PerformanceTiming[]): void {
  // Calculate total time and sort by execution time
  const topN: number = 5;
  const totalTime = timings.reduce((sum, t) => sum + t.time, 0);
  const sortedTimings = [...timings].sort((a, b) => b.time - a.time);
  const topTimings = sortedTimings.slice(0, topN);

  // Display results in table format
  console.log(`\n=== LatexLint Performance (Total: ${totalTime.toFixed(2)} ms) ===`);
  console.table(
    topTimings.map((t) => ({
      Name: t.name,
      "Time (ms)": t.time.toFixed(2),
    }))
  );
}
