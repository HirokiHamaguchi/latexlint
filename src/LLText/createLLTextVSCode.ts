import * as vscode from 'vscode';

import { TextDocument } from 'vscode';
import createLLText from './createLLText';

export default function createLLTextVSCode(doc: TextDocument) {
    const diagnostics: vscode.Diagnostic[] = [];
    const txt = createLLText(doc.getText(), doc.languageId, diagnostics, doc.positionAt);
    const ret: [typeof txt, typeof diagnostics] = [txt, diagnostics];
    return ret;
}
