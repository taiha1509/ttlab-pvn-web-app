import { RouteRecordRaw } from 'vue-router';
import CameraGroupListPage from './pages/CameraGroupListPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '../common/constants';
import { PermissionActions, PermissionResources } from '../role/role.constant';

export default [
    {
        path: '/camera-group',
        component: MainLayout,
        meta: {
            public: false,
            onlyWhenLoggedOut: false,
            name: PageName.CAMERA_GROUP_PAGE,
        },
        children: [
            {
                path: '',
                component: CameraGroupListPage,
                name: PageName.CAMERA_GROUP_PAGE,
                meta: {
                    name: PageName.CAMERA_GROUP_PAGE,
                    onlyWhenLoggedOut: false,
                    public: false,
                    requiredPermissions: [
                        `${PermissionResources.CAMERA_GROUP}_${PermissionActions.READ}`,
                        `${PermissionResources.CAMERA_GROUP}_${PermissionActions.CREATE}`,
                        `${PermissionResources.CAMERA_GROUP}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.CAMERA_GROUP}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
