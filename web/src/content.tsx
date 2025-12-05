import { Container, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import type * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import sampleMdBefore from '../sample/sample_before.md?raw';
import sampleTexBefore from '../sample/sample_before.tex?raw';
import { AboutModal, ConfigurationSection, EditorSection, Header } from './components';
import { DiagnosticsSection } from './components/DiagnosticsSection';
import { useConfig, useLinting } from './hooks';
import { DocType, LintingState } from './types';
import { preloadTextLintDictionary } from './utils';

const samples: Record<DocType, string> = {
    latex: sampleTexBefore,
    markdown: sampleMdBefore,
};

const getStatusMessage = (state: LintingState) => {
    switch (state) {
        case 'idle': return 'ℹ️ Not Started';
        case 'linting': return '🔄 Analyzing...';
        default: return '';
    }
};

export function Content() {
    const [docType, setDocType] = useState<DocType>('latex');
    const [text, setText] = useState(sampleTexBefore);
    const [modals, setModals] = useState({ about: { isOpen: false, tab: 'overview', hash: '' }, config: { isOpen: false } });
    const [isEditorReady, setIsEditorReady] = useState(false);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const { lintingState, diagnostics, runLint, runLintWithDelay } = useLinting();
    const { config, updateConfig } = useConfig();

    const handleTextChange = (newText: string) => {
        setText(newText);
        runLintWithDelay(newText, docType);
    };

    const handleDocTypeChange = (newType: DocType) => {
        setDocType(newType);
        const shouldSwitchSample = text === samples[docType === 'latex' ? 'latex' : 'markdown'];
        const textToLint = shouldSwitchSample ? samples[newType] : text;
        if (shouldSwitchSample) setText(textToLint);
        runLint(textToLint, newType, true);
    };

    const handleAboutClick = () => setModals(prev => ({ ...prev, about: { ...prev.about, isOpen: true } }));

    const handleAboutClose = () => {
        setModals(prev => ({ ...prev, about: { ...prev.about, isOpen: false, hash: '' } }));
    };

    const handleOpenAboutWithHash = (hash: string) => {
        setModals(prev => ({ ...prev, about: { isOpen: true, tab: 'readme', hash } }));
    };

    const handleDiagnosticClick = (lineNumber: number, column: number) => {
        if (!editorRef.current) {
            console.warn("Editor is not ready yet");
            return;
        }
        editorRef.current.setPosition({ lineNumber, column });
        editorRef.current.focus();
        editorRef.current.revealLineInCenter(lineNumber);
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
                    isOpen={modals.config.isOpen}
                    onToggle={(isOpen) => setModals(prev => ({ ...prev, config: { isOpen } }))}
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
                        {getStatusMessage(lintingState)}
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
                        onEditorRef={(ref) => { editorRef.current = ref.current; }}
                    />

                    <DiagnosticsSection
                        diagnostics={diagnostics}
                        onOpenAboutWithHash={handleOpenAboutWithHash}
                        onDiagnosticClick={handleDiagnosticClick}
                    />
                </SimpleGrid>
            </VStack>

            <AboutModal
                isOpen={modals.about.isOpen}
                onClose={handleAboutClose}
                tab={modals.about.tab}
                readmeLink={modals.about.hash}
                onTabChange={(tab) => setModals(prev => ({ ...prev, about: { ...prev.about, tab } }))}
            />
        </Container>
    );
}

