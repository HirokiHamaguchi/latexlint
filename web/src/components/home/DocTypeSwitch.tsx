import { Box, Button, HStack } from '@chakra-ui/react';
import type { DocType } from '../../types';

type DocTypeSwitchProps = {
    docType: DocType;
    onChange: (docType: DocType) => void;
};

export function DocTypeSwitch({ docType, onChange }: DocTypeSwitchProps) {
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
            <HStack gap={1}>
                <Button
                    size="sm"
                    borderRadius="full"
                    variant={docType === 'latex' ? 'solid' : 'ghost'}
                    colorPalette={docType === 'latex' ? 'blue' : 'gray'}
                    onClick={() => onChange('latex')}
                >
                    LaTeX
                </Button>
                <Button
                    size="sm"
                    borderRadius="full"
                    variant={docType === 'markdown' ? 'solid' : 'ghost'}
                    colorPalette={docType === 'markdown' ? 'blue' : 'gray'}
                    onClick={() => onChange('markdown')}
                >
                    Markdown
                </Button>
            </HStack>
        </Box>
    );
}
