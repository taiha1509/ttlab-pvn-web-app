import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators';
import store from '@/store';
import { ICameraDetail, IScheduleConfiguration } from '../types';
import { cameraService } from '../services/api.service';
import { PermissionActions, PermissionResources } from '@/modules/role/role.constant';
import { cameraListModule } from './camera.list.store';
import { appService } from '@/utils/app';
import { ConnectionStatus, POPUP_NAME } from '../constants';

const initCameraDetail = {
    _id: '',
    model: '',
    serialNumber: '',
    name: '',
    uid: '',
    password: '',
    connectionStatus: ConnectionStatus.ONLINE,
};

@Module({ dynamic: true, namespaced: true, store, name: 'cameraConfig' })
class CameraConfigModule extends VuexModule {
    scheduleConfigurations: IScheduleConfiguration[] = [];
    scheduleConfigurationDetail: IScheduleConfiguration = {};
    selectedScheduleId = '';

    selectedCamera: ICameraDetail = {
        ...initCameraDetail,
    };

    // getters
    // return the user permission in role module
    get userPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.CAMERA);
    }

    @Action
    async setSelectedCamera(cameraId: string) {
        const foundCamera = (cameraListModule.cameras || []).find(
            (camera) => camera._id === cameraId,
        );
        this.SET_SELECTED_CAMERA(foundCamera);
    }

    @Action
    async showCameraRecordingConfigurationPopup(cameraId: string) {
        this.setSelectedCamera(cameraId);
        cameraListModule.openCameraPopup(POPUP_NAME.RECORDING_CONFIGURATION_POPUP);
    }

    @Action
    async showCameraScheduleConfigurationPopup(cameraId: string) {
        this.setSelectedCamera(cameraId);
        cameraListModule.openCameraPopup(POPUP_NAME.SCHEDULE_LIST_CONFIGURATION_POPUP);
    }

    @Action
    async getScheduleConfigurations(cameraId: string) {
        const response = await cameraService.getScheduleConfigurationList(cameraId);
        this.SET_SCHEDULE_CONFIGURATION_LIST(response?.data?.items || []);
        return response;
    }

    @Action
    async getScheduleConfigurationDetail(data: { cameraId: string; scheduleId: string }) {
        const response = await cameraService.getScheduleConfigurationDetail(
            data.scheduleId,
        );
        this.SET_SCHEDULE_CONFIGURATION_DETAIL(response?.data || {});
        return response;
    }

    @Mutation
    SET_SELECTED_CAMERA(data: ICameraDetail = { ...initCameraDetail }) {
        this.selectedCamera = data;
    }

    @Mutation
    SET_SCHEDULE_CONFIGURATION_LIST(data: IScheduleConfiguration[]) {
        this.scheduleConfigurations = data;
    }

    @Mutation
    SET_SCHEDULE_CONFIGURATION_DETAIL(data: IScheduleConfiguration) {
        this.scheduleConfigurationDetail = data;
    }

    @Mutation
    SET_SELECTED_SCHEDULE_CONFIGURATION_ID(id: string) {
        this.selectedScheduleId = id || '';
    }
}

export const cameraConfigModule = getModule(CameraConfigModule);
