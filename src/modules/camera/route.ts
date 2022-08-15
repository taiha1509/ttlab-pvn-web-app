import { RouteRecordRaw } from 'vue-router';
import CameraListPage from './pages/CameraListPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '../common/constants';
import { PermissionActions, PermissionResources } from '../role/role.constant';

export default [
    {
        path: '/camera',
        component: MainLayout,
        meta: {
            public: false,
            onlyWhenLoggedOut: false,
            name: PageName.CAMERA_PAGE,
        },
        children: [
            {
                path: '',
                component: CameraListPage,
                name: PageName.CAMERA_PAGE,
                meta: {
                    name: PageName.CAMERA_PAGE,
                    onlyWhenLoggedOut: false,
                    public: false,
                    requiredPermissions: [
                        `${PermissionResources.CAMERA}_${PermissionActions.READ}`,
                        `${PermissionResources.CAMERA}_${PermissionActions.CREATE}`,
                        `${PermissionResources.CAMERA}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.CAMERA}_${PermissionActions.DELETE}`,
                        `${PermissionResources.CAMERA}_${PermissionActions.CONFIG}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
