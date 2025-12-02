import {
    Box,
    Text,
    VStack,
    Input,
    Collapsible,
    SimpleGrid,
    Checkbox,
} from '@chakra-ui/react';
import { LuChevronRight } from "react-icons/lu";
import { type LintConfig, configMetadata } from '../config';
import { DocType } from '../types';

interface ConfigurationSectionProps {
    isOpen: boolean;
    onToggle: (open: boolean) => void;
    config: LintConfig;
    onConfigChange: (newConfig: LintConfig) => void;
    onRunLint: (text: string, type: DocType, forceTextLint: boolean) => void;
    text: string;
    docType: DocType;
}

export function ConfigurationSection({
    isOpen,
    onToggle,
    config,
    onConfigChange,
    onRunLint,
    text,
    docType,
}: ConfigurationSectionProps) {
    const updateConfig = (newConfig: LintConfig) => {
        onConfigChange(newConfig);
        onRunLint(text, docType, true);
    };

    return (
        <Box as="section" aria-label="Configuration">
            <Collapsible.Root open={isOpen} onOpenChange={(e) => onToggle(e.open)}>
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
    );
}