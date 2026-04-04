import Markdown from 'react-markdown';
import { Link as RouterLink } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import { GITHUB_RAW_BASE } from './constants';

type ReadmeMarkdownProps = {
    content: string;
};

export function ReadmeMarkdown({ content }: ReadmeMarkdownProps) {
    return (
        <Markdown
            // @ts-expect-error: Type '() => void | Transformer<Root, Root>' is not assignable to type 'Pluggable'.
            remarkPlugins={[remarkGfm, remarkSlug]}
            rehypePlugins={[rehypeRaw]}
            components={{
                a: ({ href, children, ...props }) => {
                    if (href?.startsWith('#')) {
                        return <RouterLink {...props} to={`/readme/${href.slice(1)}`}>{children}</RouterLink>;
                    }

                    return <a {...props} href={href}>{children}</a>;
                },
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
            {content}
        </Markdown>
    );
}
