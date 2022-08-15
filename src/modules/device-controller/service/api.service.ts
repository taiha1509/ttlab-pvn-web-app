import { IBodyResponse } from '@/modules/common/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { IControlCameraPTZBody } from '../types';

class DeviceControllerService extends BaseService {
    async controlCameraPTZ(
        cameraId: string,
        data: IControlCameraPTZBody,
    ): Promise<IBodyResponse<Record<string, string>>> {
        return await this.client.post(`${this.baseUrl}/camera/${cameraId}/ptz`, data);
    }
}

export const deviceControllerService = new DeviceControllerService(
    { baseUrl: '/device-controller' },
    service,
);
