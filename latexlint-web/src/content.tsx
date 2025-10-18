import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Grid,
    GridItem,
    Heading,
    Text,
    Textarea,
    VStack,
    HStack,
    Spinner,
    useBreakpointValue,
    Alert,
    Link,
    Image,
    Button,
    Dialog,
} from '@chakra-ui/react';
import { lintLatex } from './latex-linter';
import type { WebDiagnostic } from './latex-linter';
import sampleText from '../sample/sample_before.tex?raw';

export function Content() {
    const [text, setText] = useState(sampleText);
    const [diagnostics, setDiagnostics] = useState<WebDiagnostic[]>([]);
    const [isLinting, setIsLinting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const gridColumns = useBreakpointValue({ base: '1fr', md: '1fr 1fr' });

    const runLint = (inputText: string) => {
        if (!inputText.trim()) {
            setDiagnostics([]);
            setIsLinting(false);
            return;
        }

        setIsLinting(true);

        setTimeout(() => {
            try {
                const results = lintLatex(inputText);
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

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

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
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []); // Run once on mount with sampleText

    const getAlertStatus = (severity: string) => {
        switch (severity) {
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'info': return 'info';
            default: return 'info';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return 'ℹ️';
        }
    };

    const createAlert = (status: 'info' | 'success' | 'error' | 'warning', title: React.ReactNode, showSpinner = false) => (
        <Alert.Root status={status} borderRadius="md">
            <Alert.Indicator />
            <Alert.Content>
                <Alert.Title>
                    {showSpinner && <Spinner size="sm" mr={3} />}
                    {title}
                </Alert.Title>
            </Alert.Content>
        </Alert.Root>
    );

    const renderDiagnostics = () => {
        if (isLinting) {
            return createAlert('info', 'Linting...', true);
        }

        if (diagnostics.length === 0) {
            if (text.trim()) {
                return createAlert('success', 'No issues found!');
            }
            return createAlert('info', 'Enter LaTeX code to check for issues');
        }

        return (
            <VStack gap={3} align="stretch">
                {diagnostics.map((diag, index) => (
                    <Alert.Root key={index} status={getAlertStatus(diag.severity)} borderRadius="md">
                        <Alert.Indicator />
                        <Alert.Content>
                            <VStack align="start" gap={1} flex="1">
                                <Text fontSize="sm" fontWeight="semibold">
                                    {getSeverityIcon(diag.severity)} {diag.message}
                                </Text>
                                <Text fontSize="xs" color="gray.600" fontFamily="mono">
                                    Line {diag.range.start.line + 1}, Column {diag.range.start.character + 1}
                                    {diag.code ? ` (${diag.code})` : ''}
                                </Text>
                            </VStack>
                        </Alert.Content>
                    </Alert.Root>
                ))}
            </VStack>
        );
    };

    return (
        <Container maxW="container.xl" py={8} as="main">
            <VStack gap={8} align="stretch">
                <Box textAlign="center" as="header">
                    <HStack justify="center" align="center" mb={4}>
                        <Image
                            src="https://github.com/HirokiHamaguchi/latexlint/blob/master/images/lintIconLight.svg?raw=true"
                            alt="LaTeX Lint Icon"
                            boxSize="1.8em"
                            mr={2}
                        />
                        <Heading as="h1" size="2xl" color="gray.700">
                            LaTeX Lint - Online LaTeX Linter
                        </Heading>
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
                                    alt="VSCode"
                                    boxSize="1.5em"
                                />
                                <Text>VSCode Extension</Text>
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

                <Grid templateColumns={gridColumns} gap={6} minH="500px" as="section" aria-label="LaTeX Linting Interface">
                    <GridItem>
                        <VStack align="stretch" h="full">
                            <Heading as="h2" size="md" mb={2} color="gray.700">LaTeX Input</Heading>
                            <Textarea
                                id="latex-input"
                                value={text}
                                onChange={(e) => handleTextChange(e.target.value)}
                                placeholder="Enter your LaTeX code here..."
                                fontFamily="mono"
                                fontSize="sm"
                                resize="vertical"
                                minH="400px"
                                flex="1"
                                borderColor="gray.300"
                                spellCheck={false}
                                aria-label="LaTeX code input"
                                _focus={{
                                    borderColor: "blue.400",
                                    boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.2)"
                                }}
                            />
                        </VStack>
                    </GridItem>

                    <GridItem>
                        <VStack align="stretch" h="full">
                            <Heading as="h2" size="md" mb={2} color="gray.700">Lint Results</Heading>
                            <Box flex="1" p={4} borderWidth="1px" borderColor="gray.300" borderRadius="md" bg="gray.50" overflowY="auto" minH="400px" role="log" aria-live="polite" aria-label="Linting results">
                                {renderDiagnostics()}
                            </Box>
                        </VStack>
                    </GridItem>
                </Grid>
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
