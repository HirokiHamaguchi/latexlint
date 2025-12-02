import {
    Box,
    Heading,
    Text,
    VStack,
    Link,
} from '@chakra-ui/react';
import type * as Monaco from 'monaco-editor';
import { MonacoLatexEditor } from './MonacoLatexEditor';
import { DocType, LintingState } from '../types';

interface EditorSectionProps {
    docType: DocType;
    text: string;
    diagnostics: Monaco.editor.IMarkerData[];
    lintingState: LintingState;
    onTextChange: (text: string) => void;
    onEditorReady: () => void;
    onOpenAboutWithHash: (hash: string) => void;
    onOpenAbout: () => void;
}

export function EditorSection({
    docType,
    text,
    diagnostics,
    lintingState,
    onTextChange,
    onEditorReady,
    onOpenAboutWithHash,
    onOpenAbout,
}: EditorSectionProps) {
    const getDiagnosticsSummary = () => {
        if (lintingState === 'idle') {
            return {
                base: "ℹ️ Linting not started",
                message: "",
                color: "gray.600",
                clickable: false
            };
        }

        if (lintingState === 'linting') {
            return {
                base: "🔄 Checking...",
                message: "(LaTeX Lint is analyzing your code...)",
                color: "blue.600",
                clickable: false
            };
        }

        if (diagnostics.length === 0) {
            return {
                base: "✅ No issues found!",
                message: "(Errors and warnings will appear inline if any.)",
                color: "green.600",
                clickable: false
            };
        }

        const errorCount = diagnostics.filter(d => d.severity === 8).length;
        const warningCount = diagnostics.filter(d => d.severity === 4).length;
        const infoCount = diagnostics.filter(d => d.severity === 2 || d.severity === 1).length;

        const parts = [];
        if (errorCount > 0) parts.push(`❌ ${errorCount} error${errorCount > 1 ? 's' : ''}`);
        if (warningCount > 0) parts.push(`⚠️ ${warningCount} warning${warningCount > 1 ? 's' : ''}`);
        if (infoCount > 0) parts.push(`ℹ️ ${infoCount} info`);

        return {
            base: parts.join(', '),
            message: "(Rule details)",
            color: errorCount > 0 ? "red.600" : warningCount > 0 ? "orange.600" : "blue.600",
            clickable: true
        };
    };

    const summary = getDiagnosticsSummary();

    return (
        <Box as="section" aria-label="LaTeX Linting Interface">
            <VStack align="stretch" gap={4}>
                <Heading as="h2" size="md" color="gray.700">
                    {docType === 'latex' ? 'LaTeX' : 'Markdown'} Editor
                </Heading>
                <Text fontSize="sm" fontWeight="medium">
                    <Text as="span" color={summary.color}>{summary.base}</Text>{' '}
                    {summary.clickable ? (
                        <Link
                            color="blue.500"
                            textDecoration="underline"
                            cursor="pointer"
                            onClick={onOpenAbout}
                            _hover={{ color: 'blue.600' }}
                        >
                            {summary.message}
                        </Link>
                    ) : (
                        <Text as="span" color="gray.600">{summary.message}</Text>
                    )}
                </Text>
                <MonacoLatexEditor
                    value={text}
                    diagnostics={diagnostics}
                    onChange={onTextChange}
                    onEditorReady={onEditorReady}
                    onOpenAboutWithHash={onOpenAboutWithHash}
                />
            </VStack>
        </Box>
    );
}