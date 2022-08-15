import { RouteRecordRaw } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '../common/constants';
import { PermissionActions, PermissionResources } from '../role/role.constant';

export default [
    {
        path: '/playback',
        component: MainLayout,
        meta: {
            public: false,
            onlyWhenLoggedOut: false,
        },
        children: [
            {
                path: '',
                component: () => import('./pages/PlaybackPage.vue'),
                name: PageName.PLAYBACK_PAGE,
                meta: {
                    name: PageName.PLAYBACK_PAGE,
                    onlyWhenLoggedOut: false,
                    public: false,
                    requiredPermissions: [
                        `${PermissionResources.PLAYBACK}_${PermissionActions.READ}`,
                        `${PermissionResources.PLAYBACK}_${PermissionActions.CREATE}`,
                        `${PermissionResources.PLAYBACK}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.PLAYBACK}_${PermissionActions.DELETE}`,
                    ],
                },
            },
            {
                path: ':id',
                component: () => import('./pages/PlaybackDetailPage.vue'),
                name: PageName.PLAYBACK_DETAIL_PAGE,
                meta: {
                    name: PageName.PLAYBACK_DETAIL_PAGE,
                    onlyWhenLoggedOut: false,
                    public: false,
                    requiredPermissions: [
                        `${PermissionResources.PLAYBACK}_${PermissionActions.READ}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
