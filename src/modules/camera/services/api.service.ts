import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { IBodyResponse } from '@/modules/common/types';
import {
    ICameraRecordingConfiguration,
    ICreateScheduleConfigurationBody,
    IScheduleConfiguration,
    ISocketRefreshConnectionStatusBody,
    IUpdateScheduleConfigurationBody,
} from '../types';
import { ILiveViewListResponse } from '@/modules/monitor/types';

class CameraService extends BaseService {
    async updateRecordingConfiguration(
        cameraId: string,
        data: ICameraRecordingConfiguration,
    ): Promise<IBodyResponse<ICameraRecordingConfiguration>> {
        return await this.client.post(
            `${this.baseUrl}/${cameraId}/recording-configuration`,
            data,
        );
    }

    async getScheduleConfigurationList(
        cameraId: string,
    ): Promise<IBodyResponse<{ items: IScheduleConfiguration[] }>> {
        return await this.client.get(
            `${this.baseUrl}/${cameraId}/schedule-configuration`,
        );
    }

    async getScheduleConfigurationDetail(
        scheduleId: string,
    ): Promise<IBodyResponse<IScheduleConfiguration>> {
        return await this.client.get(
            `${this.baseUrl}/schedule-configuration/${scheduleId}`,
        );
    }

    async createScheduleConfiguration(
        cameraId: string,
        data: ICreateScheduleConfigurationBody,
    ): Promise<IBodyResponse<IScheduleConfiguration>> {
        return await this.client.post(
            `${this.baseUrl}/${cameraId}/schedule-configuration`,
            data,
        );
    }

    async updateScheduleConfiguration(
        scheduleId: string,
        data: IUpdateScheduleConfigurationBody,
    ): Promise<IBodyResponse<IScheduleConfiguration>> {
        return await this.client.patch(
            `${this.baseUrl}/schedule-configuration/${scheduleId}`,
            data,
        );
    }

    async deleteScheduleConfiguration(
        scheduleId: string,
    ): Promise<IBodyResponse<IScheduleConfiguration>> {
        return await this.client.delete(
            `${this.baseUrl}/schedule-configuration/${scheduleId}`,
        );
    }

    async getCameraList(
        cameraGroupIds: string,
    ): Promise<IBodyResponse<ILiveViewListResponse>> {
        return await this.client.get('/live-view', { params: { cameraGroupIds } });
    }

    async updateConnectionStatus(
        cameraId: string,
        body: ISocketRefreshConnectionStatusBody,
    ): Promise<IBodyResponse<void>> {
        return await this.client.post(`${this.baseUrl}/${cameraId}/refresh-status`, body);
    }
}
export const cameraService = new CameraService({ baseUrl: '/camera' }, service);
