import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
    {
        navCap: 'Home',
    },
    {
        displayName: 'Dashboard',
        iconName: 'solar:atom-line-duotone',
        route: '/dashboard',
    },

    {
        navCap: 'Ui Components',
    },
    {
        displayName: 'Badge',
        iconName: 'solar:archive-minimalistic-line-duotone',
        route: '/ui-components/badge',
    },
    {
        displayName: 'Chips',
        iconName: 'solar:danger-circle-line-duotone',
        route: '/ui-components/chips',
    },
    {
        displayName: 'Lists',
        iconName: 'solar:bookmark-square-minimalistic-line-duotone',
        route: '/ui-components/lists',
    },
    {
        displayName: 'Menu',
        iconName: 'solar:file-text-line-duotone',
        route: '/ui-components/menu',
    },
    {
        displayName: 'Tooltips',
        iconName: 'solar:text-field-focus-line-duotone',
        route: '/ui-components/tooltips',
    },

    {
        navCap: 'Pages',
    },
    {
        displayName: 'Forms',
        iconName: 'solar:file-text-line-duotone',
        route: '/ui-components/forms',
    },
    {
        displayName: 'Tables',
        iconName: 'solar:tablet-line-duotone',
        route: '/ui-components/tables',
    },

    {
        navCap: 'Extra',
    },
    {
        displayName: 'Icons',
        iconName: 'solar:sticker-smile-circle-2-line-duotone',
        route: '/extra/icons',
    },
    {
        displayName: 'Sample Page',
        iconName: 'solar:planet-3-line-duotone',
        route: '/extra/sample-page',
    },

    {
        navCap: 'Auth',
    },
    {
        displayName: 'Login',
        iconName: 'solar:login-2-linear',
        route: 'authentication',
        children: [
            {
                displayName: 'Boxed Login',
                iconName: 'tabler:point',
                route: '/authentication/login',
            },
        ],
    },
    {
        displayName: 'Register',
        iconName: 'solar:user-plus-linear',
        route: 'authentication',
        children: [
            {
                displayName: 'Boxed Register',
                iconName: 'tabler:point',
                route: '/authentication/register',
            },
        ],
    },
];
