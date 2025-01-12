import * as vscode from "vscode";
import { LLCode } from "./constants";

export function getCodeWithURI(code: LLCode) {
    return {
        value: code,
        target: vscode.Uri.parse(`https://github.com/hari64boli64/latexlint?tab=readme-ov-file#${code.toLowerCase()}`),
    };
}