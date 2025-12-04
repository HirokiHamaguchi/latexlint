import {
    Badge,
    Box,
    HStack,
    Link,
    Separator,
    Text,
    VStack,
} from '@chakra-ui/react';
import type * as monaco from 'monaco-editor';
import { LuExternalLink } from 'react-icons/lu';

const SEVERITY = { ERROR: 8, WARNING: 4, INFO: 2, HINT: 1 } as const;

type SeverityKey = 'errors' | 'warnings' | 'info' | 'hints';
type DiagnosticCounts = Record<SeverityKey, number>;

const SEVERITY_CONFIG: Record<SeverityKey, { severity: number; color: string; label: string }> = {
    errors: { severity: SEVERITY.ERROR, color: 'red', label: 'Errors' },
    warnings: { severity: SEVERITY.WARNING, color: 'orange', label: 'Warnings' },
    info: { severity: SEVERITY.INFO, color: 'blue', label: 'Info' },
    hints: { severity: SEVERITY.HINT, color: 'gray', label: 'Hints' },
} as const;

const SEVERITY_TO_KEY = {
    [SEVERITY.ERROR]: 'errors',
    [SEVERITY.WARNING]: 'warnings',
    [SEVERITY.INFO]: 'info',
    [SEVERITY.HINT]: 'hints',
} as const;

const getDiagnosticCounts = (diagnostics: monaco.editor.IMarkerData[]): DiagnosticCounts => {
    const counts: DiagnosticCounts = { errors: 0, warnings: 0, info: 0, hints: 0 };
    diagnostics.forEach(d => {
        const key = SEVERITY_TO_KEY[d.severity as keyof typeof SEVERITY_TO_KEY];
        if (key) counts[key]++;
    });
    return counts;
};

const getDiagnosticColor = (counts: DiagnosticCounts) =>
    Object.entries(SEVERITY_CONFIG)
        .find(([key]) => counts[key as SeverityKey] > 0)
        ?.[1].color ?? 'green';

const sortDiagnostics = (diagnostics: monaco.editor.IMarkerData[]) =>
    [...diagnostics].sort((a, b) =>
        a.startLineNumber !== b.startLineNumber
            ? a.startLineNumber - b.startLineNumber
            : a.startColumn - b.startColumn
    );

const RuleLink = ({ diagnostic, onOpenAboutWithHash }: {
    diagnostic: monaco.editor.IMarkerData;
    onOpenAboutWithHash: (hash: string) => void;
}) => {
    if (!diagnostic.code || typeof diagnostic.code === 'string') return null;

    const handleClick = () => {
        const code = diagnostic.code;
        if (code && typeof code === 'object' && 'value' in code) {
            onOpenAboutWithHash(code.value as string);
        } else {
            console.warn('Diagnostic code is not in expected format:', diagnostic.code);
        }
    };

    return (
        <Link onClick={handleClick} fontSize="xs" color="blue.500" cursor="pointer">
            <HStack gap={1}>
                <Text>{typeof diagnostic.code === 'object' ? diagnostic.code.value : diagnostic.code}</Text>
                <LuExternalLink size={12} />
            </HStack>
        </Link>
    );
};

const DiagnosticBadges = ({ counts }: { counts: DiagnosticCounts }) => {
    return (
        <HStack gap={2}>
            {Object.entries(SEVERITY_CONFIG).map(([key, config]) => {
                const count = counts[key as keyof typeof counts];
                if (count === 0) return null;
                return (
                    <Badge key={key} colorPalette={config.color} variant="solid" size="lg">
                        {config.label}: {count}
                    </Badge>
                );
            })}
            {Object.values(counts).every(count => count === 0) && (
                <Badge colorPalette="green" variant="solid">No Issues</Badge>
            )}
        </HStack>
    );
};

const DiagnosticItem = ({ diagnostic, onOpenAboutWithHash, onDiagnosticClick }: {
    diagnostic: monaco.editor.IMarkerData;
    onOpenAboutWithHash: (hash: string) => void;
    onDiagnosticClick: (lineNumber: number, column: number) => void;
}) => {
    const severityKey = SEVERITY_TO_KEY[diagnostic.severity as keyof typeof SEVERITY_TO_KEY];
    const config = severityKey ? SEVERITY_CONFIG[severityKey] : SEVERITY_CONFIG.hints;

    const handleClick = () => {
        onDiagnosticClick(diagnostic.startLineNumber, diagnostic.startColumn);
    };

    return (
        <Box
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
            bg="white"
            _hover={{ bg: 'gray.50' }}
            cursor={'pointer'}
            onClick={handleClick}
        >
            <VStack align="stretch" gap={3}>
                <HStack justify="space-between" align="center">
                    <HStack gap={2}>
                        <Badge colorPalette={config.color} variant="solid" size="sm">
                            {config.label.slice(0, -1)}
                        </Badge>
                        <Text fontSize="sm" color="gray.600">
                            Line {diagnostic.startLineNumber}, Column {diagnostic.startColumn}
                        </Text>
                    </HStack>
                    <RuleLink diagnostic={diagnostic} onOpenAboutWithHash={onOpenAboutWithHash} />
                </HStack>
                <Text fontSize="sm">{diagnostic.message}</Text>
            </VStack>
        </Box>
    );
};

export function DiagnosticsSection({ diagnostics, onOpenAboutWithHash, onDiagnosticClick }: {
    diagnostics: monaco.editor.IMarkerData[];
    onOpenAboutWithHash: (hash: string) => void;
    onDiagnosticClick: (lineNumber: number, column: number) => void;
}) {
    const counts = getDiagnosticCounts(diagnostics);
    const color = getDiagnosticColor(counts);
    const sortedDiagnostics = sortDiagnostics(diagnostics);
    const hasProblems = diagnostics.length > 0;

    return (
        <Box border="1px" borderColor={color + '.200'} borderRadius="md" p={4} bg={color + '.50'}>
            <VStack align="stretch" gap={4}>
                <HStack justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold">Diagnostics</Text>
                    <DiagnosticBadges counts={counts} />
                </HStack>
                {hasProblems && (
                    <>
                        <Separator />
                        <VStack align="stretch" gap={3}>
                            {sortedDiagnostics.map((diagnostic, index) => (
                                <DiagnosticItem
                                    key={index}
                                    diagnostic={diagnostic}
                                    onOpenAboutWithHash={onOpenAboutWithHash}
                                    onDiagnosticClick={onDiagnosticClick}
                                />
                            ))}
                        </VStack>
                    </>
                )}
            </VStack>
        </Box>
    );
}