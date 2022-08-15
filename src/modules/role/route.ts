import { RouteRecordRaw } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '../common/constants';
import { PermissionActions, PermissionResources } from './role.constant';

export default [
    {
        path: '/role',
        component: MainLayout,
        meta: {
            public: false,
            onlyWhenLoggedOut: false,
        },
        children: [
            {
                path: '',
                component: () => import('./pages/RolePage.vue'),
                name: PageName.ROLE,
                meta: {
                    name: PageName.ROLE,
                    onlyWhenLoggedOut: false,
                    public: false,
                    requiredPermissions: [
                        `${PermissionResources.ROLE}_${PermissionActions.READ}`,
                        `${PermissionResources.ROLE}_${PermissionActions.CREATE}`,
                        `${PermissionResources.ROLE}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.ROLE}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
