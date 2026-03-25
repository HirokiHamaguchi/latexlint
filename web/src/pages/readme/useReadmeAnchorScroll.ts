import { useEffect } from 'react';
import {
    README_ANCHOR_SCROLL_DELAY_MS,
    README_SCROLL_TOP_OFFSET,
} from './constants';

export function useReadmeAnchorScroll(anchor: string | undefined, readmeRef: React.RefObject<HTMLDivElement | null>) {
    useEffect(() => {
        if (!anchor || !readmeRef.current) return;

        const timer = window.setTimeout(() => {
            if (!readmeRef.current) return;
            const element = readmeRef.current.querySelector(`#${anchor.toLowerCase()}`);
            if (!element) {
                console.warn(`Element with id ${anchor} not found in README.`);
                return;
            }

            const scrollToElement = () => {
                const offsetTop = (element as HTMLElement).getBoundingClientRect().top + window.scrollY - README_SCROLL_TOP_OFFSET;
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'auto',
                });
            };

            scrollToElement();
            readmeRef.current.querySelectorAll('img').forEach((img) => {
                if (!img.complete) img.addEventListener('load', scrollToElement, { once: true });
            });
        }, README_ANCHOR_SCROLL_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [anchor, readmeRef]);
}
