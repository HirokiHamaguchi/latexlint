import {
    Box,
} from '@chakra-ui/react';
import 'github-markdown-css/github-markdown-light.css';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import readmeContent from '../assets/README.md?raw';
import { PageLayout } from '../components/layout/PageLayout';
import { ReadmeMarkdown } from './readme/ReadmeMarkdown';
import { useReadmeAnchorScroll } from './readme/useReadmeAnchorScroll';

export function ReadmePage() {
    const readmeRef = useRef<HTMLDivElement>(null);
    const params = useParams<{ anchor?: string }>();
    useReadmeAnchorScroll(params.anchor, readmeRef);

    return (
        <PageLayout>
            <Box className="markdown-body" ref={readmeRef}>
                <ReadmeMarkdown content={readmeContent} />
            </Box>
        </PageLayout>
    );
}
