import LoginPage from './pages/LoginPage.vue';
import ForgotPasswordPage from './pages/ForgotPasswordPage.vue';
import ResetPasswordPage from './pages/ResetPasswordPage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import VerifyEmailInvitationPage from './pages/VerifyEmailInvitationPage.vue';
import { PageName } from '../common/constants';
import { RouteRecordRaw } from 'vue-router';
import LoginLayout from '@/layouts/LoginLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

export default [
    {
        path: '',
        component: LoginLayout,
        children: [
            {
                path: '/login',
                name: PageName.LOGIN_PAGE,
                component: LoginPage,
                meta: {
                    onlyWhenLoggedOut: true,
                    public: true,
                },
            },
        ],
    },
    {
        path: '',
        component: LoginLayout,
        children: [
            {
                path: '/forgot-password',
                name: PageName.FORGOT_PASSWORD_PAGE,
                component: ForgotPasswordPage,
                meta: {
                    onlyWhenLoggedOut: true,
                    public: true,
                },
            },
        ],
    },
    {
        path: '',
        component: LoginLayout,
        children: [
            {
                path: '/reset-password',
                name: PageName.RESET_PASSWORD_PAGE,
                component: ResetPasswordPage,
                meta: {
                    onlyWhenLoggedOut: true,
                    public: true,
                },
            },
        ],
    },
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '/profile',
                name: PageName.PROFILE_PAGE,
                component: ProfilePage,
                meta: {
                    onlyWhenLoggedOut: false,
                    public: false,
                },
            },
        ],
    },
    {
        path: '/verify-email-invitation',
        component: LoginLayout,
        children: [
            {
                path: '',
                name: PageName.VERIFY_EMAIL_INVITATION_PAGE,
                component: VerifyEmailInvitationPage,
                meta: {
                    onlyWhenLoggedOut: false,
                    public: true,
                },
            },
        ],
    },
] as RouteRecordRaw[];
