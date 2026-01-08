import {
    Box,
    CloseButton,
    Collapsible,
    Dialog,
    Grid,
    Heading,
    Image,
    Link,
    Table,
    Tabs,
    Text,
    VStack
} from '@chakra-ui/react';
import { getVocabularyData, type VocabularyEntry } from '@latexlint/TextLint/vocabulary_loader';
import 'github-markdown-css/github-markdown-light.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import readmeContent from '../assets/README.md?raw';

const BASE_URL = import.meta.env.BASE_URL;
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/';


const SampleImage = ({ src, alt, color }: { src: string; alt: string; color: string }) => (
    <VStack>
        <Heading size="sm" color={color}>{alt}</Heading>
        <Image
            src={`${BASE_URL}${src}`}
            alt={alt}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
            maxW="100%"
            h="auto"
        />
    </VStack>
);

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

function OverviewTab() {
    return <VStack align="stretch">
        <VStack align="stretch">
            <Heading size="lg">Privacy</Heading>
            <Text fontSize="sm">
                Your input is processed entirely within your browser.
                No data is sent to any server.
            </Text>
        </VStack>
        <VStack align="stretch">
            <Heading size="lg">Sample</Heading>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                <SampleImage src="sample_before.png" alt="Before" color="red.600" />
                <SampleImage src="sample_after.png" alt="After" color="green.600" />
            </Grid>
        </VStack>
    </VStack>
};

function ReadmeTab({ readmeRef, tab }: { readmeRef: React.RefObject<HTMLDivElement | null>, tab: string }) {
    return <div className="markdown-body" ref={readmeRef}>
        {tab === "readme" ?
            <Markdown
                // @ts-expect-error: Type '() => void | Transformer<Root, Root>' is not assignable to type 'Pluggable'.
                remarkPlugins={[remarkGfm, remarkSlug]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    img: ({ src, ...props }) => {
                        const resolvedSrc = src?.startsWith('http') ? src : `${GITHUB_RAW_BASE}${src}`;
                        if ("width" in props) return <img {...props} src={resolvedSrc} />;
                        return (
                            <span style={{ display: 'flex', justifyContent: 'center', margin: '1em 0' }}>
                                <img {...props} src={resolvedSrc} style={{ maxWidth: '70%' }} />
                            </span>
                        );
                    },
                }}
            >
                {readmeContent}
            </Markdown>
            : null
        }
    </div>
};

function JapaneseTab() {
    const vocabularyData = useMemo(() => getVocabularyData(), []);
    return (
        <VStack gap={4} align="stretch">
            <Heading size="md">Japanese Vocabulary Check</Heading>
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
    );
};

interface AboutModalProps {
    tab: string;
    isOpen: boolean;
    readmeLink: string;
    onClose: () => void;
    onTabChange: (tab: string) => void;
}

export function AboutModal({ tab, isOpen, readmeLink, onClose, onTabChange }: AboutModalProps) {
    const dialogBodyRef = useRef<HTMLDivElement>(null);
    const readmeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && tab === 'readme') {
            setTimeout(() => {
                if (readmeLink && readmeRef.current && dialogBodyRef.current) {
                    const element = readmeRef.current.querySelector(`#${readmeLink.toLowerCase()}`);
                    if (!element) {
                        console.warn(`Element with id ${readmeLink} not found in README.`);
                        return;
                    }
                    const dialogBody = dialogBodyRef.current;
                    if (!dialogBody) return;

                    const scrollToElement = () => {
                        dialogBody.scrollTo({
                            top: Math.max(0, (element as HTMLElement).offsetTop),
                            behavior: 'auto'
                        });
                    };

                    // Initial scroll
                    scrollToElement();

                    // Re-scroll when images load
                    readmeRef.current.querySelectorAll('img').forEach((img) => {
                        if (!img.complete) img.addEventListener('load', scrollToElement, { once: true });
                    });
                }
            }, 10);
        }
    }, [tab, isOpen, readmeLink]);

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
            <Dialog.Backdrop />
            <Dialog.Positioner h="100dvh" display="flex" alignItems="center" justifyContent="center" overflowY="hidden">
                <Dialog.Content maxW="6xl" maxH="90dvh" h="auto" display="flex" flexDirection="column">
                    <Dialog.Header>
                        <Dialog.Title fontSize="xl" fontWeight="bold">
                            About LaTeX Lint
                        </Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="xl" onClick={onClose} />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body ref={dialogBodyRef} overflowY="auto">
                        <Tabs.Root value={tab} variant="enclosed" onValueChange={(details) => onTabChange(details.value)}>
                            <Tabs.List>
                                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                                <Tabs.Trigger value="readme">README</Tabs.Trigger>
                                <Tabs.Trigger value="japanese">Japanese</Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value="overview">
                                {tab === "overview" && <OverviewTab />}
                            </Tabs.Content>
                            <Tabs.Content value="readme" pt={4}>
                                <ReadmeTab readmeRef={readmeRef} tab={tab} />
                            </Tabs.Content>
                            <Tabs.Content value="japanese" pt={4}>
                                {tab === 'japanese' && <JapaneseTab />}
                            </Tabs.Content>
                        </Tabs.Root>
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root >
    );
}
