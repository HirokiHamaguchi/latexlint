import { HStack, Heading, Image, Text, VStack } from '@chakra-ui/react';

export function MainHero() {
    return (
        <VStack justify="center" align="center" mb={4}>
            <HStack align="center">
                <Image
                    src="lintIconLight_copied.svg"
                    alt="LaTeX Lint Icon"
                    boxSize="2.5em"
                    mr={2}
                />
                <Heading as="h1" size="3xl" color="#333333">
                    <Text fontFamily="Times New Roman, serif">LaTeX Lint</Text>
                </Heading>
            </HStack>
            <Text fontSize="lg" color="gray.500">
                Online LaTeX Code Checker
            </Text>
        </VStack>
    );
}
