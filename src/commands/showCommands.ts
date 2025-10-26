import * as vscode from 'vscode';

export default async function showCommands() {
    const commands = [
        { label: "Diagnose Current File", command: "latexlint.diagnose" },
        { label: "Toggle LaTeX Lint", command: "latexlint.toggleLinting" },
        { label: "Add Custom Detection Rule", command: "latexlint.addRule" },
        { label: "Add Exception Word", command: "latexlint.registerException" },
        { label: "Choose Detection Rules", command: "latexlint.selectRules" },
        { label: "Rename \\begin or \\end Commands", command: "latexlint.renameCommand" },
        { label: "Query Wolfram Alpha", command: "latexlint.askWolframAlpha" },
        { label: "Fix Japanese Spacing", command: "latexlint.fixJapaneseSpace" },
    ];

    const selectedCommand = await vscode.window.showQuickPick(commands, {
        placeHolder: 'Select a command to execute'
    });

    if (selectedCommand) vscode.commands.executeCommand(selectedCommand.command);
}