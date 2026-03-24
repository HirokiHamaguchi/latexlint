import {
    Box,
    Collapsible,
    Container,
    Heading,
    Link,
    Table,
    Text,
    VStack
} from '@chakra-ui/react';
import { getVocabularyData, type VocabularyEntry } from '@latexlint/TextLint/vocabulary_loader';
import { useMemo, useState } from 'react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';
import { Footer } from '../components/Footer';
import { TopNavHeader } from '../components/TopNavHeader';

const VocabularyRow = ({ entry }: { entry: VocabularyEntry }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasMemo = entry.memo.length > 0;

    const formatList = (value: string | string[]) => {
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        return value;
    };

    const formatMemo = (memo: string) => {
        if (!memo) return null;
        return memo.split('\n').map((line, idx) => (
            <Text key={idx} fontSize="sm">{line}</Text>
        ));
    };

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
};

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopNavHeader />
            <Container maxW="container.xl" py={8} as="main">
                <VStack gap={4} align="stretch">
                    {children}
                </VStack>
                <Footer />
            </Container>
        </>
    );
}

export function OverviewPage() {
    const vocabularyData = useMemo(() => getVocabularyData(), []);

    return (
        <PageShell>
            <VStack align="stretch">
                <Heading size="xl">Privacy</Heading>
                <Text fontSize="sm">
                    Your input is processed entirely within your browser.
                    No data is sent to any server.
                </Text>
            </VStack>
            <VStack align="stretch">
                <Heading size="xl">Japanese Vocabulary Check</Heading>
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
                                <Table.ColumnHeader width="10%"></Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {vocabularyData.map((entry, index) => (
                                <VocabularyRow key={index} entry={entry} />
                            ))}
                        </Table.Body>
                    </Table.Root>
                </VStack>
            </VStack>
        </PageShell>
    );
}
