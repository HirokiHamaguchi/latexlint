import { Container, VStack } from '@chakra-ui/react';
import { Footer } from '../Footer';
import { TopNavHeader } from '../TopNavHeader';

type PageLayoutProps = {
    children: React.ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
    return (
        <>
            <TopNavHeader />
            <Container maxW="container.xl" py={8} as="main">
                <VStack gap={4} align="stretch">
                    {children}
                </VStack>
                <Footer />
            </Container>
        </>
    );
}
