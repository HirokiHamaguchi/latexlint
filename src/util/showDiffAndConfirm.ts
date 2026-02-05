import * as os from 'os';
import * as vscode from 'vscode';

export default async function showDiffAndConfirm(
    originalUri: vscode.Uri,
    modifiedText: string,
    diffLabel: string
): Promise<boolean> {
    // Create a temporary file to show the modified content
    const tempUri = vscode.Uri.joinPath(
        vscode.Uri.file(os.tmpdir()),
        `latexlint-diff-${Math.random().toString(36).slice(2)}.tex`
    );

    try {
        // Write the modified content to the temp file
        await vscode.workspace.fs.writeFile(tempUri, Buffer.from(modifiedText));

        // Show the diff
        await vscode.commands.executeCommand('vscode.diff', originalUri, tempUri, diffLabel);

        // Show quick pick for confirmation
        const choice = await vscode.window.showQuickPick(
            ['Apply', 'Cancel'],
            {
                title: `Apply changes shown in the diff?`,
                ignoreFocusOut: true,
            }
        );

        // Close the diff tab and clean up the temp file
        try {
            for (const group of vscode.window.tabGroups.all)
                for (const tab of group.tabs)
                    if (tab.input instanceof vscode.TabInputTextDiff)
                        if (
                            tab.input.original.toString() === originalUri.toString() &&
                            tab.input.modified.toString() === tempUri.toString()
                        )
                            await vscode.window.tabGroups.close(tab, true);

            await vscode.workspace.fs.delete(tempUri, { useTrash: false });
        } catch (e) {
            console.error('Error during cleanup of temp files or tabs:', e);
        }
        return choice === 'Apply';
    } catch (e) {
        try {
            await vscode.workspace.fs.delete(tempUri, { useTrash: false });
        } catch (cleanupError) {
            console.error('Error deleting temp file during error handling:', cleanupError);
        }
        throw e;
    }
}
