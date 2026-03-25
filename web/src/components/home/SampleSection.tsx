import { Grid, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { BASE_URL } from '../../constants/app';
import { SectionHeading } from '../typography/SectionHeading';

type SampleImageProps = {
    src: string;
    alt: string;
    color: string;
};

function SampleImage({ src, alt, color }: SampleImageProps) {
    return (
        <VStack>
            <Heading size="sm" color={color}>{alt}</Heading>
            <Image
                src={`${BASE_URL}${src}`}
                alt={alt}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.300"
                maxW="100%"
                h="auto"
            />
        </VStack>
    );
}

export function SampleSection() {
    return (
        <VStack align="stretch">
            <SectionHeading>Sample</SectionHeading>
            <Text color="gray.600">
                The samples before and after linting are shown below. LaTeX Lint is designed to prevent potential mistakes and ensure correct mathematical rendering.
            </Text>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                <SampleImage src="sample_before.png" alt="Before" color="red.600" />
                <SampleImage src="sample_after.png" alt="After" color="green.600" />
            </Grid>
        </VStack>
    );
}
