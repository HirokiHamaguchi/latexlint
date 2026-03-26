import { Box, Button, HStack } from '@chakra-ui/react';
import type { DocType } from '../../types';

type DocTypeSwitchProps = {
    docType: DocType;
    onChange: (docType: DocType) => void;
};

export function DocTypeSwitch({ docType, onChange }: DocTypeSwitchProps) {
    // gap={1} in Chakra corresponds to 4px; keep in sync with HStack gap below
    const GAP_PX = 4;
    const indicatorWidth = `calc((100% - ${GAP_PX}px) / 2)`;
    const indicatorTransform =
        docType === 'latex'
            ? 'translateX(0)'
            : `translateX(calc(${indicatorWidth} + ${GAP_PX}px))`;

    return (
        <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="full"
            bg="white"
            p={1}
            flexShrink={0}
            ml="auto"
        >
            <HStack gap={1} position="relative">
                <Box
                    position="absolute"
                    insetBlock="0"
                    insetInlineStart="0"
                    width={indicatorWidth}
                    borderRadius="full"
                    bg="blue.500"
                    transform={indicatorTransform}
                    transition="transform 180ms ease"
                    pointerEvents="none"
                />
                <Button
                    size="sm"
                    borderRadius="full"
                    variant="ghost"
                    flex="1"
                    zIndex={1}
                    color={docType === 'latex' ? 'white' : 'gray.700'}
                    _hover={{ bg: 'transparent' }}
                    _active={{ bg: 'transparent' }}
                    onClick={() => onChange('latex')}
                >
                    LaTeX
                </Button>
                <Button
                    size="sm"
                    borderRadius="full"
                    variant="ghost"
                    flex="1"
                    zIndex={1}
                    color={docType === 'markdown' ? 'white' : 'gray.700'}
                    _hover={{ bg: 'transparent' }}
                    _active={{ bg: 'transparent' }}
                    onClick={() => onChange('markdown')}
                >
                    Markdown
                </Button>
            </HStack>
        </Box>
    );
}
