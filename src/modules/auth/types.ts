import { IUserDetailReponse } from '../user/types';

export interface Token {
    token: string;
    expiresIn: number;
}

export interface IDataLoginResponse {
    user: IUserDetailReponse;
    accessToken: {
        token: string;
        expiredIn: string;
    };
    refreshToken: {
        token: string;
        expiredIn: string;
    };
}

export interface IRefreshTokenResponse {
    data: {
        code: number;
        data: {
            accessToken: {
                token: string;
                expiredIn: string;
            };
            refreshToken: {
                token: string;
                expiredIn: string;
            };
            user: IUserDetailReponse;
        };
    };
}

export interface ILoginForm {
    credential: string;
    password: string;
    isRemember?: boolean;
}
export interface IVerifyEmailInvitationForm {
    token: string;
}

export interface IUpdateProfile {
    fullName: string | null;
    phoneNumber?: string | null;
}

export interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IVerifyToken {
    token: string;
    type: string;
}

export interface IYupError {
    i18nKey?: string;
    message?: string;
    params?: Record<string, string>;
}
