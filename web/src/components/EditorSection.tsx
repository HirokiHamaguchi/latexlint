import {
    Box,
    VStack
} from '@chakra-ui/react';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import { computeEditorHeight } from './editor/editorSizing';
import { LATEX_LANGUAGE_ID, latexMonarchTokensProvider } from './editor/latexMonarch';

type EditorSectionProps = {
    text: string;
    diagnostics: Monaco.editor.IMarkerData[];
    onTextChange: (text: string) => void;
    onEditorReady: () => void;
    onOpenAboutWithHash: (hash: string) => void;
    onEditorRef: (ref: { current: Monaco.editor.IStandaloneCodeEditor | null }) => void;
    onEditorHeightChange?: (height: number) => void;
};

export function EditorSection(props: EditorSectionProps) {
    const value = props.text;
    const diagnostics = props.diagnostics;
    const onChange = props.onTextChange;
    const onEditorReady = props.onEditorReady;
    const onOpenAboutWithHash = props.onOpenAboutWithHash;
    const onEditorRef = props.onEditorRef;
    const onHeightChange = props.onEditorHeightChange;

    const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof Monaco | null>(null);
    const [height, setHeight] = useState<number>(200);

    const updateHeight = () => {
        const editor = editorRef.current;
        if (!editor) return;

        const clampedHeight = computeEditorHeight(editor);
        setHeight(clampedHeight);
        onHeightChange?.(clampedHeight);
    };

    const handleEditorDidMount: OnMount = (editor, monaco: typeof Monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        monaco.languages.register({ id: LATEX_LANGUAGE_ID });
        monaco.languages.setMonarchTokensProvider(LATEX_LANGUAGE_ID, latexMonarchTokensProvider);

        monaco.editor.registerLinkOpener({
            open: (resource) => {
                const url = resource.toString();
                const hashMatch = url.match(/#(.+)$/);
                if (hashMatch && url.includes(window.location.origin)) {
                    const hash = decodeURIComponent(hashMatch[1]);
                    if (hash.startsWith('/')) return false;
                    onOpenAboutWithHash(hash);
                    return true; // prevent default behavior
                }
                return false;
            }
        });

        editor.onDidContentSizeChange(updateHeight);
        updateHeight();
        onEditorReady();
        onEditorRef({ current: editor });
    };

    // Update markers when diagnostics change
    useEffect(() => {
        if (!editorRef.current || !monacoRef.current) return;

        const model = editorRef.current.getModel();
        if (!model) return;

        const monaco = monacoRef.current;

        // Set markers on the model directly (diagnostics are already IMarkerData)
        monaco.editor.setModelMarkers(model, 'latexlint', diagnostics);

        return () => {
            // Clean up markers when component unmounts
            if (model && !model.isDisposed()) {
                monaco.editor.setModelMarkers(model, 'latexlint', []);
            }
        };
    }, [diagnostics]);

    return (
        <Box as="section" aria-label="LaTeX Linting Interface">
            <VStack align="stretch" gap={4}>
                <Box
                    height={`${height}px`}
                    borderWidth="1px"
                    borderColor="gray.300"
                    _focusWithin={{
                        borderColor: "blue.400",
                        boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.2)"
                    }}
                >
                    <Editor
                        language={LATEX_LANGUAGE_ID}
                        value={value}
                        onChange={(value) => { onChange(value || ''); }}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                            lineNumbers: 'on',
                            automaticLayout: true,
                            wordWrap: 'on',
                            tabSize: 2,
                        }}
                    />
                </Box>
            </VStack>
        </Box>
    );
}
