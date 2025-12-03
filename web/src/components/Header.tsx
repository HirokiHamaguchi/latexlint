import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Link,
    Image,
    Button,
    SegmentGroup,
} from '@chakra-ui/react';
import { DocType } from '../types';

interface HeaderProps {
    docType: DocType;
    onDocTypeChange: (type: DocType) => void;
    onAboutClick: () => void;
}

export function Header({ docType, onDocTypeChange, onAboutClick }: HeaderProps) {
    return (
        <Box textAlign="center" as="header">
            <VStack justify="center" align="center" mb={4}>
                <Link href={import.meta.env.BASE_URL} _hover={{ textDecoration: 'none' }}>
                    <HStack align="center">
                        <Image
                            src="lintIconLight_copied.svg"
                            alt="LaTeX Lint Icon"
                            boxSize="1.8em"
                            mr={2}
                        />
                        <Heading as="h1" size="2xl" color="#333333" _hover={{ color: 'blue.600' }} transition="color 0.2s">
                            <Text fontFamily="Times New Roman, serif">LaTeX Lint</Text>
                        </Heading>
                    </HStack>
                </Link>
                <Text fontSize="lg" color="gray.500">
                    Online LaTeX Code Checker
                </Text>
            </VStack>

            <HStack justify="center" gap={6} flexWrap="wrap" fontSize="sm" as="nav" aria-label="Main navigation">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAboutClick}
                >
                    <HStack align="center" gap={1}>
                        <Text>About</Text>
                    </HStack>
                </Button>
                <SegmentGroup.Root
                    value={docType}
                    onValueChange={(e) => onDocTypeChange(e.value as DocType)}
                    size="sm"
                >
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Item value="latex" cursor="pointer">
                        <SegmentGroup.ItemHiddenInput />
                        <SegmentGroup.ItemText>LaTeX</SegmentGroup.ItemText>
                    </SegmentGroup.Item>
                    <SegmentGroup.Item value="markdown" cursor="pointer">
                        <SegmentGroup.ItemHiddenInput />
                        <SegmentGroup.ItemText>Markdown</SegmentGroup.ItemText>
                    </SegmentGroup.Item>
                </SegmentGroup.Root>
            </HStack>
        </Box>
    );
}