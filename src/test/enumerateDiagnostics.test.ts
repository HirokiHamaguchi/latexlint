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
  const expected = 122;
  const diagnostics = await testEnumerateDiagnostics("sample/lint.tex");
  assert.strictEqual(diagnostics.length, expected);
}

async function testEnumerateDiagnosticsOther() {
  const diagnostics = await testEnumerateDiagnostics("sample/otherFeature.tex");
  assert.strictEqual(diagnostics.length, 2);
}

async function testLLTextTex() {
  const diagnostics = await testEnumerateDiagnostics("sample/testLLText.tex");
  const positions = [];
  for (const diag of diagnostics) {
    const line = diag.range.start.line + 1;
    const char = diag.range.start.character + 1;
    positions.push([line, char]);
  }
  assert.deepStrictEqual(positions, [
    [16, 2],
    [17, 9],
    [18, 15],
    [19, 4],
    [20, 6],
    [39, 1],
    [43, 1],
  ]);
}

async function testLLTextMd() {
  const diagnostics = await testEnumerateDiagnostics("sample/testLLText.md");
  const lines = [];
  for (const diag of diagnostics) {
    const line = diag.range.start.line + 1;
    lines.push(line);
  }
  assert.deepStrictEqual(lines, [13, 22]);
}

suite("Extension Test Suite", () => {
  test("Test enumerateDiagnosticsTex", testEnumerateDiagnosticsTex);
  test("Test enumerateDiagnosticsOther", testEnumerateDiagnosticsOther);
  test("Test TestLLText", testLLTextTex);
  test("Test TestLLTextMd", testLLTextMd);
});
