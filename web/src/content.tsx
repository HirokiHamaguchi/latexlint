import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Link,
    Image,
    Button,
    SegmentGroup,
    Input,
    Collapsible,
    SimpleGrid,
    Checkbox,
} from '@chakra-ui/react';
import { lintLatex, preloadTextLintDictionary } from './latex-linter';
import { type LintConfig, defaultConfig, setConfig, configMetadata } from './config';
import type * as Monaco from 'monaco-editor';
import sampleMdBefore from '../sample/sample_before.md?raw';
import sampleTexBefore from '../sample/sample_before.tex?raw';
import { MonacoLatexEditor } from './MonacoLatexEditor';
import { AboutModal } from './AboutModal';
import { LuChevronRight } from "react-icons/lu";

type DocType = 'latex' | 'markdown';
type LintingState = 'idle' | 'linting' | 'complete';

const samples: Record<DocType, string> = {
    latex: sampleTexBefore,
    markdown: sampleMdBefore,
};


export function Content() {
    const [docType, setDocType] = useState<DocType>('latex');
    const [text, setText] = useState(sampleTexBefore);
    const [diagnostics, setDiagnostics] = useState<Monaco.editor.IMarkerData[]>([]);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [aboutDefaultTab, setAboutDefaultTab] = useState<string>('overview');
    const [lintingState, setLintingState] = useState<LintingState>('idle');
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [config, setConfigState] = useState<LintConfig>(defaultConfig);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const updateConfig = (newConfig: LintConfig) => {
        setConfigState(newConfig);
        setConfig(newConfig);
    };

    const runLint = async (inputText: string, type: DocType, forceTextLint: boolean) => {
        if (!inputText.trim()) {
            setDiagnostics([]);
            setLintingState('complete');
            return;
        }

        setLintingState('linting');
        setTimeout(async () => {
            try {
                const results = await lintLatex(inputText, type, forceTextLint);
                setDiagnostics(results);
            } catch (error) {
                console.error('Linting error:', error);
                setDiagnostics([]);
            } finally {
                setLintingState('complete');
            }
        }, 100);
    };

    const handleTextChange = (newText: string) => {
        setText(newText);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            runLint(newText, docType, true);
        }, 500);
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

    useEffect(() => {
        preloadTextLintDictionary();
    }, []);

    useEffect(() => {
        if (isEditorReady) {
            runLint(sampleTexBefore, 'latex', false);
        }
    }, [isEditorReady]);

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
        <Container maxW="container.xl" py={8} as="main">
            <VStack gap={4} align="stretch">
                <Box textAlign="center" as="header">
                    <HStack justify="center" align="center" mb={4}>
                        <Link href={import.meta.env.BASE_URL} _hover={{ textDecoration: 'none' }}>
                            <HStack align="center">
                                <Image
                                    src="https://github.com/HirokiHamaguchi/latexlint/blob/master/images/lintIconLight.svg?raw=true"
                                    alt="LaTeX Lint Icon"
                                    boxSize="1.8em"
                                    mr={2}
                                />
                                <Heading as="h1" size="2xl" color="gray.700" _hover={{ color: 'blue.600' }} transition="color 0.2s">
                                    LaTeX Lint - Online LaTeX Code Checker
                                </Heading>
                            </HStack>
                        </Link>
                    </HStack>


                    <HStack justify="center" gap={6} flexWrap="wrap" fontSize="sm" as="nav" aria-label="Main navigation">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAboutOpen(true)}
                        >
                            <HStack align="center" gap={1}>
                                <Text>About</Text>
                            </HStack>
                        </Button>
                        <SegmentGroup.Root
                            value={docType}
                            onValueChange={(e) => handleDocTypeChange(e.value as DocType)}
                            size="sm"
                        >
                            <SegmentGroup.Indicator />
                            <SegmentGroup.Item value="latex">
                                <SegmentGroup.ItemText>LaTeX</SegmentGroup.ItemText>
                                <SegmentGroup.ItemHiddenInput />
                            </SegmentGroup.Item>
                            <SegmentGroup.Item value="markdown">
                                <SegmentGroup.ItemText>Markdown</SegmentGroup.ItemText>
                                <SegmentGroup.ItemHiddenInput />
                            </SegmentGroup.Item>
                        </SegmentGroup.Root>
                    </HStack>
                </Box>

                <Box as="section" aria-label="Configuration">
                    <Collapsible.Root open={isConfigOpen} onOpenChange={(e) => setIsConfigOpen(e.open)}>
                        <Collapsible.Trigger
                            display="flex"
                            gap="2"
                            alignItems="center"
                        >
                            <Collapsible.Indicator
                                transition="transform 0.2s"
                                _open={{ transform: "rotate(90deg)" }}
                            >
                                <LuChevronRight />
                            </Collapsible.Indicator>
                            Setting
                        </Collapsible.Trigger>
                        <Collapsible.Content>
                            <Box mt={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                                <VStack align="stretch" gap={4}>
                                    {(Object.keys(config) as Array<keyof LintConfig>).map((key) => {
                                        const metadata = configMetadata[key];
                                        const hasEnum = metadata.items?.enum;

                                        return (
                                            <Box key={key}>
                                                <Text fontWeight="bold" mb={2}>
                                                    {metadata.description}
                                                </Text>
                                                {hasEnum ? (
                                                    // Checkbox UI for enum fields
                                                    <Box>
                                                        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={2}>
                                                            {metadata.items!.enum.map((option) => (
                                                                <Checkbox.Root
                                                                    key={option}
                                                                    checked={config[key].includes(option)}
                                                                    onCheckedChange={(details) => {
                                                                        const newValue = details.checked === true
                                                                            ? [...config[key], option]
                                                                            : config[key].filter((v) => v !== option);
                                                                        updateConfig({ ...config, [key]: newValue });
                                                                        runLint(text, docType, true);
                                                                    }}
                                                                >
                                                                    <Checkbox.HiddenInput />
                                                                    <Checkbox.Control />
                                                                    <Checkbox.Label>{option}</Checkbox.Label>
                                                                </Checkbox.Root>
                                                            ))}
                                                        </SimpleGrid>
                                                    </Box>
                                                ) : (
                                                    // Input for non-enum fields
                                                    <Input
                                                        id={`config-input-${key}`}
                                                        value={config[key].join(', ')}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                                .split(',')
                                                                .map((s) => s.trim())
                                                                .filter((s) => s);
                                                            updateConfig({ ...config, [key]: value });
                                                            runLint(text, docType, true);
                                                        }}
                                                        placeholder="word1, word2, word3"
                                                        size="sm"
                                                    />
                                                )}
                                            </Box>
                                        );
                                    })}
                                </VStack>
                            </Box>
                        </Collapsible.Content>
                    </Collapsible.Root>
                </Box>

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
                                    onClick={() => {
                                        setAboutDefaultTab('readme');
                                        setIsAboutOpen(true);
                                    }}
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
                            onChange={handleTextChange}
                            onEditorReady={() => setIsEditorReady(true)}
                            onOpenAboutWithHash={(hash) => {
                                setAboutDefaultTab('readme');
                                setIsAboutOpen(true);
                                // Trigger scroll after modal opens
                                setTimeout(() => {
                                    window.location.hash = hash;
                                }, 100);
                            }}
                        />
                    </VStack>
                </Box>
            </VStack>

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} defaultTab={aboutDefaultTab} />
        </Container>
    );
}

