import { HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import type * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigurationSection, EditorSection } from './components';
import { DiagnosticsSection } from './components/DiagnosticsSection';
import { DocTypeSwitch } from './components/home/DocTypeSwitch';
import { MainHero } from './components/home/MainHero';
import { SampleSection } from './components/home/SampleSection';
import { PageLayout } from './components/layout/PageLayout';
import { ROUTES } from './constants/routes';
import { DEFAULT_DOC_TYPE, SAMPLES } from './constants/samples';
import { useConfig, useLinting } from './hooks';
import { DocType, LintingState } from './types';
import { preloadTextLintDictionary } from './utils';

const getStatusMessage = (state: LintingState) => {
    switch (state) {
        case 'idle': return 'ℹ️ Not Started';
        case 'linting': return '🔄 Analyzing...';
        default: return '✅ Linted';
    }
};

export function Content() {
    const [docType, setDocType] = useState<DocType>(DEFAULT_DOC_TYPE);
    const [text, setText] = useState(SAMPLES[DEFAULT_DOC_TYPE]);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [editorHeight, setEditorHeight] = useState<number | undefined>(undefined);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const navigate = useNavigate();

    const { lintingState, diagnostics, runLint, runLintWithDelay } = useLinting();
    const { config, updateConfig } = useConfig();
    const statusColor = lintingState === 'complete' ? 'green.600' : 'blue.600';

    const handleTextChange = (newText: string) => {
        setText(newText);
        runLintWithDelay(newText, docType);
    };

    const handleDocTypeChange = (newType: DocType) => {
        setDocType(newType);
        const shouldSwitchSample = text === SAMPLES[docType];
        const textToLint = shouldSwitchSample ? SAMPLES[newType] : text;
        if (shouldSwitchSample) setText(textToLint);
        runLint(textToLint, newType, true);
    };

    const handleOpenAboutWithHash = (hash: string) => {
        const path = hash ? `${ROUTES.README}/${encodeURIComponent(hash)}` : ROUTES.README;
        navigate(path);
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

    const handleDisableRule = (ruleId: string) => {
        if (!ruleId || config.disabledRules.includes(ruleId)) return;
        const updatedConfig = {
            ...config,
            disabledRules: [...config.disabledRules, ruleId],
        };
        updateConfig(updatedConfig);
        runLint(text, docType, true);
    };

    useEffect(() => {
        preloadTextLintDictionary();
    }, []);

    useEffect(() => {
        if (isEditorReady) runLint(SAMPLES[DEFAULT_DOC_TYPE], DEFAULT_DOC_TYPE, false);
    }, [isEditorReady, runLint]);

    return (
        <PageLayout>
            <MainHero />
            <VStack align="stretch">
                <VStack align="stretch">
                    <HStack
                        justify="flex-start"
                        align="center"
                        gap={3}
                        flexWrap="nowrap"
                        overflowX="auto"
                        whiteSpace="nowrap"
                        css={{ scrollbarWidth: 'thin' }}
                        w="full"
                    >
                        <HStack color="gray.700" gap={3} flexWrap="nowrap" flexShrink={0}>
                            <Text as="span" color={statusColor} fontWeight="medium">
                                {getStatusMessage(lintingState)}
                            </Text>
                        </HStack>

                        <DocTypeSwitch docType={docType} onChange={handleDocTypeChange} />
                    </HStack>

                    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                        <EditorSection
                            text={text}
                            diagnostics={diagnostics}
                            onTextChange={handleTextChange}
                            onEditorReady={() => setIsEditorReady(true)}
                            onOpenAboutWithHash={handleOpenAboutWithHash}
                            onEditorRef={(ref) => { editorRef.current = ref.current; }}
                            onEditorHeightChange={setEditorHeight}
                        />

                        <DiagnosticsSection
                            diagnostics={diagnostics}
                            onOpenAboutWithHash={handleOpenAboutWithHash}
                            onDiagnosticClick={handleDiagnosticClick}
                            onDisableRule={handleDisableRule}
                            height={editorHeight}
                        />
                    </SimpleGrid>
                </VStack>

                <SampleSection />

                <ConfigurationSection
                    config={config}
                    onConfigChange={updateConfig}
                    onRunLint={runLint}
                    text={text}
                    docType={docType}
                    onOpenAboutWithHash={handleOpenAboutWithHash}
                />
            </VStack>
        </PageLayout >
    );
}
