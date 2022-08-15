import { BaseService } from '@/utils/api';
import service from '@/plugins/axios';
import { IUserRequest, IUserDetailReponse, IUserQueryString } from '../types';
import { IBodyResponse, ICommonListReponse } from '@/modules/common/types';

class UserApiService extends BaseService {
    async addUser(data: IUserRequest): Promise<IBodyResponse<IUserDetailReponse>> {
        const body = {
            username: data.username.trim().replace(/\s\s+/g, ' '),
            fullName: data.fullName?.trim().replace(/\s\s+/g, ' '),
            password: data.password,
            email: data.email?.trim().replace(/\s\s+/g, ' '),
            phoneNumber: data.phoneNumber?.trim().replace(/\s\s+/g, ' '),
            roleIds: data.roleIds,
            groupIds: data.groupIds,
            cameraIds: data.cameraIds,
            cameraGroupIds: data.cameraGroupIds,
        };
        return (await this.client.post<IUserDetailReponse>(
            this.baseUrl,
            body,
        )) as IBodyResponse<IUserDetailReponse>;
    }

    async updateUser(
        data: IUserRequest,
        id: number,
    ): Promise<IBodyResponse<IUserDetailReponse>> {
        const body = {
            fullName: data.fullName?.trim().replace(/\s\s+/g, ' '),
            email: data.email?.trim().replace(/\s\s+/g, ' '),
            phoneNumber: data.phoneNumber?.trim().replace(/\s\s+/g, ' '),
            roleIds: data.roleIds,
            groupIds: data.groupIds,
            cameraIds: data.cameraIds,
            cameraGroupIds: data.cameraGroupIds,
        };
        return (await this.client.patch<IUserDetailReponse>(
            `${this.baseUrl}/${id}`,
            body,
        )) as IBodyResponse<IUserDetailReponse>;
    }

    async getUsers(
        query: IUserQueryString,
    ): Promise<IBodyResponse<ICommonListReponse<IUserDetailReponse>>> {
        return (await this.client.get<ICommonListReponse<IUserDetailReponse>>(
            this.baseUrl,
            {
                params: {
                    ...query,
                },
            },
        )) as IBodyResponse<ICommonListReponse<IUserDetailReponse>>;
    }

    async getUser(id: number): Promise<IBodyResponse<IUserDetailReponse>> {
        return (await this.client.get<IUserDetailReponse>(
            `${this.baseUrl}/${id}`,
        )) as IBodyResponse<IUserDetailReponse>;
    }

    async deleteUser(id: number): Promise<IBodyResponse<{ id: number }>> {
        return (await this.client.delete<{ id: number }>(
            `${this.baseUrl}/${id}`,
        )) as IBodyResponse<{ id: number }>;
    }
}

export const userApiService = new UserApiService(
    {
        baseUrl: `${process.env.VUE_APP_IAM_API_URL}/user`,
    },
    service,
);
