import {
    Dialog,
    Button,
    VStack,
    Text,
    Link,
    HStack,
    Image,
    Heading,
    Grid,
    Tabs,
    Table,
} from '@chakra-ui/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css/github-markdown-light.css';
import readmeContent from './assets/README.md?raw';
import vocabularyData from '@latexlint/TextLint/my_vocabulary.json';
import { useEffect, useRef } from 'react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: string;
}

const BASE_URL = import.meta.env.BASE_URL;
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/';

const ExternalLink = ({ href, children, icon }: { href: string; children: React.ReactNode; icon?: string }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer">
        <HStack align="center" gap={2}>
            {icon && <Image src={`${BASE_URL}${icon}`} alt="" boxSize="1.5em" />}
            <Text>{children}</Text>
        </HStack>
    </Link>
);

const SampleImage = ({ src, alt, color }: { src: string; alt: string; color: string }) => (
    <VStack gap={3}>
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

export function AboutModal({ isOpen, onClose, defaultTab = "overview" }: AboutModalProps) {
    const readmeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && defaultTab === 'readme') {
            // Wait for the dialog and markdown to render
            setTimeout(() => {
                const hash = window.location.hash.slice(1); // Remove '#'
                if (hash && readmeRef.current) {
                    const targetId = hash.toLowerCase();
                    // Try to find element by id first
                    let element = readmeRef.current.querySelector(`#${targetId}`);

                    // If not found, try to find by heading text
                    if (!element) {
                        const headings = readmeRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
                        Array.from(headings).forEach((heading) => {
                            const headingText = heading.textContent?.toLowerCase().replace(/\s+/g, '');
                            if (headingText === targetId && !element) {
                                element = heading;
                            }
                        });
                    }

                    if (element) {
                        const scrollToElement = () => {
                            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        };

                        // Initial scroll
                        scrollToElement();

                        // Re-scroll when images load
                        const images = readmeRef.current.querySelectorAll('img');
                        images.forEach((img) => {
                            if (!img.complete)
                                img.addEventListener('load', scrollToElement, { once: true });
                        });

                        // Clear the hash from URL after scrolling
                        window.history.replaceState(null, '', window.location.pathname + window.location.search);
                    }
                }
            }, 300);
        }
    }, [isOpen, defaultTab]);

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW="6xl" maxH="90vh" p={6}>
                    <Dialog.Header>
                        <Dialog.Title fontSize="xl" fontWeight="bold">
                            About LaTeX Lint
                        </Dialog.Title>
                        <Dialog.CloseTrigger />
                    </Dialog.Header>
                    <Dialog.Body overflowY="auto">
                        <Tabs.Root defaultValue={defaultTab} variant="enclosed">
                            <Tabs.List>
                                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                                <Tabs.Trigger value="readme">README</Tabs.Trigger>
                                <Tabs.Trigger value="japanese">Japanese</Tabs.Trigger>
                            </Tabs.List>

                            <Tabs.Content value="overview" pt={4}>
                                <VStack gap={6} align="stretch">
                                    <VStack gap={3} align="stretch">
                                        <Heading size="md">Privacy</Heading>
                                        <Text fontSize="sm">
                                            All input is processed entirely in your browser.
                                            No network requests are made.
                                        </Text>
                                    </VStack>
                                    <VStack gap={3} align="stretch">
                                        <Heading size="md">Links</Heading>
                                        <HStack gap={4} flexWrap="wrap">
                                            <ExternalLink
                                                href="https://github.com/HirokiHamaguchi/latexlint/tree/master"
                                                icon="mark-github-24.svg"
                                            >
                                                GitHub Repository
                                            </ExternalLink>
                                            <ExternalLink
                                                href="https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint"
                                                icon="Visual_Studio_Code_1.35_icon.svg"
                                            >
                                                Marketplace of VS Code Extension
                                            </ExternalLink>
                                        </HStack>
                                    </VStack>

                                    <VStack gap={3} align="stretch">
                                        <Heading size="md">Sample - Before and After</Heading>
                                        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                                            <SampleImage src="sample_before.png" alt="Before" color="red.600" />
                                            <SampleImage src="sample_after.png" alt="After" color="green.600" />
                                        </Grid>
                                    </VStack>
                                </VStack>
                            </Tabs.Content>

                            <Tabs.Content value="readme" pt={4}>
                                <div className="markdown-body" ref={readmeRef}>
                                    <Markdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            img: ({ ...props }) => (
                                                <img
                                                    {...props}
                                                    src={props.src?.startsWith('http') ? props.src : `${GITHUB_RAW_BASE}${props.src}`}
                                                />
                                            ),
                                        }}
                                    >
                                        {readmeContent}
                                    </Markdown>
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value="japanese" pt={4}>
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
                                        また、この表自体に誤りがある場合、
                                        <Link href="https://github.com/HirokiHamaguchi/latexlint/issues" target="_blank" rel="noopener noreferrer" color="blue.500" textDecoration="underline">
                                            フィードバック
                                        </Link>
                                        をいただけると幸いです。
                                    </Text>
                                    <Table.Root size="sm" variant="outline">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader>誤</Table.ColumnHeader>
                                                <Table.ColumnHeader>正</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {vocabularyData.entries.map((entry, index) => (
                                                <Table.Row key={index}>
                                                    <Table.Cell>{entry.no}</Table.Cell>
                                                    <Table.Cell>{entry.yes}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                </VStack>
                            </Tabs.Content>
                        </Tabs.Root>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button onClick={onClose} colorScheme="blue">
                            Close
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}
