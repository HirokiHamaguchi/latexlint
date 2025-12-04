import {
    Box,
    VStack
} from '@chakra-ui/react';
import type * as Monaco from 'monaco-editor';
import { LintingState } from '../types';
import { MonacoLatexEditor } from './MonacoLatexEditor';

type EditorSectionProps = {
    text: string;
    diagnostics: Monaco.editor.IMarkerData[];
    lintingState: LintingState;
    onTextChange: (text: string) => void;
    onEditorReady: () => void;
    onOpenAboutWithHash: (hash: string) => void;
    onEditorRef: (ref: { current: Monaco.editor.IStandaloneCodeEditor | null }) => void;
};

export function EditorSection(props: EditorSectionProps) {
    return (
        <Box as="section" aria-label="LaTeX Linting Interface">
            <VStack align="stretch" gap={4}>
                <MonacoLatexEditor
                    value={props.text}
                    diagnostics={props.diagnostics}
                    onChange={props.onTextChange}
                    onEditorReady={props.onEditorReady}
                    onOpenAboutWithHash={props.onOpenAboutWithHash}
                    onEditorRef={props.onEditorRef}
                />
            </VStack>
        </Box>
    );
}