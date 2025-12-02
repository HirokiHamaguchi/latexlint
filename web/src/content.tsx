import { useState, useEffect } from 'react';
import {
    Container,
    VStack,
} from '@chakra-ui/react';
import { preloadTextLintDictionary } from './utils';
import { type LintConfig, defaultConfig, setConfig } from './config';
import sampleMdBefore from '../sample/sample_before.md?raw';
import sampleTexBefore from '../sample/sample_before.tex?raw';
import { Header, ConfigurationSection, EditorSection, AboutModal } from './components';
import { useLinting } from './hooks';
import { DocType } from './types';

const samples: Record<DocType, string> = {
    latex: sampleTexBefore,
    markdown: sampleMdBefore,
};

export function Content() {
    const [docType, setDocType] = useState<DocType>('latex');
    const [text, setText] = useState(sampleTexBefore);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [aboutDefaultTab, setAboutDefaultTab] = useState<string>('overview');
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

    const handleOpenAboutWithHash = (hash: string) => {
        setAboutDefaultTab('readme');
        setIsAboutOpen(true);
        // Trigger scroll after modal opens
        setTimeout(() => {
            window.location.hash = hash;
        }, 100);
    };

    const handleOpenAboutForRuleDetails = () => {
        setAboutDefaultTab('readme');
        setIsAboutOpen(true);
    };

    useEffect(() => {
        preloadTextLintDictionary();
    }, []);

    useEffect(() => {
        if (isEditorReady) {
            runLint(sampleTexBefore, 'latex', false);
        }
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

                <EditorSection
                    docType={docType}
                    text={text}
                    diagnostics={diagnostics}
                    lintingState={lintingState}
                    onTextChange={handleTextChange}
                    onEditorReady={() => setIsEditorReady(true)}
                    onOpenAboutWithHash={handleOpenAboutWithHash}
                    onOpenAbout={handleOpenAboutForRuleDetails}
                />
            </VStack>

            <AboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
                defaultTab={aboutDefaultTab}
            />
        </Container>
    );
}

