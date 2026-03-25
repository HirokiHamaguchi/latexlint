import {
    Box,
    Checkbox,
    IconButton,
    Input,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react';
import { LuCircleHelp } from "react-icons/lu";
import { configMetadata, type LintConfig } from '../config';
import { DocType } from '../types';
import { SectionHeading } from './typography/SectionHeading';

type ConfigKey = keyof LintConfig;

function parseInputList(value: string): string[] {
    return value
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
}

type ConfigFieldProps = {
    keyName: ConfigKey;
    config: LintConfig;
    updateConfig: (newConfig: LintConfig) => void;
    onOpenAboutWithHash: (hash: string) => void;
};

function ConfigField(props: ConfigFieldProps) {
    const metadata = configMetadata[props.keyName];
    const currentValues = props.config[props.keyName];
    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Text fontWeight="bold">
                    {metadata.description}
                </Text>
                {metadata.description && (
                    <IconButton
                        aria-label={`Open docs for ${metadata.description}`}
                        size="xs"
                        variant="ghost"
                        onClick={() => props.onOpenAboutWithHash(metadata.description)}
                    >
                        <LuCircleHelp />
                    </IconButton>
                )}
            </Box>
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
                                width="fit-content"
                                cursor="pointer"
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control borderColor="gray.400" />
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
                        const value = parseInputList(e.target.value);
                        // todo: validation
                        props.updateConfig({ ...props.config, [props.keyName]: value } as LintConfig);
                    }}
                    placeholder="word1, word2, word3"
                    size="sm"
                    borderColor="gray.400"
                />
            )}
        </Box>
    );
}

type ConfigurationSectionProps = {
    text: string;
    docType: DocType;
    config: LintConfig;
    onConfigChange: (newConfig: LintConfig) => void;
    onRunLint: (text: string, type: DocType, forceTextLint: boolean) => void;
    onOpenAboutWithHash: (hash: string) => void;
}

export function ConfigurationSection(props: ConfigurationSectionProps) {
    return (
        <VStack align="stretch">
            <SectionHeading>Settings</SectionHeading>
            <VStack align="stretch" gap={4}>
                {(Object.keys(props.config) as ConfigKey[]).map((key) => {
                    const updateConfigAndLint = (newConfig: LintConfig) => {
                        props.onConfigChange(newConfig);
                        props.onRunLint(props.text, props.docType, true);
                    };

                    return (
                        <ConfigField
                            key={key}
                            keyName={key}
                            config={props.config}
                            updateConfig={updateConfigAndLint}
                            onOpenAboutWithHash={props.onOpenAboutWithHash}
                        />
                    );
                })}
            </VStack>
        </VStack>
    );
}
