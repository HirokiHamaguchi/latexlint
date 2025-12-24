import * as vscode from "vscode";
import formatException from "./formatException";
import {
  displayPerformanceReport,
  lintWithPerformanceTracking,
} from "./lintWithPerformanceTracking";

export default function enumerateDiagnostics(
  doc: vscode.TextDocument
): vscode.Diagnostic[] {
  const config = vscode.workspace.getConfiguration("latexlint");
  const disabledRules = config.get<string[]>("disabledRules") || [];
  const exceptions = config.get<string[]>("exceptions") || [];

  // Lint with performance tracking
  const { diagnostics, timings } = lintWithPerformanceTracking({
    doc,
    disabledRules,
    getConfigValue: (configKey: string) => config.get(configKey) as string[],
  });

  // Filter exceptions
  const filteredDiagnostics = diagnostics.filter(
    (diag) => !exceptions.includes(formatException(doc.getText(diag.range)))
  );

  // Display performance report
  displayPerformanceReport(timings);

  return filteredDiagnostics;
}
