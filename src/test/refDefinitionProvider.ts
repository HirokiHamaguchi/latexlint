import * as assert from "assert";
import * as path from "path";
import * as vscode from "vscode";

import RefDefinitionProvider from "../commands/refDefinitionProvider";

async function testRefDefinitionProvider() {
  const uri = vscode.Uri.file(
    path.resolve(__dirname, "../../sample/otherFeature.tex")
  );
  if (!(await vscode.workspace.fs.stat(uri))) throw new Error("File not found");
  const document = await vscode.workspace.openTextDocument(uri);
  const provider = new RefDefinitionProvider();

  // Test \ref{prob:example1} - should find \label{prob:example1}
  const refPosition = new vscode.Position(83, 93); // Position on \ref{prob:example1}
  const refDefinition = await provider.provideDefinition(
    document,
    refPosition,
    new vscode.CancellationTokenSource().token
  );
  assert.ok(refDefinition, "Should find definition for \\ref{prob:example1}");
  if (refDefinition && "range" in refDefinition) {
    const labelText = document.getText(refDefinition.range);
    assert.ok(
      labelText.includes("prob:example1"),
      "Should jump to \\label{prob:example1}"
    );
  }

  // Test \cref{eq:example2} - should find \label{eq:example2}
  const crefPosition = new vscode.Position(84, 86); // Position on \cref{eq:example2}
  const crefDefinition = await provider.provideDefinition(
    document,
    crefPosition,
    new vscode.CancellationTokenSource().token
  );
  assert.ok(crefDefinition, "Should find definition for \\cref{eq:example2}");
  if (crefDefinition && "range" in crefDefinition) {
    const labelText = document.getText(crefDefinition.range);
    assert.ok(
      labelText.includes("eq:example2"),
      "Should jump to \\label{eq:example2}"
    );
  }

  // Test \Cref{fig:1} - should find \label{fig:1}
  const CrefPosition = new vscode.Position(85, 93); // Position on \Cref{fig:1}
  const CrefDefinition = await provider.provideDefinition(
    document,
    CrefPosition,
    new vscode.CancellationTokenSource().token
  );
  assert.ok(CrefDefinition, "Should find definition for \\Cref{fig:1}");
  if (CrefDefinition && "range" in CrefDefinition) {
    const labelText = document.getText(CrefDefinition.range);
    assert.ok(labelText.includes("fig:1"), "Should jump to \\label{fig:1}");
  }

  // Test non-existent label - should return undefined
  // Create a position that's not on a ref command
  const nonRefPosition = new vscode.Position(70, 5);
  const nonRefDefinition = await provider.provideDefinition(
    document,
    nonRefPosition,
    new vscode.CancellationTokenSource().token
  );
  assert.strictEqual(
    nonRefDefinition,
    undefined,
    "Should return undefined for non-ref position"
  );
}

suite("Extension Test Suite", () => {
  test("Test refDefinitionProvider", testRefDefinitionProvider);
});
