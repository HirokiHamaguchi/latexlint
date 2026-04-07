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
import { LuBan, LuExternalLink, LuSettings } from 'react-icons/lu';
import {
    type DiagnosticCounts,
    getDiagnosticColor,
    getDiagnosticCounts,
    getRuleId,
    getSeverityPresentation,
    SEVERITY_CONFIG,
    sortDiagnostics,
} from './diagnostics/diagnostic-utils';

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
                        <LuSettings size={16} />
                        {ruleId}
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
    const presentation = getSeverityPresentation(diagnostic);

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
                        <Badge colorPalette={presentation.color} variant="solid" size="sm">
                            {presentation.label.endsWith('s') ? presentation.label.slice(0, -1) : presentation.label}
                        </Badge>
                        <Text color="gray.600">
                            Line {diagnostic.startLineNumber}, Column {diagnostic.startColumn}
                        </Text>
                    </HStack>
                    <RuleActions
                        diagnostic={diagnostic}
                        onOpenAboutWithHash={onOpenAboutWithHash}
                        onDisableRule={onDisableRule}
                    />
                </HStack>
                <Text>{diagnostic.message}</Text>
            </VStack>
        </Box>
    );
};

export function DiagnosticsSection({ diagnostics, onOpenAboutWithHash, onDiagnosticClick, onDisableRule, height }: {
    diagnostics: monaco.editor.IMarkerData[];
    onOpenAboutWithHash: (hash: string) => void;
    onDiagnosticClick: (lineNumber: number, column: number) => void;
    onDisableRule: (ruleId: string) => void;
    height?: number;
}) {
    const counts = getDiagnosticCounts(diagnostics);
    const color = getDiagnosticColor(counts);
    const sortedDiagnostics = sortDiagnostics(diagnostics);
    const hasProblems = diagnostics.length > 0;

    return (
        <Box
            border="1px"
            borderColor={color + '.200'}
            borderRadius="md"
            p={4}
            bg={color + '.50'}
            height={height ? `${height}px` : undefined}
            overflowY={height ? 'auto' : undefined}
        >
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
