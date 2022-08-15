import { IBodyResponse } from '@/modules/common/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { ICreateGroup, IGroupUser, IQueryGroupUser, IUpdateGroup } from '../types';

class GroupUserService extends BaseService {
    async getGroups(query: IQueryGroupUser): Promise<IBodyResponse<IGroupUser[]>> {
        return await this.client.get(this.baseUrl, { params: { ...query } });
    }

    async getGroup(id: number): Promise<IBodyResponse<IGroupUser>> {
        return await this.client.get(`${this.baseUrl}/${id}`);
    }

    async updateGroup(
        id: number,
        body: IUpdateGroup,
    ): Promise<IBodyResponse<IGroupUser>> {
        return await this.client.patch(`${this.baseUrl}/${id}`, body);
    }

    async deleteGroup(id: number): Promise<IBodyResponse<IGroupUser>> {
        return await this.client.delete(`${this.baseUrl}/${id}`);
    }

    async createGroup(body: ICreateGroup): Promise<IBodyResponse<IGroupUser>> {
        return await this.client.post(`${this.baseUrl}`, body);
    }
}
export const groupUserService = new GroupUserService(
    { baseUrl: `${process.env.VUE_APP_IAM_API_URL}/user-group` },
    service,
);
