import {
    Box,
    HStack,
    Text,
    VStack,
} from '@chakra-ui/react';
import type * as Monaco from 'monaco-editor';
import { DocType, LintingState } from '../types';
import { MonacoLatexEditor } from './MonacoLatexEditor';

type EditorSectionProps = {
    docType: DocType;
    text: string;
    diagnostics: Monaco.editor.IMarkerData[];
    lintingState: LintingState;
    onTextChange: (text: string) => void;
    onEditorReady: () => void;
    onOpenAboutWithHash: (hash: string) => void;
};

export function EditorSection(props: EditorSectionProps) {
    return (
        <Box as="section" aria-label="LaTeX Linting Interface">
            <VStack align="stretch" gap={4}>
                <HStack color="gray.700">
                    <Text as="span" fontWeight="medium">
                        {props.docType === 'latex' ? 'LaTeX' : 'Markdown'} Editor
                    </Text>
                    <Text as="span" color="blue.600">
                        {(() => {
                            if (props.lintingState === 'idle') return 'ℹ️ Not Started';
                            if (props.lintingState === 'linting') return '🔄 Analyzing...';
                            return '';
                        })()}
                    </Text>
                </HStack>
                <MonacoLatexEditor
                    value={props.text}
                    diagnostics={props.diagnostics}
                    onChange={props.onTextChange}
                    onEditorReady={props.onEditorReady}
                    onOpenAboutWithHash={props.onOpenAboutWithHash}
                />
            </VStack>
        </Box>
    );
}