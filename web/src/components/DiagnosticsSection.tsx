import {
    Badge,
    Box,
    HStack,
    IconButton,
    Menu,
    MenuItem,
    Portal,
    Separator,
    Text,
    VStack,
} from '@chakra-ui/react';
import type * as monaco from 'monaco-editor';
import { LuBan, LuExternalLink, LuMenu } from 'react-icons/lu';

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

const getRuleId = (diagnostic: monaco.editor.IMarkerData): string | undefined => {
    if (!diagnostic.code) return undefined;
    if (typeof diagnostic.code === 'string') return diagnostic.code;
    if (typeof diagnostic.code === 'object' && 'value' in diagnostic.code) {
        return diagnostic.code.value as string;
    }
    console.warn('Diagnostic code is not in expected format:', diagnostic.code);
    return undefined;
};

const RuleActions = ({ diagnostic, onOpenAboutWithHash, onDisableRule }: {
    diagnostic: monaco.editor.IMarkerData;
    onOpenAboutWithHash: (hash: string) => void;
    onDisableRule: (ruleId: string) => void;
}) => {
    const ruleId = getRuleId(diagnostic);
    if (!ruleId) return null;

    const handleDocs = (e: React.MouseEvent) => {
        e.stopPropagation();
        onOpenAboutWithHash(ruleId);
    };

    const handleDisable = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDisableRule(ruleId);
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Box onClick={handleMenuClick}>
            <Menu.Root positioning={{ placement: 'bottom-end' }}>
                <Menu.Trigger asChild>
                    <IconButton
                        aria-label={`Actions for ${ruleId}`}
                        size="xs"
                        variant="ghost"
                    >
                        <LuMenu />
                    </IconButton>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <MenuItem value="docs" onClick={handleDocs}>
                                <HStack gap={2} align="center">
                                    <LuExternalLink size={16} />
                                    <Text>Open Rule Docs</Text>
                                </HStack>
                            </MenuItem>
                            <MenuItem value="disable" onClick={handleDisable}>
                                <HStack gap={2} align="center">
                                    <LuBan size={16} />
                                    <Text>Disable Rule</Text>
                                </HStack>
                            </MenuItem>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </Box>
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

const DiagnosticItem = ({ diagnostic, onOpenAboutWithHash, onDiagnosticClick, onDisableRule }: {
    diagnostic: monaco.editor.IMarkerData;
    onOpenAboutWithHash: (hash: string) => void;
    onDiagnosticClick: (lineNumber: number, column: number) => void;
    onDisableRule: (ruleId: string) => void;
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
            cursor='pointer'
            onClick={handleClick}
        >
            <VStack align="stretch" gap={3}>
                <HStack justify="space-between" align="center">
                    <HStack gap={2}>
                        <Badge colorPalette={config.color} variant="solid" size="sm">
                            {config.label.endsWith('s') ? config.label.slice(0, -1) : config.label}
                        </Badge>
                        <Text fontSize="sm" color="gray.600">
                            Line {diagnostic.startLineNumber}, Column {diagnostic.startColumn}
                        </Text>
                    </HStack>
                    <RuleActions
                        diagnostic={diagnostic}
                        onOpenAboutWithHash={onOpenAboutWithHash}
                        onDisableRule={onDisableRule}
                    />
                </HStack>
                <Text fontSize="sm">{diagnostic.message}</Text>
            </VStack>
        </Box>
    );
};

export function DiagnosticsSection({ diagnostics, onOpenAboutWithHash, onDiagnosticClick, onDisableRule }: {
    diagnostics: monaco.editor.IMarkerData[];
    onOpenAboutWithHash: (hash: string) => void;
    onDiagnosticClick: (lineNumber: number, column: number) => void;
    onDisableRule: (ruleId: string) => void;
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
                                    onDisableRule={onDisableRule}
                                />
                            ))}
                        </VStack>
                    </>
                )}
            </VStack>
        </Box>
    );
}
