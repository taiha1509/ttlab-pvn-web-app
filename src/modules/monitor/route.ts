import { RouteRecordRaw } from 'vue-router';
import MonitorListPage from './pages/MonitorListPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '../common/constants';
import { PermissionActions, PermissionResources } from '../role/role.constant';

export default [
    {
        path: '',
        component: MainLayout,
        meta: {
            public: false,
            onlyWhenLoggedOut: false,
        },
        children: [
            {
                path: '/liveview',
                component: MonitorListPage,
                name: PageName.MONITOR_PAGE,
                meta: {
                    name: PageName.MONITOR_PAGE,
                    onlyWhenLoggedOut: false,
                    public: false,
                    requiredPermissions: [
                        `${PermissionResources.LIVEVIEW}_${PermissionActions.READ}`,
                        `${PermissionResources.LIVEVIEW}_${PermissionActions.CREATE}`,
                        `${PermissionResources.LIVEVIEW}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.LIVEVIEW}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
