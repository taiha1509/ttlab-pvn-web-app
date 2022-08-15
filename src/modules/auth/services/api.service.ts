import { BaseService } from '@/utils/api';
import service from '@/plugins/axios';
import {
    IVerifyEmailInvitationForm,
    IDataLoginResponse,
    ILoginForm,
    IUpdatePassword,
    IUpdateProfile,
    IVerifyToken,
} from '../types';
import { IBodyResponse } from '@/modules/common/types';
import { IUserDetailReponse } from '@/modules/user/types';

class AuthApiService extends BaseService {
    async login(data: ILoginForm) {
        return (await this.client.post<IDataLoginResponse>(
            'login',
            {
                credential: data.credential.trim(),
                password: data.password,
            },
            {
                baseURL: this.baseUrl,
            },
        )) as IBodyResponse<IDataLoginResponse>;
    }

    async logout() {
        return await this.client.post('logout', {}, { baseURL: this.baseUrl });
    }

    async forgotPassword(value: string) {
        return (await this.client.post(
            'forgot-password',
            { email: value },
            { baseURL: this.baseUrl },
        )) as IBodyResponse<void>;
    }

    async resetPassword(value: Record<string, string>) {
        return (await this.client.post('reset-password', value, {
            baseURL: this.baseUrl,
        })) as IBodyResponse<void>;
    }

    async verifyEmailInvitation(data: IVerifyEmailInvitationForm) {
        return (await this.client.post(
            'verify-email-invitation',
            { token: data.token },
            { baseURL: this.baseUrl },
        )) as IBodyResponse<void>;
    }

    async resendEmailInvitation(userId: number) {
        return (await this.client.post(
            'resend-email-invitation',
            { userId },
            { baseURL: this.baseUrl },
        )) as IBodyResponse<void>;
    }

    async getProfile() {
        return (await this.client.get('profile', {
            baseURL: this.baseUrl,
        })) as IBodyResponse<IUserDetailReponse>;
    }

    async updatePassword(data: IUpdatePassword): Promise<IBodyResponse<void>> {
        return await this.client.patch(
            'password',
            { oldPassword: data.oldPassword, newPassword: data.newPassword },
            { baseURL: this.baseUrl },
        );
    }

    async updateProfile(
        data: IUpdateProfile,
    ): Promise<IBodyResponse<IUserDetailReponse>> {
        return await this.client.patch(
            'profile',
            {
                ...data,
            },
            {
                baseURL: this.baseUrl,
            },
        );
    }

    async verifyToken(data: IVerifyToken) {
        return (await this.client.post('verify-token', data, {
            baseURL: this.baseUrl,
        })) as IBodyResponse<null>;
    }
}

export const authApiService = new AuthApiService(
    {
        baseUrl: `${process.env.VUE_APP_IAM_API_URL}/auth`,
    },
    service,
);
