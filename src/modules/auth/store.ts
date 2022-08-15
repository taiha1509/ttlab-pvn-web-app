import { getModule, VuexModule, Action, Module, Mutation } from 'vuex-module-decorators';
import store from '@/store';
import { appService } from '@/utils/app';
import { ITokenOption } from '@/utils/token';
import { IVerifyEmailInvitationForm, ILoginForm, IVerifyToken } from './types';
import { authApiService } from './services/api.service';
import router from '@/router';
import { PageName, SupportLanguage } from '../common/constants';
import i18n from '@/plugins/vue-i18n';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { IUserDetailReponse } from '../user/types';
import { UserStatus } from '../user/constant';

const initUser: IUserDetailReponse = {
    id: 0,
    fullName: '',
    email: '',
    phoneNumber: '',
    username: '',
    roles: [],
    groups: [],
    types: [],
    groupUsers: [],
    status: UserStatus.ACTIVE,
    cameras: [],
    cameraGroups: [],
};
@Module({ dynamic: true, namespaced: true, store, name: 'auth' })
class AuthModule extends VuexModule {
    user: IUserDetailReponse = { ...initUser };
    profile: IUserDetailReponse = { ...initUser };
    showUpdatePasswordPopup = false;

    @Action({})
    setShowPasswordPopup(value: boolean) {
        this.MUTATE_SET_IS_SHOW_PASSWORD_POPUP(value);
    }

    @Action({})
    setProfile(value: IUserDetailReponse) {
        this.MUTATE_SET_PROFILE(value);
    }

    @Action({})
    setUser(value: IUserDetailReponse) {
        this.MUTATE_SET_USER(value);
    }

    @Action({})
    async getProfile() {
        const response = await authApiService.getProfile();
        if (response?.success) {
            this.setProfile(response.data);
        } else {
            this.setProfile({ ...initUser });
        }

        return response;
    }

    @Action
    async login(data: ILoginForm) {
        const response = await authApiService.login(data);
        if (response?.success) {
            appService.setUser(response?.data?.user || {});
            this.setUser(response?.data?.user || {});
            const token: ITokenOption = {
                accessToken: response.data?.accessToken?.token,
                refreshToken: response.data?.refreshToken.token,
                accessTokenExpiredAt: +response.data?.accessToken.expiredIn,
                refreshTokenExpiredAt: +response?.data?.refreshToken.expiredIn,
            };
            appService.setUserToken(token);
            if (!appService.getLang()) appService.setLang(SupportLanguage.EN);
            this.context.dispatch('setLoginUser', response.data?.user, {
                root: true,
            });
            router.push({
                name: PageName.CAMERA_PAGE,
            });
        } else if (!response?.isRequestError) {
            appService.token.resetAll();
            appService.resetUser();
            showErrorNotificationFunction(response.message);
        }
    }

    @Action({})
    async verifyEmailInvitation(data: IVerifyEmailInvitationForm) {
        const response = await authApiService.verifyEmailInvitation(data);
        if (response?.success) {
            router.push({
                name: PageName.LOGIN_PAGE,
            });
            showSuccessNotificationFunction(
                i18n.global.t('auth.auth.verifyEmailInvitation.success'),
            );
        } else if (!response?.isRequestError) {
            showErrorNotificationFunction(i18n.global.t(response.message));
        }
    }

    @Action
    async forgotPassword(value: string) {
        const response = await authApiService.forgotPassword(value);
        return response;
    }

    @Action
    async resetPassword(values: Record<string, string>) {
        const response = await authApiService.resetPassword(values);
        return response;
    }

    @Action
    async verifyToken(values: IVerifyToken) {
        const response = await authApiService.verifyToken(values);
        return response;
    }

    @Mutation
    MUTATE_SET_USER(value: IUserDetailReponse) {
        this.user = value;
    }

    @Mutation
    MUTATE_SET_PROFILE(value: IUserDetailReponse) {
        this.profile = value;
    }

    @Mutation
    MUTATE_SET_IS_SHOW_PASSWORD_POPUP(value: boolean) {
        this.showUpdatePasswordPopup = value;
    }
}

export const authModule = getModule(AuthModule);
