import { IBodyResponse } from '@/modules/common/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { ILayoutMapDetail } from '../types';

class LayoutMapService extends BaseService {
    async getLayoutMapDetailByCameraGroupId(
        cameraGroupId: string,
    ): Promise<IBodyResponse<ILayoutMapDetail>> {
        return await this.client.get(this.baseUrl + '/camera-group/' + cameraGroupId);
    }
}
export const layoutMapService = new LayoutMapService({ baseUrl: '/layout-map' }, service);
