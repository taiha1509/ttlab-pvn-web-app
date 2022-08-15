import { appService, defaultLang } from '@/utils/app';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpMiddleware } from './httpMiddleware';
import momentTimezone from 'moment-timezone';
import { appModule } from '../../../store/app';
import { HttpStatus } from '@/modules/common/constants';
import { IBodyResponse } from '@/modules/common/types';
import i18n from '@/plugins/vue-i18n';

export default class CommonMiddleware extends HttpMiddleware {
    async onRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        Object.assign(config, {
            headers: {
                ...config.headers,
                'accept-language': appService.getLang() || defaultLang,
                'Content-Type': 'application/json',
                'X-Timezone': momentTimezone().format('Z'),
                'X-Timezone-Name': momentTimezone.tz.guess(),
            },
        });
        return config;
    }

    onResponse(response: AxiosResponse): AxiosResponse {
        if (typeof response?.data === 'string') response.data = JSON.parse(response.data);
        response.data = {
            ...response?.data,
            success: true,
        };
        return response.data;
    }

    onResponseError(error: AxiosError): IBodyResponse<unknown> {
        if (error.response) {
            if (typeof error?.response?.data === 'string') {
                error.response.data = JSON.parse(error.response.data);
            }
            error.response.data = {
                ...(error?.response?.data || {}),
                success: false,
            };
            return error.response.data;
        } else if (error.request) {
            error.request.data = {
                ...(error?.request?.data || {}),
                success: false,
                isRequestError: true,
                message: error.message,
            };
            // show network error
            if (!appModule.isShowNetworkError) {
                appModule.SET_SHOW_NETWORK_ERROR(true);
            }
            return error.request?.data;
        }
        return {
            ...error,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            statusText: i18n.global.t('common.app.errors.system'),
            headers: {},
            success: false,
            message: i18n.global.t('common.app.errors.system'),
            data: undefined,
            code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
    }
}
