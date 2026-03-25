import { Heading, type HeadingProps } from '@chakra-ui/react';

type SectionHeadingProps = HeadingProps;

export function SectionHeading(props: SectionHeadingProps) {
    return (
        <Heading
            as="h2"
            fontWeight="600"
            paddingBottom=".3em"
            fontSize="1.5em"
            marginTop="1.5rem"
            marginBottom="1rem"
            lineHeight="1.25"
            borderBottom="1px solid #d1d9e0b3"
            {...props}
        />
    );
}
