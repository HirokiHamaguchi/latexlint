import { useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';

interface MonacoLatexEditorProps {
    value: string;
    diagnostics: Monaco.editor.IMarkerData[];
    onChange: (value: string) => void;
    onEditorReady: () => void;
    onOpenAboutWithHash: (hash: string) => void;
}

export function MonacoLatexEditor({ value, diagnostics, onChange, onEditorReady, onOpenAboutWithHash }: MonacoLatexEditorProps) {
    const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof Monaco | null>(null);

    const handleEditorDidMount: OnMount = (editor, monaco: typeof Monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        // Register LaTeX language if not already registered
        if (!monaco.languages.getLanguages().some(lang => lang.id === 'latex')) {
            monaco.languages.register({ id: 'latex' });

            // Basic LaTeX syntax highlighting
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
        }

        // Configure editor options
        editor.updateOptions({
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
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

        onEditorReady();
    };

    const handleEditorChange = (value: string | undefined) => {
        onChange(value || '');
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

    const minHeight = "80svh";

    return (
        <Box
            height={minHeight}
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
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                }}
            />
        </Box>
    );
}