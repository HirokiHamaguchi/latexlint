import type * as Monaco from 'monaco-editor';

export function computeEditorHeight(editor: Monaco.editor.IStandaloneCodeEditor): number {
    const contentHeight = editor.getContentHeight();
    const minHeight = window.innerHeight * 0.5;
    const maxHeight = window.innerHeight * 0.8;
    return Math.min(Math.max(contentHeight, minHeight), maxHeight);
}
