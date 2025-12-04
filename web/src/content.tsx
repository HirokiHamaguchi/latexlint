import { Container, SimpleGrid, VStack } from '@chakra-ui/react';
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

                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                    <EditorSection
                        docType={docType}
                        text={text}
                        diagnostics={diagnostics}
                        lintingState={lintingState}
                        onTextChange={handleTextChange}
                        onEditorReady={() => setIsEditorReady(true)}
                        onOpenAboutWithHash={handleOpenAboutWithHash}
                    />

                    <DiagnosticsSection
                        diagnostics={diagnostics}
                        onOpenAboutWithHash={handleOpenAboutWithHash}
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

