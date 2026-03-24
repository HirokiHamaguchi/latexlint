import {
    Container,
    VStack,
} from '@chakra-ui/react';
import 'github-markdown-css/github-markdown-light.css';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import readmeContent from '../assets/README.md?raw';
import { Footer } from '../components/Footer';
import { TopNavHeader } from '../components/TopNavHeader';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/HirokiHamaguchi/latexlint/master/';

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

export function ReadmePage() {
    const readmeRef = useRef<HTMLDivElement>(null);
    const params = useParams<{ anchor?: string }>();

    useEffect(() => {
        const anchor = params.anchor;
        if (!anchor || !readmeRef.current) return;

        const timer = window.setTimeout(() => {
            if (!readmeRef.current) return;
            const element = readmeRef.current.querySelector(`#${anchor.toLowerCase()}`);
            if (!element) {
                console.warn(`Element with id ${anchor} not found in README.`);
                return;
            }

            const scrollToElement = () => {
                const offsetTop = (element as HTMLElement).getBoundingClientRect().top + window.scrollY - 120;
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'auto'
                });
            };

            scrollToElement();
            readmeRef.current.querySelectorAll('img').forEach((img) => {
                if (!img.complete) img.addEventListener('load', scrollToElement, { once: true });
            });
        }, 10);

        return () => window.clearTimeout(timer);
    }, [params.anchor]);

    return (
        <PageShell>
            <div className="markdown-body" ref={readmeRef}>
                <Markdown
                    // @ts-expect-error: Type '() => void | Transformer<Root, Root>' is not assignable to type 'Pluggable'.
                    remarkPlugins={[remarkGfm, remarkSlug]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        img: ({ src, ...props }) => {
                            const resolvedSrc = src?.startsWith('http') ? src : `${GITHUB_RAW_BASE}${src}`;
                            if ('width' in props) return <img {...props} src={resolvedSrc} />;
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
            </div>
        </PageShell>
    );
}
