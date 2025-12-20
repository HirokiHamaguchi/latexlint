import * as vscode from "vscode";
import addRule from "./commands/addRule";
import askWolframAlpha from "./commands/askWolframAlpha";
import detailsFoldingRangeProvider from "./commands/detailsFoldingRangeProvider";
import diagnose from "./commands/diagnose";
import fixJapaneseSpace from "./commands/fixJapaneseSpace";
import RefDefinitionProvider from "./commands/refDefinitionProvider";
import registerException from "./commands/registerException";
import renameCommand from "./commands/renameCommand";
import selectRules from "./commands/selectRules";
import showCommands from "./commands/showCommands";
import toggleLinting from "./commands/toggleLinting";
import { extensionDisplayName } from "./util/constants";
import getEditor from "./util/getEditor";

export function activate(context: vscode.ExtensionContext) {
  console.log('"latexlint" is now activated.');

  let isEnabled = true;

  const diagnosticsCollection =
    vscode.languages.createDiagnosticCollection(extensionDisplayName);
  context.subscriptions.push(diagnosticsCollection);

  const disposableAddLLRule = vscode.commands.registerCommand(
    "latexlint.addRule",
    () => {
      addRule(isEnabled, diagnosticsCollection);
    }
  );
  context.subscriptions.push(disposableAddLLRule);

  const disposableAskWolframAlpha = vscode.commands.registerCommand(
    "latexlint.askWolframAlpha",
    askWolframAlpha
  );
  context.subscriptions.push(disposableAskWolframAlpha);

  const disposableDiagnose = vscode.commands.registerCommand(
    "latexlint.diagnose",
    () => {
      const editor = getEditor(true, isEnabled);
      if (!editor) return;
      diagnose(editor.document, diagnosticsCollection, true);
    }
  );
  context.subscriptions.push(disposableDiagnose);

  const disposableRegisterException = vscode.commands.registerCommand(
    "latexlint.registerException",
    () => {
      registerException(isEnabled, diagnosticsCollection);
    }
  );
  context.subscriptions.push(disposableRegisterException);

  const disposableSelectRules = vscode.commands.registerCommand(
    "latexlint.selectRules",
    selectRules
  );
  context.subscriptions.push(disposableSelectRules);

  const disposableRenameCommand = vscode.commands.registerCommand(
    "latexlint.renameCommand",
    renameCommand
  );
  context.subscriptions.push(disposableRenameCommand);

  const disposableToggleLinting = vscode.commands.registerCommand(
    "latexlint.toggleLinting",
    () => {
      isEnabled = toggleLinting(diagnosticsCollection, isEnabled);
    }
  );
  context.subscriptions.push(disposableToggleLinting);

  const disposableShowCommands = vscode.commands.registerCommand(
    "latexlint.showCommands",
    showCommands
  );
  context.subscriptions.push(disposableShowCommands);

  const disposableFixJapaneseSpace = vscode.commands.registerCommand(
    "latexlint.fixJapaneseSpace",
    fixJapaneseSpace
  );
  context.subscriptions.push(disposableFixJapaneseSpace);

  // For md files. Folding ranges for details.
  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(
      "markdown",
      new detailsFoldingRangeProvider()
    )
  );

  // For LaTeX files. Go to definition for \ref, \cref, \Cref.
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      { language: "latex", scheme: "file" },
      new RefDefinitionProvider()
    )
  );

  // Only once on activation. Diagnose all open documents.
  vscode.workspace.textDocuments.forEach((document) => {
    if (document.languageId !== "latex" && document.languageId !== "markdown")
      return;
    if (isEnabled) diagnose(document, diagnosticsCollection, false);
  });

  // temporary removed notebook support
  // ? Can we re-add this in the future?
  // ? See c06c00b8f738e9f3a86f89c15951dfcb96baa6a7

  // Register events.
  let debounceTimeout: NodeJS.Timeout | undefined = undefined;
  vscode.workspace.onDidSaveTextDocument(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const editor = getEditor(false, isEnabled);
      if (!editor) return;
      diagnose(editor.document, diagnosticsCollection, false);
    }, 1000);
  });

  // vscode.workspace.onDidCloseTextDocument and
  // vscode.workspace.onDidCloseNotebookDocument
  // will not work as expected. Thus, we use the following event.
  vscode.window.onDidChangeVisibleTextEditors(() => {
    const validURIs = [];
    for (const editor of vscode.window.visibleTextEditors)
      if (
        editor.document.languageId === "latex" ||
        editor.document.languageId === "markdown"
      )
        validURIs.push(editor.document.uri);
    for (const [uri, _] of diagnosticsCollection) {
      if (uri.scheme !== "file") continue;
      if (!validURIs.includes(uri)) diagnosticsCollection.delete(uri);
    }
    for (const editor of vscode.window.visibleTextEditors) {
      if (
        editor.document.languageId !== "latex" &&
        editor.document.languageId !== "markdown"
      )
        continue;
      diagnose(editor.document, diagnosticsCollection, false);
    }
  });
}

export function deactivate() {
  console.log('"latexlint" is now deactivated.');
}
