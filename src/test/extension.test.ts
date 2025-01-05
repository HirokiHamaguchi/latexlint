import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

import findModifyTargets from '../commands/findModifyTargets';
import enumerateDiagnostics from '../commands/enumerateDiagnostics';

async function testFindModifyTargetsTex() {
	const uri = vscode.Uri.file(path.resolve(__dirname, '../../sample/rename.tex'));
	if (!await vscode.workspace.fs.stat(uri)) throw new Error('File not found');
	const document = await vscode.workspace.openTextDocument(uri);
	const editor = await vscode.window.showTextDocument(document);

	for (let [ln, col] of [
		[18, 8],
		[18, 12],
		[18, 16],
		[20, 14],
		[22, 17],
		[27, 24],
		[30, 16],
		[39, 13],
	]) {
		ln--; col--; // from 1-indexed to 0-indexed
		const start = new vscode.Position(ln, col);
		const end = new vscode.Position(ln, col);
		editor.selection = new vscode.Selection(start, end);
		editor.revealRange(editor.selection);
		await new Promise(resolve => setTimeout(resolve, 100));
		assert.notStrictEqual(findModifyTargets(editor), undefined);
	}
}

async function testFindModifyTargetsMd() {
	const uri = vscode.Uri.file(path.resolve(__dirname, '../../sample/rename.md'));
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
		await new Promise(resolve => setTimeout(resolve, 100));
		assert.notStrictEqual(findModifyTargets(editor), undefined);
	}
}

async function testEnumerateDiagnosticsTex() {
	const uri = vscode.Uri.file(path.resolve(__dirname, '../../sample/lint.tex'));
	if (!await vscode.workspace.fs.stat(uri)) throw new Error('File not found');
	const document = await vscode.workspace.openTextDocument(uri);
	const diagnostics = enumerateDiagnostics(document);
	assert.strictEqual(diagnostics.length, 58);
}

async function testEnumerateDiagnosticsMd() {
	const uri = vscode.Uri.file(path.resolve(__dirname, '../../sample/lint.md'));
	if (!await vscode.workspace.fs.stat(uri)) throw new Error('File not found');
	const document = await vscode.workspace.openTextDocument(uri);
	const diagnostics = enumerateDiagnostics(document);
	assert.strictEqual(diagnostics.length, 38);
}

suite('Extension Test Suite', () => {
	test('Test findModifyTargetsTex', testFindModifyTargetsTex);
	test('Test findModifyTargetsMd', testFindModifyTargetsMd);
	test('Test enumerateDiagnosticsTex', testEnumerateDiagnosticsTex);
	test('Test enumerateDiagnosticsMd', testEnumerateDiagnosticsMd);
});