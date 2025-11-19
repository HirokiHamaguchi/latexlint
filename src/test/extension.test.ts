import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

import findModifyTargets from '../util/findBeginEndTargets';
import enumerateDiagnostics from '../util/enumerateDiagnostics';
import RefDefinitionProvider from '../commands/refDefinitionProvider';

async function testFindModifyTargetsTex() {
	const uri = vscode.Uri.file(path.resolve(__dirname, '../../sample/otherFeature.tex'));
	if (!await vscode.workspace.fs.stat(uri)) throw new Error('File not found');
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
		ln--; col--; // from 1-indexed to 0-indexed
		const start = new vscode.Position(ln, col);
		const end = new vscode.Position(ln, col);
		editor.selection = new vscode.Selection(start, end);
		editor.revealRange(editor.selection);
		await new Promise(resolve => setTimeout(resolve, 50));
		const cursorOffset = document.offsetAt(editor.selection.active);
		assert.notStrictEqual(findModifyTargets(text, cursorOffset), undefined);
	}
}

async function testFindModifyTargetsMd() {
	const uri = vscode.Uri.file(path.resolve(__dirname, '../../sample/otherFeature.md'));
	if (!await vscode.workspace.fs.stat(uri)) throw new Error('File not found');
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
		ln--; col--; // from 1-indexed to 0-indexed
		const start = new vscode.Position(ln, col);
		const end = new vscode.Position(ln, col);
		editor.selection = new vscode.Selection(start, end);
		editor.revealRange(editor.selection);
		await new Promise(resolve => setTimeout(resolve, 50));
		const cursorOffset = document.offsetAt(editor.selection.active);
		assert.notStrictEqual(findModifyTargets(text, cursorOffset), undefined);
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
	const bug = 4;
	const correct = 120;
	await testEnumerateDiagnostics("sample/lint.tex", bug + correct);
}


async function testEnumerateDiagnosticsOther() {
	await vscode.workspace.getConfiguration('latexlint');
	await testEnumerateDiagnostics("sample/otherFeature.tex", 2);
}

async function testRefDefinitionProvider() {
	const uri = vscode.Uri.file(path.resolve(__dirname, '../../sample/otherFeature.tex'));
	if (!await vscode.workspace.fs.stat(uri)) throw new Error('File not found');
	const document = await vscode.workspace.openTextDocument(uri);
	const provider = new RefDefinitionProvider();

	// Test \ref{prob:example1} - should find \label{prob:example1}
	const refPosition = new vscode.Position(83, 93); // Position on \ref{prob:example1}
	const refDefinition = await provider.provideDefinition(document, refPosition, new vscode.CancellationTokenSource().token);
	assert.ok(refDefinition, 'Should find definition for \\ref{prob:example1}');
	if (refDefinition && 'range' in refDefinition) {
		const labelText = document.getText(refDefinition.range);
		assert.ok(labelText.includes('prob:example1'), 'Should jump to \\label{prob:example1}');
	}

	// Test \cref{eq:example2} - should find \label{eq:example2}
	const crefPosition = new vscode.Position(84, 86); // Position on \cref{eq:example2}
	const crefDefinition = await provider.provideDefinition(document, crefPosition, new vscode.CancellationTokenSource().token);
	assert.ok(crefDefinition, 'Should find definition for \\cref{eq:example2}');
	if (crefDefinition && 'range' in crefDefinition) {
		const labelText = document.getText(crefDefinition.range);
		assert.ok(labelText.includes('eq:example2'), 'Should jump to \\label{eq:example2}');
	}

	// Test \Cref{fig:1} - should find \label{fig:1}
	const CrefPosition = new vscode.Position(85, 93); // Position on \Cref{fig:1}
	const CrefDefinition = await provider.provideDefinition(document, CrefPosition, new vscode.CancellationTokenSource().token);
	assert.ok(CrefDefinition, 'Should find definition for \\Cref{fig:1}');
	if (CrefDefinition && 'range' in CrefDefinition) {
		const labelText = document.getText(CrefDefinition.range);
		assert.ok(labelText.includes('fig:1'), 'Should jump to \\label{fig:1}');
	}

	// Test non-existent label - should return undefined
	const text = document.getText();
	const pos = document.positionAt(text.indexOf('\\ref{prob:example1}') + 5);
	// Create a position that's not on a ref command
	const nonRefPosition = new vscode.Position(70, 5);
	const nonRefDefinition = await provider.provideDefinition(document, nonRefPosition, new vscode.CancellationTokenSource().token);
	assert.strictEqual(nonRefDefinition, undefined, 'Should return undefined for non-ref position');
}

suite('Extension Test Suite', () => {
	test('Test findModifyTargetsTex', testFindModifyTargetsTex);
	test('Test findModifyTargetsMd', testFindModifyTargetsMd);
	test('Test enumerateDiagnosticsTex', testEnumerateDiagnosticsTex);
	test('Test enumerateDiagnosticsOther', testEnumerateDiagnosticsOther);
	test('Test refDefinitionProvider', testRefDefinitionProvider);
});