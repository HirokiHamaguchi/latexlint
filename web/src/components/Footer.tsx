import {
    Box,
    HStack,
    Image,
    Link,
    Text,
    VStack
} from '@chakra-ui/react';

const BASE_URL = import.meta.env.BASE_URL;

const ExternalLink = ({ href, children, icon, roundIcon }: { href: string; children: React.ReactNode; icon: string; roundIcon?: boolean }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer">
        <HStack align="center" gap={2}>
            <Image src={`${BASE_URL}${icon}`} alt="" boxSize={roundIcon ? "1.4em" : "1.2em"} borderRadius={roundIcon ? "50%" : undefined} />
            <Text fontSize="sm">{children}</Text>
        </HStack>
    </Link>
);

export function Footer() {
    return (
        <Box
            as="footer"
            borderTop="1px solid"
            borderColor="gray.300"
            py={4}
            px={6}
            bg="gray.50"
        >
            <VStack gap={3}>
                <HStack gap={5} flexWrap="wrap" justifyContent="center">
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
                        VS Code Extension
                    </ExternalLink>
                    <ExternalLink
                        href="https://hirokihamaguchi.github.io/"
                        icon="profile.png"
                        roundIcon={true}
                    >
                        Developer's Website
                    </ExternalLink>
                </HStack>
                <Text fontSize="xs" color="gray.600">
                    © 2026 Hiroki Hamaguchi. All rights reserved.
                </Text>
            </VStack>
        </Box>
    );
}
