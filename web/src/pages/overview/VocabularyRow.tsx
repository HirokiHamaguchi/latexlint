import { Box, Collapsible, Table, Text } from '@chakra-ui/react';
import type { VocabularyEntry } from '@latexlint/TextLint/vocabulary_loader';
import { useState } from 'react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';

type VocabularyRowProps = {
    entry: VocabularyEntry;
};

function formatList(value: string | string[]) {
    return Array.isArray(value) ? value.join(', ') : value;
}

function formatMemo(memo: string) {
    if (!memo) return null;
    return memo.split('\n').map((line, index) => (
        <Text key={index} fontSize="sm">{line}</Text>
    ));
}

export function VocabularyRow({ entry }: VocabularyRowProps) {
    const [isOpen, setIsOpen] = useState(false);
    const hasMemo = entry.memo.length > 0;

    return (
        <>
            <Table.Row
                onClick={() => hasMemo && setIsOpen(!isOpen)}
                cursor={hasMemo ? 'pointer' : 'default'}
            >
                <Table.Cell width="45%">{formatList(entry.no)}</Table.Cell>
                <Table.Cell width="45%">{entry.yes}</Table.Cell>
                <Table.Cell width="10%" textAlign="center">
                    {hasMemo && (
                        <Box color="gray.500" display="inline-flex" alignItems="center">
                            {isOpen ? <IoChevronDown size={16} /> : <IoChevronForward size={16} />}
                        </Box>
                    )}
                </Table.Cell>
            </Table.Row>
            {hasMemo && (
                <Table.Row style={{ borderBottom: !isOpen ? 'none' : undefined }}>
                    <Table.Cell colSpan={3} p={0} border="none">
                        <Collapsible.Root open={isOpen}>
                            <Collapsible.Content>
                                <Box width="100%" bg="gray.50" p={3}>
                                    <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.600">詳細:</Text>
                                    {formatMemo(entry.memo)}
                                </Box>
                            </Collapsible.Content>
                        </Collapsible.Root>
                    </Table.Cell>
                </Table.Row>
            )}
        </>
    );
}
