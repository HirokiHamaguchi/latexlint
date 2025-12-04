import {
    Box,
    Checkbox,
    Collapsible,
    Input,
    SimpleGrid,
    Text,
    VStack,
} from '@chakra-ui/react';
import { LuChevronRight } from "react-icons/lu";
import { configMetadata, type LintConfig } from '../config';
import { DocType } from '../types';

type ConfigFieldProps = {
    keyName: keyof LintConfig;
    config: LintConfig;
    updateConfig: (newConfig: LintConfig) => void;
};

function ConfigField(props: ConfigFieldProps) {
    const metadata = configMetadata[props.keyName];
    const currentValues = props.config[props.keyName] as unknown as string[];
    return (
        <Box>
            <Text fontWeight="bold" mb={2}>
                {metadata.description}
            </Text>
            {metadata.items?.enum ? (
                // Checkbox UI for enum fields
                <Box>
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={2}>
                        {metadata.items.enum.map((option) => (
                            <Checkbox.Root
                                key={option}
                                checked={currentValues.includes(option)}
                                onCheckedChange={(details) => {
                                    const newValue = details.checked === true
                                        ? [...currentValues, option]
                                        : currentValues.filter((v) => v !== option);
                                    props.updateConfig({ ...props.config, [props.keyName]: newValue } as LintConfig);
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
                    id={`config-input-${String(props.keyName)}`}
                    value={currentValues.join(', ')}
                    onChange={(e) => {
                        const value = e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter((s) => s);
                        props.updateConfig({ ...props.config, [props.keyName]: value } as LintConfig);
                    }}
                    placeholder="word1, word2, word3"
                    size="sm"
                />
            )}
        </Box>
    );
}

type ConfigurationSectionProps = {
    text: string;
    isOpen: boolean;
    docType: DocType;
    config: LintConfig;
    onToggle: (open: boolean) => void;
    onConfigChange: (newConfig: LintConfig) => void;
    onRunLint: (text: string, type: DocType, forceTextLint: boolean) => void;
}

export function ConfigurationSection(props: ConfigurationSectionProps) {
    return (
        <Box as="section" aria-label="Configuration">
            <Collapsible.Root open={props.isOpen} onOpenChange={(e) => props.onToggle(e.open)}>
                <Collapsible.Trigger
                    display="flex"
                    gap="2"
                    alignItems="center"
                    cursor="pointer"
                >
                    <Collapsible.Indicator transition="transform 0.2s" _open={{ transform: "rotate(90deg)" }}>
                        <LuChevronRight />
                    </Collapsible.Indicator>
                    Setting
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <Box mt={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                        <VStack align="stretch" gap={4}>
                            {(Object.keys(props.config) as Array<keyof LintConfig>).map((key) => {
                                return (
                                    <ConfigField
                                        key={key}
                                        keyName={key}
                                        config={props.config}
                                        updateConfig={(newConfig: LintConfig) => {
                                            props.onConfigChange(newConfig);
                                            props.onRunLint(props.text, props.docType, true);
                                        }}
                                    />
                                );
                            })}
                        </VStack>
                    </Box>
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    );
}