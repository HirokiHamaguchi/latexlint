import { useState } from 'react';
import {
    Box,
    Button,
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
} from '@chakra-ui/react';
import { lintLatex } from './latex-linter';
import type { WebDiagnostic } from './latex-linter';
import sampleText from '../sample/sample_before.tex?raw';

export function Content() {
    const [text, setText] = useState(sampleText);
    const [diagnostics, setDiagnostics] = useState<WebDiagnostic[]>([]);
    const [isLinting, setIsLinting] = useState(false);

    const gridColumns = useBreakpointValue({ base: '1fr', md: '1fr 1fr' });

    const handleLint = () => {
        if (!text.trim()) {
            setDiagnostics([]);
            return;
        }

        setIsLinting(true);

        setTimeout(() => {
            try {
                const results = lintLatex(text);
                setDiagnostics(results);
            } catch (error) {
                console.error('Linting error:', error);
                setDiagnostics([]);
            } finally {
                setIsLinting(false);
            }
        }, 100);
    };

    const handleClear = () => {
        setText('');
        setDiagnostics([]);
    };

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
            return createAlert('info', 'Click "Lint LaTeX" to check for issues');
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
        <Container maxW="container.xl" py={8}>
            <VStack gap={8} align="stretch">
                <Box textAlign="center">
                    <HStack justify="center" align="center" mb={4}>
                        <Image
                            src="https://github.com/HirokiHamaguchi/latexlint/blob/master/images/lintIconLight.svg?raw=true"
                            alt="LaTeX Lint Icon"
                            boxSize="1.2em"
                            mr={2}
                        />
                        <Heading as="h1" size="2xl" color="gray.700">
                            LaTeX Lint - Online LaTeX Linter
                        </Heading>
                    </HStack>
                    <Text fontSize="lg" color="gray.600" mb={4}>
                        Check your LaTeX code for common issues and style problems
                    </Text>
                    <HStack justify="center" gap={6} flexWrap="wrap" fontSize="sm" color="blue.600">
                        <Link href="https://github.com/HirokiHamaguchi/latexlint/tree/master" target="_blank" rel="noopener noreferrer">
                            GitHub
                        </Link>
                        <Link href="https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint" target="_blank" rel="noopener noreferrer">
                            VSCode Extension
                        </Link>
                    </HStack>
                </Box>

                <HStack gap={4} justify="center" flexWrap="wrap">
                    <Button
                        colorScheme="blue"
                        size="lg"
                        onClick={handleLint}
                        loading={isLinting}
                        loadingText="Linting..."
                        px={8}
                    >
                        Lint LaTeX
                    </Button>
                    <Button
                        colorScheme="red"
                        variant="outline"
                        size="lg"
                        onClick={handleClear}
                        px={8}
                    >
                        Clear
                    </Button>
                </HStack>

                <Grid templateColumns={gridColumns} gap={6} minH="500px">
                    <GridItem>
                        <VStack align="stretch" h="full">
                            <Textarea
                                id="latex-input"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter your LaTeX code here..."
                                fontFamily="mono"
                                fontSize="sm"
                                resize="vertical"
                                minH="400px"
                                flex="1"
                                borderColor="gray.300"
                                _focus={{
                                    borderColor: "blue.400",
                                    boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.2)"
                                }}
                            />
                        </VStack>
                    </GridItem>

                    <GridItem>
                        <VStack align="stretch" h="full">
                            <Box flex="1" p={4} borderWidth="1px" borderColor="gray.300" borderRadius="md" bg="gray.50" overflowY="auto" minH="400px">
                                {renderDiagnostics()}
                            </Box>
                        </VStack>
                    </GridItem>
                </Grid>
            </VStack>
        </Container>
    );
}
