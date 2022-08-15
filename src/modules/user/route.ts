import { RouteRecordRaw } from 'vue-router';
import UserListPage from './pages/UserListPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '../common/constants';
import { PermissionActions, PermissionResources } from '../role/role.constant';

export default [
    {
        path: '/user',
        component: MainLayout,
        meta: {
            public: false,
            onlyWhenLoggedOut: false,
        },
        children: [
            {
                path: '',
                component: UserListPage,
                name: PageName.USER_PAGE,
                meta: {
                    name: PageName.USER_PAGE,
                    onlyWhenLoggedOut: false,
                    public: false,
                    requiredPermissions: [
                        `${PermissionResources.USER}_${PermissionActions.READ}`,
                        `${PermissionResources.USER}_${PermissionActions.CREATE}`,
                        `${PermissionResources.USER}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.USER}_${PermissionActions.DELETE}`,
                        `${PermissionResources.USER}_${PermissionActions.INVITE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
