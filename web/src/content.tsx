import { Container, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import type * as monaco from 'monaco-editor';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import sampleMdBefore from '../sample/sample_before.md?raw';
import sampleTexBefore from '../sample/sample_before.tex?raw';
import { AboutModal, ConfigurationSection, EditorSection, Header } from './components';
import { DiagnosticsSection } from './components/DiagnosticsSection';
import { type LintConfig, defaultConfig, setConfig } from './config';
import { useLinting } from './hooks';
import { DocType } from './types';
import { preloadTextLintDictionary } from './utils';

const samples: Record<DocType, string> = {
    latex: sampleTexBefore,
    markdown: sampleMdBefore,
};

export function Content() {
    const [docType, setDocType] = useState<DocType>('latex');
    const [text, setText] = useState(sampleTexBefore);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [aboutTab, setAboutTab] = useState<string>('overview');
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [config, setConfigState] = useState<LintConfig>(defaultConfig);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [editorRef, setEditorRef] = useState<{ current: monaco.editor.IStandaloneCodeEditor | null } | null>(null);

    const { lintingState, diagnostics, runLint, runLintWithDelay } = useLinting();

    const updateConfig = (newConfig: LintConfig) => {
        setConfigState(newConfig);
        setConfig(newConfig);
    };

    const handleTextChange = (newText: string) => {
        setText(newText);
        runLintWithDelay(newText, docType);
    };

    const handleDocTypeChange = (newType: DocType) => {
        setDocType(newType);
        let textToLint = text;
        if (text === samples.latex && newType === 'markdown') {
            textToLint = samples.markdown;
            setText(textToLint);
        } else if (text === samples.markdown && newType === 'latex') {
            textToLint = samples.latex;
            setText(textToLint);
        }
        runLint(textToLint, newType, true);
    };

    const handleAboutClick = () => {
        setIsAboutOpen(true);
    };

    const handleAboutClose = () => {
        setIsAboutOpen(false);
        if (window.location.hash) window.location.hash = '';
    };

    const handleOpenAboutWithHash = (hash: string) => {
        flushSync(() => {
            setAboutTab('readme');
            setIsAboutOpen(true);
        });
        flushSync(() => {
            window.location.hash = hash;
        });
    };

    const handleDiagnosticClick = (lineNumber: number, column: number) => {
        if (editorRef?.current) {
            editorRef.current.setPosition({ lineNumber, column });
            editorRef.current.focus();
            editorRef.current.revealLineInCenter(lineNumber);
        }
    };

    useEffect(() => {
        preloadTextLintDictionary();
    }, []);

    useEffect(() => {
        if (isEditorReady) runLint(sampleTexBefore, 'latex', false);
    }, [isEditorReady, runLint]);

    return (
        <Container maxW="container.xl" py={8} as="main">
            <VStack gap={4} align="stretch">
                <Header
                    docType={docType}
                    onDocTypeChange={handleDocTypeChange}
                    onAboutClick={handleAboutClick}
                />

                <ConfigurationSection
                    isOpen={isConfigOpen}
                    onToggle={setIsConfigOpen}
                    config={config}
                    onConfigChange={updateConfig}
                    onRunLint={runLint}
                    text={text}
                    docType={docType}
                />

                <HStack color="gray.700">
                    <Text as="span" fontWeight="medium">
                        {docType === 'latex' ? 'LaTeX' : 'Markdown'} Editor
                    </Text>
                    <Text as="span" color="blue.600">
                        {(() => {
                            if (lintingState === 'idle') return 'ℹ️ Not Started';
                            if (lintingState === 'linting') return '🔄 Analyzing...';
                            return '';
                        })()}
                    </Text>
                </HStack>

                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                    <EditorSection
                        text={text}
                        diagnostics={diagnostics}
                        lintingState={lintingState}
                        onTextChange={handleTextChange}
                        onEditorReady={() => setIsEditorReady(true)}
                        onOpenAboutWithHash={handleOpenAboutWithHash}
                        onEditorRef={setEditorRef}
                    />

                    <DiagnosticsSection
                        diagnostics={diagnostics}
                        onOpenAboutWithHash={handleOpenAboutWithHash}
                        onDiagnosticClick={handleDiagnosticClick}
                    />
                </SimpleGrid>
            </VStack>

            <AboutModal
                isOpen={isAboutOpen}
                onClose={handleAboutClose}
                tab={aboutTab}
                onTabChange={setAboutTab}
            />
        </Container>
    );
}

