import {
    ICameraDropdown,
    ICameraGroupDropdown,
    IRoleDropdown,
} from '@/modules/user/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { AxiosPromise } from 'axios';
import {
    IBodyResponse,
    IUserDropdownResponse,
    IUserGroupDropdownResponse,
    ICommonCameraListQuery,
    ICameraModelDropDown,
} from '../types';

class CommonApiService extends BaseService {
    getDropdownCameraGroupData<
        R extends IBodyResponse<IUserGroupDropdownResponse>,
    >(): AxiosPromise {
        return this.client.get<R, R>(this.baseUrl + '/camera-group');
    }

    async getDropdownCameraList(params: ICommonCameraListQuery) {
        return this.client.get(`${this.baseUrl}/camera`, {
            params,
        });
    }
}

class IAMDropdownService extends BaseService {
    getDropdownUserGroup(): Promise<IBodyResponse<IUserGroupDropdownResponse[]>> {
        return this.client.get(this.baseUrl + '/group');
    }

    getDropdownUser(): Promise<IBodyResponse<IUserDropdownResponse[]>> {
        return this.client.get(this.baseUrl + '/user');
    }

    getDropdownRole(): Promise<IBodyResponse<IRoleDropdown[]>> {
        return this.client.get(this.baseUrl + '/role');
    }
}

class CVMDropdownService extends BaseService {
    getDropdownCameras(): Promise<IBodyResponse<ICameraDropdown[]>> {
        return this.client.get(this.baseUrl + '/camera');
    }

    getDropdownCameraGroups(): Promise<IBodyResponse<ICameraGroupDropdown[]>> {
        return this.client.get(this.baseUrl + '/camera-group');
    }

    getDropdownCameraModels(): Promise<IBodyResponse<ICameraModelDropDown[]>> {
        return this.client.get(`${this.baseUrl}/camera-model`);
    }
}

export const commonService = new CommonApiService({ baseUrl: '/common' }, service);
export const dropdownIAMService = new IAMDropdownService(
    { baseUrl: process.env.VUE_APP_IAM_API_URL + '/drop-down' },
    service,
);
export const dropdownCVMService = new CVMDropdownService(
    { baseUrl: process.env.VUE_APP_CVM_API_URL + '/common' },
    service,
);
