import { Box, Button, HStack } from '@chakra-ui/react';
import type { DocType } from '../../types';

type DocTypeSwitchProps = {
    docType: DocType;
    onChange: (docType: DocType) => void;
};

export function DocTypeSwitch({ docType, onChange }: DocTypeSwitchProps) {
    const toggleDocType = () => {
        onChange(docType === 'latex' ? 'markdown' : 'latex');
    };

    return (
        <Button
            type="button"
            aria-label={`Current document type: ${docType}. Click to switch.`}
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="full"
            bg="white"
            p={1}
            flexShrink={0}
            ml="auto"
            onClick={toggleDocType}
            cursor="pointer"
            variant="plain"
            h="auto"
            minW="auto"
            _hover={{ bg: 'gray.50' }}
            _active={{ bg: 'gray.100' }}
        >
            <HStack gap={1} pointerEvents="none">
                <Box
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="medium"
                    bg={docType === 'latex' ? '#2563eb' : 'transparent'}
                    color={docType === 'latex' ? 'white' : 'gray.700'}
                    transition="background-color 0.3s, color 0.3s"
                >
                    LaTeX
                </Box>
                <Box
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="medium"
                    bg={docType === 'markdown' ? '#2563eb' : 'transparent'}
                    color={docType === 'markdown' ? 'white' : 'gray.700'}
                    transition="background-color 0.3s, color 0.3s"
                >
                    Markdown
                </Box>
            </HStack>
        </Button>
    );
}
