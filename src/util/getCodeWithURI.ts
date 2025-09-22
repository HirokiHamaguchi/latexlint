import * as vscode from "vscode";
import { LLCode } from "./constants";

export function getCodeWithURI(code: LLCode) {
    return {
        value: code,
        target: vscode.Uri.parse(`https://github.com/HirokiHamaguchi/latexlint?tab=readme-ov-file#${code.toLowerCase()}`),
    };
}