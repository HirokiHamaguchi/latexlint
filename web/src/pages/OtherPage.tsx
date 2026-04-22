import {
    Box,
    Button,
    HStack,
    Icon,
    Link,
    Text,
    VStack
} from '@chakra-ui/react';
import { getVocabularyData } from '@latexlint/TextLint/vocabulary_loader';
import { useMemo } from 'react';
import { FaStar } from 'react-icons/fa';
import { PageLayout } from '../components/layout/PageLayout';
import { SectionHeading } from '../components/typography/SectionHeading';
import { VocabularyTable } from './overview/VocabularyTable';

export function OtherPage() {
    const vocabularyData = useMemo(() => getVocabularyData(), []);

    return (
        <PageLayout>
            <VStack align="stretch">
                <SectionHeading>Support LaTeX Lint</SectionHeading>
                <VStack align="stretch" gap={3}>
                    <Text>
                        If LaTeX Lint helps your writing, please star our GitHub repository.
                    </Text>
                    <Text>
                        It really motivates us! We appreciate your attention.
                    </Text>
                    <Link
                        href="https://github.com/HirokiHamaguchi/latexlint"
                        target="_blank"
                        rel="noopener noreferrer"
                        alignSelf="flex-start"
                    >
                        <Button colorScheme="yellow" size="lg" aria-label="Star on GitHub">
                            <HStack gap={2}>
                                <Icon as={FaStar} aria-hidden="true" color="yellow.400" />
                                <Text as="span">Star on GitHub</Text>
                            </HStack>
                        </Button>
                    </Link>
                </VStack>
            </VStack>
            <VStack align="stretch">
                <SectionHeading>Privacy</SectionHeading>
                <Text>
                    Your input is processed entirely within your browser.
                </Text>
                <Text>
                    No data is sent to any server.
                </Text>
            </VStack>
            <VStack align="stretch">
                <SectionHeading>Sample PDF</SectionHeading>
                <Box
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    overflow="hidden"
                >
                    <embed
                        src="/latexlint/lint.pdf"
                        type="application/pdf"
                        width="100%"
                        height="600"
                        style={{ display: 'block' }}
                    />
                </Box>
            </VStack>
            <VStack align="stretch">
                <SectionHeading>Vocabulary Check</SectionHeading>
                <Text>
                    We run a subset of textlint features together with our custom vocabulary checks.
                </Text>
                <Text>
                    At the word level, the table below lists patterns that may indicate potential mistakes.
                </Text>
                <VocabularyTable title="English Vocabulary" entries={vocabularyData.entries_en} />
                <VocabularyTable title="Japanese Vocabulary" entries={vocabularyData.entries_ja} />
            </VStack>
        </PageLayout>
    );
}
