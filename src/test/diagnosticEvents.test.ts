import * as assert from "assert";
import * as vscode from "vscode";

suite("Diagnostic events Test Suite", () => {
  test("opening multiple documents diagnoses each of them", async () => {
    const config = vscode.workspace.getConfiguration("latexlint");
    const previousRules = config.inspect("userDefinedRules")?.globalValue;
    const previousDisabled = config.inspect("disabledRules")?.globalValue;
    try {
      const extension = vscode.extensions.getExtension("hari64boli64.latexlint");
      assert.ok(extension, "The extension under test must be available");
      await extension.activate();
      await config.update("userDefinedRules", ["scheduler diagnostic marker"], vscode.ConfigurationTarget.Global);
      await config.update("disabledRules", [], vscode.ConfigurationTarget.Global);

      // Exercise the actual event handlers rather than a separate scheduling helper.
      const documents = await Promise.all(["latex", "markdown"].map(language =>
        vscode.workspace.openTextDocument({ language, content: "scheduler diagnostic marker" })
      ));
      const hasDiagnostic = (doc: vscode.TextDocument) =>
        vscode.languages.getDiagnostics(doc.uri).some(diagnostic =>
          (typeof diagnostic.code === "object" ? diagnostic.code.value : diagnostic.code) === "LLUserDefined"
        );
      const deadline = Date.now() + 10000;
      while (!documents.every(hasDiagnostic) && Date.now() < deadline)
        await new Promise(resolve => setTimeout(resolve, 50));
      for (const doc of documents)
        assert.ok(hasDiagnostic(doc), `Missing diagnosis for ${doc.uri.toString()}`);
    } finally {
      await config.update("userDefinedRules", previousRules, vscode.ConfigurationTarget.Global);
      await config.update("disabledRules", previousDisabled, vscode.ConfigurationTarget.Global);
    }
  });
});
