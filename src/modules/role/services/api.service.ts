import { BaseService } from '@/utils/api';
import service from '@/plugins/axios';
import { IBodyResponse, ICommonListReponse } from '@/modules/common/types';
import { ICreateRoleDto, IPermission, IRole, IUpdateRoleDto } from '../type';

class RoleApiService extends BaseService {
    async getRoles(): Promise<IBodyResponse<IRole[]>> {
        const response = await this.client.get<IRole[], IBodyResponse<IRole[]>>(
            `${this.baseUrl}`,
        );
        return response;
    }

    async getRole(id: number): Promise<IBodyResponse<IRole>> {
        const response = await this.client.get<IRole, IBodyResponse<IRole>>(
            `${this.baseUrl}/${id}`,
        );
        return response;
    }

    async createRole(body: ICreateRoleDto): Promise<IBodyResponse<IRole>> {
        const response = await this.client.post<IRole, IBodyResponse<IRole>>(
            `${this.baseUrl}`,
            {
                ...body,
            },
        );
        return response;
    }

    async updateRole(id: number, body: IUpdateRoleDto): Promise<IBodyResponse<IRole>> {
        const response = await this.client.patch<IRole, IBodyResponse<IRole>>(
            `${this.baseUrl}/${id}`,
            {
                ...body,
            },
        );
        return response;
    }

    async deleteRole(id: number): Promise<IBodyResponse<void>> {
        const response = await this.client.delete<void, IBodyResponse<void>>(
            `${this.baseUrl}/${id}`,
        );
        return response;
    }

    async getPermissionList(): Promise<IBodyResponse<ICommonListReponse<IPermission>>> {
        const response = await this.client.get<
            ICommonListReponse<IPermission>,
            IBodyResponse<ICommonListReponse<IPermission>>
        >(`${this.baseUrl}/permission`);
        return response;
    }
}

export const roleApiService = new RoleApiService(
    {
        baseUrl: `${process.env.VUE_APP_IAM_API_URL}/role`,
    },
    service,
);
