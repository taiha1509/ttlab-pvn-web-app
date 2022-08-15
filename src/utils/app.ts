import { ITokenOption, TokenService } from './token';
import { Storage } from './storage';
import { isStringify } from './util';
import { IUserDetailReponse } from '@/modules/user/types';
import { PermissionActions, PermissionResources } from '@/modules/role/role.constant';
import _ from 'lodash';

export enum AppEnum {
    USER = 'USER',
    LANG = 'LANG',
}

export const defaultLang = 'en';

class AppService {
    token: TokenService;
    storage: Storage;

    constructor() {
        this.token = new TokenService();
        this.storage = new Storage();
    }

    get currentAppLang() {
        return this.getLang() ? this.getLang() : defaultLang;
    }

    setUser<T extends IUserDetailReponse>(
        user: T | Record<string, unknown> | IUserDetailReponse,
    ): void {
        if (!isStringify(user)) {
            return;
        }
        this.storage.setLocalStorage(AppEnum.USER, JSON.stringify(user));
    }

    setUserToken(option: ITokenOption) {
        this.token.setAccessToken(option.accessToken);
        this.token.setRefreshToken(option.refreshToken);
        this.token.setAccessTokenExpiredAt(option.accessTokenExpiredAt);
        this.token.setRefreshTokenExpiredAt(option.refreshTokenExpiredAt);
    }

    getTokenOption(): ITokenOption {
        return {
            accessToken: this.token.getAccessToken(),
            refreshToken: this.token.getRefreshToken(),
            accessTokenExpiredAt: this.token.getAccessTokenExpiredAt(),
            refreshTokenExpiredAt: this.token.getRefreshTokenExpiredAt(),
        };
    }

    getUser<T extends IUserDetailReponse>(): T {
        return this.storage.getObjectFromKey(AppEnum.USER) as T;
    }

    resetUser() {
        this.setUser({});
    }

    resetAll() {
        this.token.resetAll();
        this.resetUser();
        this.resetLang();
    }

    getLang() {
        return this.storage.getLocaleStorage(AppEnum.LANG);
    }

    setLang(value: string) {
        return this.storage.setLocalStorage(AppEnum.LANG, value);
    }

    resetLang() {
        this.setLang(defaultLang);
    }

    getUserPermissionsByResource(resource: PermissionResources): PermissionActions[] {
        const permissionsList = this.getUser().roles?.map((role) => role.permissions);
        return _.uniq(_.flatten(permissionsList))
            .filter((item) => item.resource.content === resource)
            .map((item) => item.action.content);
    }
}

export const appService = new AppService();
