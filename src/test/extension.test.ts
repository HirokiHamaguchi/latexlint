import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

import findModifyTargets from '../commands/findModifyTargets';

async function testFindModifyTargets() {
	const uri = vscode.Uri.file(path.resolve(__dirname, '../../src/test/sample/sample.tex'));
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
		await new Promise(resolve => setTimeout(resolve, 500));
		assert.notStrictEqual(findModifyTargets(editor), undefined);
	}
}

suite('Extension Test Suite', () => {
	suiteTeardown(() => {
		vscode.window.showInformationMessage('All tests done!');
	});
	test('Test findModifyTargets', testFindModifyTargets);
});