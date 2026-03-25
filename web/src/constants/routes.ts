export const ROUTES = {
    HOME: '/',
    README: '/readme',
    OTHER: '/other',
} as const;

export const NAV_ITEMS = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'README', path: ROUTES.README },
    { label: 'Other', path: ROUTES.OTHER },
] as const;
