import { Box, HStack, Image, Text } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS, ROUTES } from '../constants/routes';

export function TopNavHeader() {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === ROUTES.README) {
            return location.pathname === ROUTES.README || location.pathname.startsWith(`${ROUTES.README}/`);
        }
        return location.pathname === path;
    };

    return (
        <Box
            as="nav"
            aria-label="Primary page navigation"
            position="sticky"
            top={0}
            zIndex="sticky"
            bg="whiteAlpha.900"
            borderBottomWidth="1px"
            borderColor="gray.200"
            py={1}
            px={4}
            backdropFilter="blur(8px)"
            width="100%"
        >
            <HStack
                gap={4}
                justify="flex-start"
                flexWrap="nowrap"
                overflowX="auto"
                whiteSpace="nowrap"
                py={1}
                css={{
                    scrollbarWidth: 'thin',
                }}
            >
                {/* Logo + LaTeX Lint */}
                <RouterLink to={ROUTES.HOME} aria-label="Go to Home">
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        flexShrink={0}
                    >
                        <Image
                            src="lintIconLight_copied.svg"
                            alt="LaTeX Lint Icon"
                            boxSize="1.5rem"
                        />
                        <Text fontWeight="semibold" fontFamily="Times New Roman, serif">
                            LaTeX Lint
                        </Text>
                    </Box>
                </RouterLink>

                {/* Divider */}
                <Box
                    width="1px"
                    height="1.5rem"
                    bg="gray.300"
                    flexShrink={0}
                />

                {/* Nav items */}
                {NAV_ITEMS.map((item) => (
                    <Box
                        key={item.path}
                        asChild
                        flexShrink={0}
                        borderRadius="md"
                        px={3}
                        py={1.5}
                        fontSize="sm"
                        fontWeight={isActive(item.path) ? 'semibold' : 'medium'}
                        bg={isActive(item.path) ? 'blue.50' : 'transparent'}
                        color={isActive(item.path) ? 'blue.700' : 'gray.700'}
                        borderWidth="1px"
                        borderColor={isActive(item.path) ? 'blue.200' : 'transparent'}
                        _hover={{
                            textDecoration: 'none',
                            bg: isActive(item.path) ? 'blue.50' : 'gray.100',
                        }}
                        transition="all 0.2s"
                    >
                        <RouterLink to={item.path}>{item.label}</RouterLink>
                    </Box>
                ))}
            </HStack>
        </Box>
    );
}
