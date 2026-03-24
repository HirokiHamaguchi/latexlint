import { Box, Button, Container, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import type * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sampleMdBefore from '../sample/sample_before.md?raw';
import sampleTexBefore from '../sample/sample_before.tex?raw';
import { ConfigurationSection, EditorSection, Footer, TopNavHeader } from './components';
import { DiagnosticsSection } from './components/DiagnosticsSection';
import { useConfig, useLinting } from './hooks';
import { DocType, LintingState } from './types';
import { preloadTextLintDictionary } from './utils';

import {
    Grid,
    Heading,
    Image,
    Link
} from '@chakra-ui/react';


const samples: Record<DocType, string> = {
    latex: sampleTexBefore,
    markdown: sampleMdBefore,
};

const BASE_URL = import.meta.env.BASE_URL;

const getStatusMessage = (state: LintingState) => {
    switch (state) {
        case 'idle': return 'ℹ️ Not Started';
        case 'linting': return '🔄 Analyzing...';
        default: return '✅ Linted';
    }
};

const SampleImage = ({ src, alt, color }: { src: string; alt: string; color: string }) => (
    <VStack>
        <Heading size="sm" color={color}>{alt}</Heading>
        <Image
            src={`${BASE_URL}${src}`}
            alt={alt}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
            maxW="100%"
            h="auto"
        />
    </VStack>
);


export function Content() {
    const [docType, setDocType] = useState<DocType>('latex');
    const [text, setText] = useState(sampleTexBefore);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
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
        const shouldSwitchSample = text === samples[docType === 'latex' ? 'latex' : 'markdown'];
        const textToLint = shouldSwitchSample ? samples[newType] : text;
        if (shouldSwitchSample) setText(textToLint);
        runLint(textToLint, newType, true);
    };

    const handleOpenAboutWithHash = (hash: string) => {
        const path = hash ? `/readme/${encodeURIComponent(hash)}` : '/readme';
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
        if (isEditorReady) runLint(sampleTexBefore, 'latex', false);
    }, [isEditorReady, runLint]);

    return (
        <>
            <TopNavHeader />

            <Container maxW="container.xl" py={8} as="main">
                <VStack justify="center" align="center" mb={4}>
                    <Link href={import.meta.env.BASE_URL} _hover={{ textDecoration: 'none' }}>
                        <HStack align="center">
                            <Image
                                src="lintIconLight_copied.svg"
                                alt="LaTeX Lint Icon"
                                boxSize="2.5em"
                                mr={2}
                            />
                            <Heading as="h1" size="3xl" color="#333333" _hover={{ color: 'blue.600' }} transition="color 0.2s">
                                <Text fontFamily="Times New Roman, serif">LaTeX Lint</Text>
                            </Heading>
                        </HStack>
                    </Link>
                    <Text fontSize="lg" color="gray.500">
                        Online LaTeX Code Checker
                    </Text>
                </VStack>
                <VStack gap={4} align="stretch">
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

                        <Box
                            borderWidth="1px"
                            borderColor="gray.200"
                            borderRadius="full"
                            bg="white"
                            p={1}
                            flexShrink={0}
                            ml="auto"
                        >
                            <HStack gap={1}>
                                <Button
                                    size="sm"
                                    borderRadius="full"
                                    variant={docType === 'latex' ? 'solid' : 'ghost'}
                                    colorPalette={docType === 'latex' ? 'blue' : 'gray'}
                                    onClick={() => handleDocTypeChange('latex')}
                                >
                                    LaTeX
                                </Button>
                                <Button
                                    size="sm"
                                    borderRadius="full"
                                    variant={docType === 'markdown' ? 'solid' : 'ghost'}
                                    colorPalette={docType === 'markdown' ? 'blue' : 'gray'}
                                    onClick={() => handleDocTypeChange('markdown')}
                                >
                                    Markdown
                                </Button>
                            </HStack>
                        </Box>
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

                    <VStack align="stretch">
                        <Heading size="xl">Sample</Heading>
                        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                            <SampleImage src="sample_before.png" alt="Before" color="red.600" />
                            <SampleImage src="sample_after.png" alt="After" color="green.600" />
                        </Grid>
                    </VStack>

                    <ConfigurationSection
                        isOpen={isConfigOpen}
                        onToggle={setIsConfigOpen}
                        config={config}
                        onConfigChange={updateConfig}
                        onRunLint={runLint}
                        text={text}
                        docType={docType}
                        onOpenAboutWithHash={handleOpenAboutWithHash}
                    />
                </VStack>

                <Footer />
            </Container>
        </>
    );
}
