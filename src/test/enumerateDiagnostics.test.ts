import * as assert from "assert";
import * as path from "path";
import * as vscode from "vscode";

import enumerateDiagnostics from "../util/enumerateDiagnostics";

async function testEnumerateDiagnostics(fileName: string) {
  const uri = vscode.Uri.file(path.resolve(__dirname, `../../${fileName}`));
  if (!(await vscode.workspace.fs.stat(uri))) throw new Error("File not found");
  await vscode.workspace
    .getConfiguration("latexlint")
    .update("disabledRules", [], vscode.ConfigurationTarget.Global);
  await vscode.workspace
    .getConfiguration("latexlint")
    .update("userDefinedRules", ["f\\^a"], vscode.ConfigurationTarget.Global);
  const document = await vscode.workspace.openTextDocument(uri);
  return enumerateDiagnostics(document);
}

// !! AUTO_GENERATED !!
async function testEnumerateDiagnosticsTex() {
  const expected = 118;
  const diagnostics = await testEnumerateDiagnostics("sample/lint.tex");
  assert.strictEqual(diagnostics.length, expected);
}

async function testEnumerateDiagnosticsOther() {
  const diagnostics = await testEnumerateDiagnostics("sample/otherFeature.tex");
  assert.strictEqual(diagnostics.length, 2);
}

async function testEnumerateDiagnosticsLocalTestTex() {
  const diagnostics = await testEnumerateDiagnostics(
    "sample/localTest.LLText.tex"
  );
  const lines = [];
  for (const diag of diagnostics) {
    const line = diag.range.start.line + 1;
    lines.push(line);
  }
  assert.deepStrictEqual(lines, [16, 17, 18, 19, 20, 40, 44]);
}

async function testEnumerateDiagnosticsLocalTestMd() {
  const diagnostics = await testEnumerateDiagnostics(
    "sample/localTest.LLText.md"
  );
  const lines = [];
  for (const diag of diagnostics) {
    const line = diag.range.start.line + 1;
    lines.push(line);
  }
  assert.deepStrictEqual(lines, [16, 17, 18, 19, 20, 40, 44]);
}

suite("Extension Test Suite", () => {
  test("Test enumerateDiagnosticsTex", testEnumerateDiagnosticsTex);
  test("Test enumerateDiagnosticsOther", testEnumerateDiagnosticsOther);
  test(
    "Test enumerateDiagnosticsLocalTestTex",
    testEnumerateDiagnosticsLocalTestTex
  );
  test(
    "Test enumerateDiagnosticsLocalTestMd",
    testEnumerateDiagnosticsLocalTestMd
  );
});
