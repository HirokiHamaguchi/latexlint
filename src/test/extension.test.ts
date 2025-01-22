import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

import findModifyTargets from '../util/findModifyTargets';
import enumerateDiagnostics from '../util/enumerateDiagnostics';

async function testFindModifyTargetsTex() {
	const uri = vscode.Uri.file(path.resolve(__dirname, '../../sample/otherFeature.tex'));
	if (!await vscode.workspace.fs.stat(uri)) throw new Error('File not found');
	const document = await vscode.workspace.openTextDocument(uri);
	const editor = await vscode.window.showTextDocument(document);

	for (let [ln, col] of [
		[19, 8],
		[19, 12],
		[19, 16],
		[21, 14],
		[23, 17],
		[28, 24],
		[31, 16],
		[40, 13],
	]) {
		ln--; col--; // from 1-indexed to 0-indexed
		const start = new vscode.Position(ln, col);
		const end = new vscode.Position(ln, col);
		editor.selection = new vscode.Selection(start, end);
		editor.revealRange(editor.selection);
		await new Promise(resolve => setTimeout(resolve, 50));
		assert.notStrictEqual(findModifyTargets(editor.selection, editor.document), undefined);
	}
}

async function testFindModifyTargetsMd() {
	const uri = vscode.Uri.file(path.resolve(__dirname, '../../sample/otherFeature.md'));
	if (!await vscode.workspace.fs.stat(uri)) throw new Error('File not found');
	const document = await vscode.workspace.openTextDocument(uri);
	const editor = await vscode.window.showTextDocument(document);

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
		ln--; col--; // from 1-indexed to 0-indexed
		const start = new vscode.Position(ln, col);
		const end = new vscode.Position(ln, col);
		editor.selection = new vscode.Selection(start, end);
		editor.revealRange(editor.selection);
		await new Promise(resolve => setTimeout(resolve, 50));
		assert.notStrictEqual(findModifyTargets(editor.selection, editor.document), undefined);
	}
}

async function testEnumerateDiagnostics(fileName: string, expected: number) {
	const uri = vscode.Uri.file(path.resolve(__dirname, `../../${fileName}`));
	if (!await vscode.workspace.fs.stat(uri)) throw new Error('File not found');
	await vscode.workspace.getConfiguration('latexlint').update('disabledRules', [], vscode.ConfigurationTarget.Global);
	await vscode.workspace.getConfiguration('latexlint').update('userDefinedRules', ["f\\^a"], vscode.ConfigurationTarget.Global);
	const document = await vscode.workspace.openTextDocument(uri);
	const diagnostics = enumerateDiagnostics(document);
	assert.strictEqual(diagnostics.length, expected);
}

async function testEnumerateDiagnosticsTex() {
	await testEnumerateDiagnostics("sample/lint.tex", 88);
}

async function testEnumerateDiagnosticsMd() {
	await testEnumerateDiagnostics("sample/lint.md", 60);
}

async function testEnumerateDiagnosticsOther() {
	await vscode.workspace.getConfiguration('latexlint').update('exceptions', ["Exception handling", "Second-Order"], vscode.ConfigurationTarget.Global);
	await testEnumerateDiagnostics("sample/otherFeature.tex", 2);
}

suite('Extension Test Suite', () => {
	test('Test findModifyTargetsTex', testFindModifyTargetsTex);
	test('Test findModifyTargetsMd', testFindModifyTargetsMd);
	test('Test enumerateDiagnosticsTex', testEnumerateDiagnosticsTex);
	test('Test enumerateDiagnosticsMd', testEnumerateDiagnosticsMd);
	test('Test enumerateDiagnosticsOther', testEnumerateDiagnosticsOther);
});