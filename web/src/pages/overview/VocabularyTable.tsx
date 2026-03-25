import { Link, Table, Text, VStack } from '@chakra-ui/react';
import type { VocabularyEntry } from '@latexlint/TextLint/vocabulary_loader';
import { VocabularyRow } from './VocabularyRow';

type VocabularyTableProps = {
    entries: VocabularyEntry[];
};

export function VocabularyTable({ entries }: VocabularyTableProps) {
    return (
        <VStack gap={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
                textlintというツールの一部機能と、独自の語彙チェックを走らせています。
            </Text>
            <Text fontSize="sm" color="gray.600">
                単語レベルでのチェックに関しては、以下の潜在的な誤りを検出します。
            </Text>
            <Text fontSize="sm" color="gray.600">
                なお、これらは必ずしも誤りであるとは限らず、指摘はあくまで参考に留め、文脈や意図に応じて適宜判断してください。
            </Text>
            <Text fontSize="sm" color="gray.600">
                現在開発途中です、まだ不完全な部分も多くあります。
                この表に限らず、お気づきの点があれば
                <Link href="https://github.com/HirokiHamaguchi/latexlint/issues" target="_blank" rel="noopener noreferrer" color="blue.500" textDecoration="underline">
                    フィードバック
                </Link>
                をいただけると幸いです。
            </Text>
            <Table.Root size="sm" variant="outline">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader width="45%">現行表現</Table.ColumnHeader>
                        <Table.ColumnHeader width="45%">代替表現</Table.ColumnHeader>
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
