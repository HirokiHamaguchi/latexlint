import * as vscode from "vscode";
import { displayPerformanceReport, lintDocument } from "./lintWithPerformanceTracking";

export default function enumerateDiagnostics(
  doc: vscode.TextDocument
): vscode.Diagnostic[] {
  const config = vscode.workspace.getConfiguration("latexlint");
  const disabledRules = config.get<string[]>("disabledRules") || [];
  const exceptions = config.get<string[]>("exceptions") || [];

  // Lint with performance tracking
  const { diagnostics, timings } = lintDocument({
    doc,
    disabledRules,
    exceptions,
    getConfigValue: (configKey: string) => config.get(configKey) as string[],
  });

  // Display performance report
  displayPerformanceReport(timings);

  return diagnostics;
}
