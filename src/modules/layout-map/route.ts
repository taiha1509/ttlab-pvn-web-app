import { RouteRecordRaw } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '../common/constants';
import { PermissionActions, PermissionResources } from '../role/role.constant';

export default [
    {
        path: '/layout-map',
        component: MainLayout,
        meta: {
            public: true,
            onlyWhenLoggedOut: false,
        },
        children: [
            {
                path: '',
                component: () => import('./pages/LayoutMapPage.vue'),
                name: PageName.LAYOUT_MAP_PAGE,
                meta: {
                    name: PageName.LAYOUT_MAP_PAGE,
                    onlyWhenLoggedOut: false,
                    public: false,
                    requiredPermissions: [
                        `${PermissionResources.E_MAP}_${PermissionActions.READ}`,
                        `${PermissionResources.E_MAP}_${PermissionActions.CREATE}`,
                        `${PermissionResources.E_MAP}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.E_MAP}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
