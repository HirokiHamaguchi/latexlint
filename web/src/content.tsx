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
    Dialog,
    Grid,
} from '@chakra-ui/react';
import { lintLatex } from './latex-linter';
import type * as Monaco from 'monaco-editor';
import sampleText from '../sample/sample_before.tex?raw';
import { MonacoLatexEditor } from './MonacoLatexEditor';

export function Content() {
    const [text, setText] = useState(sampleText);
    const [diagnostics, setDiagnostics] = useState<Monaco.editor.IMarkerData[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const runLint = (inputText: string) => {
        if (!inputText.trim()) {
            setDiagnostics([]);
            return;
        }

        setTimeout(() => {
            try {
                const results = lintLatex(inputText);
                setDiagnostics(results);
            } catch (error) {
                console.error('Linting error:', error);
                setDiagnostics([]);
            }
        }, 100);
    };

    const handleTextChange = (newText: string) => {
        setText(newText);
        // Clear existing timeout
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // Set new timeout for linting
        timeoutRef.current = setTimeout(() => {
            runLint(newText);
        }, 500); // 500ms delay
    };

    // Run lint on initial load
    useEffect(() => {
        runLint(sampleText);
        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []); // Run once on mount with sampleText

    const getDiagnosticsSummary = () => {
        if (diagnostics.length === 0) {
            return {
                base: "✅ No issues found!",
                message: "(Type your LaTeX code below. Errors and warnings will appear inline.)",
                color: "green.600"
            };
        }

        // Monaco MarkerSeverity: Hint=1, Info=2, Warning=4, Error=8
        const errorCount = diagnostics.filter(d => d.severity === 8).length;
        const warningCount = diagnostics.filter(d => d.severity === 4).length;
        const infoCount = diagnostics.filter(d => d.severity === 2 || d.severity === 1).length;

        const parts = [];
        if (errorCount > 0) parts.push(`❌ ${errorCount} error${errorCount > 1 ? 's' : ''}`);
        if (warningCount > 0) parts.push(`⚠️ ${warningCount} warning${warningCount > 1 ? 's' : ''}`);
        if (infoCount > 0) parts.push(`ℹ️ ${infoCount} info`);

        return {
            base: parts.join(', '),
            message: "(Refer to GitHub or VS Code Extension for details.)",
            color: errorCount > 0 ? "red.600" : warningCount > 0 ? "orange.600" : "blue.600"
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
                                    LaTeX Lint - Online LaTeX Linter
                                </Heading>
                            </HStack>
                        </Link>
                    </HStack>
                    <Text fontSize="lg" color="gray.600" mb={4}>
                        Check your LaTeX code for common issues and style problems
                    </Text>
                    <HStack justify="center" gap={6} flexWrap="wrap" fontSize="sm" color="blue.600" as="nav" aria-label="External links">
                        <Link href="https://github.com/HirokiHamaguchi/latexlint/tree/master" target="_blank" rel="noopener noreferrer">
                            <HStack align="center" gap={1}>
                                <Image
                                    src={`${import.meta.env.BASE_URL}mark-github-24.svg`}
                                    alt="GitHub"
                                    boxSize="1.5em"
                                />
                                <Text>GitHub</Text>
                            </HStack>
                        </Link>
                        <Link href="https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint" target="_blank" rel="noopener noreferrer">
                            <HStack align="center" gap={1}>
                                <Image
                                    src={`${import.meta.env.BASE_URL}Visual_Studio_Code_1.35_icon.svg`}
                                    alt="VS Code"
                                    boxSize="1.5em"
                                />
                                <Text>VS Code Extension</Text>
                            </HStack>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsDialogOpen(true)}
                            p={1}
                            minW="auto"
                        >
                            <HStack align="center" gap={1}>
                                <Text fontSize="1.5em">📄</Text>
                                <Text>Sample</Text>
                            </HStack>
                        </Button>
                    </HStack>
                </Box>

                <Box as="section" aria-label="LaTeX Linting Interface">
                    <VStack align="stretch" gap={4}>
                        <Heading as="h2" size="md" color="gray.700">LaTeX Editor</Heading>
                        <Text fontSize="sm" fontWeight="medium">
                            <Text as="span" color={summary.color}>{summary.base}</Text>{' '}
                            <Text as="span" color="gray.600">{summary.message}</Text>
                        </Text>
                        <MonacoLatexEditor
                            value={text}
                            onChange={handleTextChange}
                            diagnostics={diagnostics}
                            minHeight="500px"
                        />
                    </VStack>
                </Box>
            </VStack>

            <Dialog.Root open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="4xl" p={6}>
                        <Dialog.Header>
                            <Dialog.Title fontSize="xl" fontWeight="bold">
                                Sample - Before and After
                            </Dialog.Title>
                            <Dialog.CloseTrigger />
                        </Dialog.Header>
                        <Dialog.Body>
                            <VStack gap={4} align="stretch">
                                <Text fontSize="md" color="gray.600" textAlign="center">
                                    See how LaTeX Lint improves your code
                                </Text>
                                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                                    <VStack gap={3}>
                                        <Heading size="md" color="red.600">Before</Heading>
                                        <Image
                                            src={`${import.meta.env.BASE_URL}sample_before.png`}
                                            alt="Sample Before"
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="gray.300"
                                            maxW="100%"
                                            h="auto"
                                        />
                                    </VStack>
                                    <VStack gap={3}>
                                        <Heading size="md" color="green.600">After</Heading>
                                        <Image
                                            src={`${import.meta.env.BASE_URL}sample_after.png`}
                                            alt="Sample After"
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="gray.300"
                                            maxW="100%"
                                            h="auto"
                                        />
                                    </VStack>
                                </Grid>
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button onClick={() => setIsDialogOpen(false)} colorScheme="blue">
                                Close
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </Container>
    );
}
