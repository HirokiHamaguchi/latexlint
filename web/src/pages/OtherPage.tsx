import {
    Text,
    VStack
} from '@chakra-ui/react';
import { getVocabularyData } from '@latexlint/TextLint/vocabulary_loader';
import { useMemo } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { SectionHeading } from '../components/typography/SectionHeading';
import { VocabularyTable } from './overview/VocabularyTable';

export function OtherPage() {
    const vocabularyData = useMemo(() => getVocabularyData(), []);

    return (
        <PageLayout>
            <VStack align="stretch">
                <SectionHeading>Privacy</SectionHeading>
                <Text fontSize="sm">
                    Your input is processed entirely within your browser.
                    No data is sent to any server.
                </Text>
            </VStack>
            <VStack align="stretch">
                <SectionHeading>Japanese Vocabulary Check</SectionHeading>
                <VocabularyTable entries={vocabularyData} />
            </VStack>
        </PageLayout>
    );
}
