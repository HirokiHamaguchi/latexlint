import {
    Box,
    HStack,
    Image,
    Link,
    Text,
    VStack
} from '@chakra-ui/react';

const BASE_URL = import.meta.env.BASE_URL;

type FooterLinkItem = {
    href: string;
    icon: string;
    label: string;
    roundIcon?: boolean;
};

const FOOTER_LINKS: FooterLinkItem[] = [
    {
        href: 'https://github.com/HirokiHamaguchi/latexlint/tree/master',
        icon: 'mark-github-24.svg',
        label: 'GitHub Repository',
    },
    {
        href: 'https://marketplace.visualstudio.com/items?itemName=hari64boli64.latexlint',
        icon: 'Visual_Studio_Code_1.35_icon.svg',
        label: 'VS Code Extension',
    },
    {
        href: 'https://hirokihamaguchi.github.io/',
        icon: 'profile_icon256.webp',
        label: "Developer's Website",
        roundIcon: true,
    },
];

const ExternalLink = ({ href, children, icon, roundIcon }: { href: string; children: React.ReactNode; icon: string; roundIcon?: boolean }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer">
        <HStack align="center" gap={2}>
            <Image src={`${BASE_URL}${icon}`} alt="" boxSize="1.8em" borderRadius={roundIcon ? "full" : undefined} />
            <Text fontSize="sm">{children}</Text>
        </HStack>
    </Link>
);

export function Footer() {
    return (
        <Box
            as="footer"
            py={4}
            px={6}
        >
            <VStack gap={3}>
                <HStack gap={5} flexWrap="wrap" justifyContent="center">
                    {FOOTER_LINKS.map((link) => (
                        <ExternalLink
                            key={link.href}
                            href={link.href}
                            icon={link.icon}
                            roundIcon={link.roundIcon}
                        >
                            {link.label}
                        </ExternalLink>
                    ))}
                </HStack>
                <Text fontSize="xs" color="gray.600">
                    © 2026 Hiroki Hamaguchi. All rights reserved.
                </Text>
            </VStack>
        </Box>
    );
}
