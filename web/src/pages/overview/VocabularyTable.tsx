import { Table, Text, VStack } from '@chakra-ui/react';
import type { VocabularyEntry } from '@latexlint/TextLint/vocabulary_loader';
import { VocabularyRow } from './VocabularyRow';

type VocabularyTableProps = {
    title?: string;
    entries: VocabularyEntry[];
};

export function VocabularyTable({ title, entries }: VocabularyTableProps) {
    return (
        <VStack gap={4} align="stretch">
            {title ? <Text fontWeight="semibold">{title}</Text> : null}
            <Table.Root variant="outline">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader width="45%">
                            {/* Current Expression / 現行表現 */}
                            {title && title.toLowerCase().includes('english')
                                ? 'Current Expression'
                                : '現行表現'}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader width="45%">
                            {title && title.toLowerCase().includes('english')
                                ? 'Suggested Expression'
                                : '代替表現'}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader width="10%" />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {entries.map((entry, index) => (
                        <VocabularyRow key={index} entry={entry} />
                    ))}
                </Table.Body>
            </Table.Root>
        </VStack>
    );
}
