import { RouteRecordRaw } from 'vue-router';
import UserGroupPage from './pages/GroupUserListPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '../common/constants';
import { PermissionActions, PermissionResources } from '../role/role.constant';

export default [
    {
        path: '/user-group',
        component: MainLayout,
        meta: {
            public: false,
            onlyWhenLoggedOut: false,
        },
        children: [
            {
                path: '',
                component: UserGroupPage,
                name: PageName.GROUP_USER_PAGE,
                meta: {
                    name: PageName.GROUP_USER_PAGE,
                    onlyWhenLoggedOut: false,
                    public: false,
                    requiredPermissions: [
                        `${PermissionResources.USER_GROUP}_${PermissionActions.READ}`,
                        `${PermissionResources.USER_GROUP}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.USER_GROUP}_${PermissionActions.CREATE}`,
                        `${PermissionResources.USER_GROUP}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
