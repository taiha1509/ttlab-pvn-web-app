import { RouteRecordRaw } from 'vue-router';
import ErrorLayout from '@/layouts/ErrorLayout.vue';
import ErrorPage from './pages/ErrorPage.vue';
import { PageName } from './constants';

export default [
    {
        path: '/error',
        component: ErrorLayout,
        children: [
            {
                path: '/error/404',
                name: PageName.ERROR_404_PAGE,
                component: ErrorPage,
                meta: {
                    requiresAuth: false,
                    public: true,
                    message: 'common.app.notFound',
                    code: 404,
                },
            },
            {
                path: '/error/403',
                name: PageName.ERROR_403_PAGE,
                component: ErrorPage,
                meta: {
                    requiresAuth: true,
                    public: false,
                    message: 'common.app.forbidden',
                    code: 403,
                },
            },
        ],
    },
] as RouteRecordRaw[];
