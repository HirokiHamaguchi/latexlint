import * as assert from "assert";
import * as path from "path";
import * as vscode from "vscode";

import findModifyTargets from "../util/findBeginEndTargets";

async function testFindModifyTargetsTex() {
  const uri = vscode.Uri.file(
    path.resolve(__dirname, "../../sample/otherFeature.tex")
  );
  if (!(await vscode.workspace.fs.stat(uri))) throw new Error("File not found");
  const document = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(document);
  const text = document.getText();

  for (let [ln, col] of [
    [20, 8],
    [20, 12],
    [20, 16],
    [22, 14],
    [24, 17],
    [29, 24],
    [32, 16],
    [40, 13],
  ]) {
    ln--;
    col--; // from 1-indexed to 0-indexed
    const start = new vscode.Position(ln, col);
    const end = new vscode.Position(ln, col);
    editor.selection = new vscode.Selection(start, end);
    editor.revealRange(editor.selection);
    await new Promise((resolve) => setTimeout(resolve, 50));
    const cursorOffset = document.offsetAt(editor.selection.active);
    assert.notStrictEqual(findModifyTargets(text, cursorOffset), undefined);
  }
}

async function testFindModifyTargetsMd() {
  const uri = vscode.Uri.file(
    path.resolve(__dirname, "../../sample/otherFeature.md")
  );
  if (!(await vscode.workspace.fs.stat(uri))) throw new Error("File not found");
  const document = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(document);
  const text = document.getText();

  for (let [ln, col] of [
    [6, 8],
    [6, 12],
    [6, 16],
    [8, 14],
    [12, 17],
    [19, 24],
    [22, 16],
    // no test for figure since it's not a command
  ]) {
    ln--;
    col--; // from 1-indexed to 0-indexed
    const start = new vscode.Position(ln, col);
    const end = new vscode.Position(ln, col);
    editor.selection = new vscode.Selection(start, end);
    editor.revealRange(editor.selection);
    await new Promise((resolve) => setTimeout(resolve, 50));
    const cursorOffset = document.offsetAt(editor.selection.active);
    assert.notStrictEqual(findModifyTargets(text, cursorOffset), undefined);
  }
}

suite("Extension Test Suite", () => {
  test("Test findModifyTargetsTex", testFindModifyTargetsTex);
  test("Test findModifyTargetsMd", testFindModifyTargetsMd);
});
