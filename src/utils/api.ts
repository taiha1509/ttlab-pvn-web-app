import { AxiosInstance, AxiosPromise } from 'axios';
import { IBodyResponse, IServiceOption, IGetListParams } from '@/modules/common/types';

export class BaseService {
    client: AxiosInstance;
    baseUrl: string;

    constructor(params: IServiceOption, axios: AxiosInstance) {
        this.client = axios;
        this.baseUrl = params.baseUrl;
    }

    get detailUrl(): string {
        return this.baseUrl;
    }

    get createUrl(): string {
        return this.baseUrl;
    }

    get updateUrl(): string {
        return this.baseUrl;
    }

    get deleteUrl(): string {
        return this.baseUrl;
    }

    useClient(axios: AxiosInstance): void {
        this.client = axios;
    }

    beforeCreate<P>(params: P): P {
        return params;
    }

    beforeUpdate<P>(params: P): P {
        return params;
    }

    beforeSave<P>(params: P): P {
        return params;
    }

    getList<P, R extends IBodyResponse<R>>(params: P | IGetListParams): AxiosPromise {
        return this.client.get<R, R>(this.baseUrl, { params });
    }

    getDetail<R extends IBodyResponse<R>>(id: number | string): AxiosPromise {
        return this.client.get<R, R>(this.detailUrl + '/' + id);
    }

    create<P, R extends IBodyResponse<R>>(params: P): AxiosPromise {
        params = this.beforeSave<P>(params);
        params = this.beforeCreate<P>(params);
        return this.client.post<R, R>(this.createUrl, params);
    }

    update<P, R extends IBodyResponse<R>>(id: number | string, params: P): AxiosPromise {
        params = this.beforeSave<P>(params);
        params = this.beforeUpdate<P>(params);
        return this.client.patch<R, R>(this.updateUrl + '/' + id, params);
    }

    delete<R extends IBodyResponse<R>>(id: number | string): AxiosPromise {
        return this.client.delete<R, R>(this.deleteUrl + '/' + id);
    }
}
