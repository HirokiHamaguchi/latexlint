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
} from '@chakra-ui/react';
import { lintLatex } from './latex-linter';
import type * as Monaco from 'monaco-editor';
import sampleMdBefore from '../sample/sample_before.md?raw';
import sampleTexBefore from '../sample/sample_before.tex?raw';
import { MonacoLatexEditor } from './MonacoLatexEditor';
import { AboutModal } from './AboutModal';

type DocType = 'latex' | 'markdown';
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
    const [isLinting, setIsLinting] = useState(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const runLint = async (inputText: string, type: DocType) => {
        if (!inputText.trim()) {
            setDiagnostics([]);
            setIsLinting(false);
            return;
        }

        setIsLinting(true);
        setTimeout(async () => {
            try {
                const results = await lintLatex(inputText, type);
                setDiagnostics(results);
            } catch (error) {
                console.error('Linting error:', error);
                setDiagnostics([]);
            } finally {
                setIsLinting(false);
            }
        }, 100);
    };

    const handleTextChange = (newText: string) => {
        setText(newText);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            runLint(newText, docType);
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
        runLint(textToLint, newType);
    };

    useEffect(() => {
        runLint(sampleTexBefore, 'latex');
    }, []);

    const getDiagnosticsSummary = () => {
        if (isLinting) {
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
            <VStack gap={8} align="stretch">
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
                            onChange={handleTextChange}
                            diagnostics={diagnostics}
                        />
                    </VStack>
                </Box>
            </VStack>

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} defaultTab={aboutDefaultTab} />
        </Container>
    );
}

