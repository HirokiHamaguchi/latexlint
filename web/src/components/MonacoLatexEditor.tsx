import { Box } from '@chakra-ui/react';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

interface MonacoLatexEditorProps {
    value: string;
    diagnostics: Monaco.editor.IMarkerData[];
    onChange: (value: string) => void;
    onEditorReady: () => void;
    onOpenAboutWithHash: (hash: string) => void;
    onEditorRef: (ref: { current: Monaco.editor.IStandaloneCodeEditor | null }) => void;
}

export function MonacoLatexEditor({ value, diagnostics, onChange, onEditorReady, onOpenAboutWithHash, onEditorRef }: MonacoLatexEditorProps) {
    const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof Monaco | null>(null);
    const [height, setHeight] = useState<number>(200);

    const updateHeight = () => {
        const editor = editorRef.current;
        if (!editor) return;

        const contentHeight = editor.getContentHeight();
        const min = window.innerHeight * 0.30;
        const max = window.innerHeight * 0.80;
        const clampedHeight = Math.min(Math.max(contentHeight, min), max);
        setHeight(clampedHeight);
    };

    const handleEditorDidMount: OnMount = (editor, monaco: typeof Monaco) => {
        editorRef.current = editor;
        console.log("mounted", editor);
        monacoRef.current = monaco;

        monaco.languages.register({ id: 'latex' });

        monaco.languages.setMonarchTokensProvider('latex', {
            tokenizer: {
                root: [
                    [/\\[a-zA-Z@]+/, 'keyword'],
                    [/\\[^a-zA-Z@]/, 'keyword'],
                    [/%.*$/, 'comment'],
                    [/\$\$/, 'string', '@display_math'],
                    [/\$/, 'string', '@inline_math'],
                    [/\\begin\{[^}]+\}/, 'keyword'],
                    [/\\end\{[^}]+\}/, 'keyword'],
                    [/\{/, 'delimiter.curly'],
                    [/\}/, 'delimiter.curly'],
                    [/\[/, 'delimiter.square'],
                    [/\]/, 'delimiter.square'],
                ],
                inline_math: [
                    [/[^$\\]+/, 'string'],
                    [/\$/, 'string', '@pop'],
                    [/\\[a-zA-Z@]+/, 'keyword'],
                    [/\\[^a-zA-Z@]/, 'keyword'],
                ],
                display_math: [
                    [/[^$\\]+/, 'string'],
                    [/\$\$/, 'string', '@pop'],
                    [/\\[a-zA-Z@]+/, 'keyword'],
                    [/\\[^a-zA-Z@]/, 'keyword'],
                ],
            },
        });

        monaco.editor.registerLinkOpener({
            open: (resource) => {
                const url = resource.toString();
                const hashMatch = url.match(/#(.+)$/);
                if (hashMatch && url.includes(window.location.origin)) {
                    onOpenAboutWithHash(hashMatch[1]);
                    return true; // Prevent default behavior
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
                language="latex"
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
    );
}