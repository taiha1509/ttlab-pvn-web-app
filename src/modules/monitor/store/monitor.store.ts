import { VuexModule, Module, getModule, Action, Mutation } from 'vuex-module-decorators';
import store from '@/store';
import {
    IAWSKey,
    IGetListCameraGroupResponse,
    ICameraGroup,
    ICameraGroupDetail,
    ICameraGroupFilterForm,
    ILiveView,
    ICameraLayout,
    ICameraInfo,
} from '../types';
import { cameraGroupService } from '../services/api.service';
import { cameraService } from '@/modules/camera/services/api.service';
import { dropdownCVMService } from '@/modules/common/service/api.service';
import { ICameraModelDropDown } from '@/modules/common/types';
import { PermissionActions, PermissionResources } from '@/modules/role/role.constant';
import { appService } from '@/utils/app';

@Module({ dynamic: true, namespaced: true, store, name: 'monitor' })
class LiveViewModule extends VuexModule {
    cameraGroups: ICameraGroup[] = [];
    cameraList: ILiveView[] = [];
    cameraLayoutList: ILiveView[] = [];
    awsKey: IAWSKey = {
        accessKey: '',
        accessKeyId: '',
        region: '',
    };

    liveViewList = {} as ICameraLayout;

    queryString = {
        name: null,
    } as ICameraGroupFilterForm;

    cameraGroupTable = {
        _id: '',
        name: '',
    };

    cameraKeyword = '';
    cameraModels: ICameraModelDropDown[] = [];

    // return the user permission in role module
    get userPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.LIVEVIEW);
    }

    @Action
    async getCameraGroupList() {
        const response = (await cameraGroupService.getList({
            ...this.queryString,
        })) as IGetListCameraGroupResponse;
        if (response.success) {
            this.MUTATE_CAMERA_GROUPS(response?.data?.items);
        } else {
            this.MUTATE_CAMERA_GROUPS([]);
        }
    }

    @Action
    appendCameraIntoLayout(data: { index: number; cameraInfo: ICameraInfo }) {
        this.MUTATE_ADD_CAMERA_LAYOUT(data);
    }

    @Action
    removeCameraInLayout(id: string) {
        this.MUTATE_DELETE_CAMERA_LAYOUT(id);
    }

    @Action
    setCameraKeyword(value: string) {
        this.MUTATE_CAMERA_KEYWORD(value);
    }

    @Action
    async getCameraList(cameraGroupId: string) {
        const response = await cameraService.getCameraList(cameraGroupId);
        if (response.success) {
            const data = response.data;
            this.setAWSKey({
                accessKey: data?.accessKey,
                accessKeyId: data?.accessKeyId,
                region: data?.region,
            });
            this.setCameraList(response?.data?.items);
            this.setCameraLayoutList(response?.data?.items);
        } else {
            this.setCameraList([]);
            this.setCameraLayoutList([]);
            this.setAWSKey({
                accessKey: '',
                accessKeyId: '',
                region: '',
            });
        }
    }

    @Action
    async getCameraModels() {
        const response = await dropdownCVMService.getDropdownCameraModels();
        this.MUTATE_CAMERA_MODELS(response?.data || []);
        return response;
    }

    @Action
    setCameraList(value: ILiveView[]) {
        this.MUTATE_SET_CAMERA_LIST(value);
    }

    @Action
    setCameraLayoutList(cameras: ILiveView[]) {
        const newCameras = cameras.filter((camera) => {
            const keys = Object.keys(liveViewModule.liveViewList);
            let tmp = 1;
            for (let i = 0; i < keys.length; i++) {
                if (this.liveViewList?.[parseInt(keys[i])]?._id === camera._id) tmp++;
            }
            return tmp === 1;
        });
        this.MUTATE_SET_CAMERA_LAYOUT_LIST(newCameras);
    }

    @Action
    setAWSKey(value: IAWSKey) {
        this.MUTATE_SET_AWS_KEY(value);
    }

    @Action
    setLiveViewList(data: ICameraLayout) {
        this.MUTATE_LIVEVIEW_LIST(data);
    }

    @Action
    setCameraGroupTable(value: ICameraGroupDetail) {
        this.MUTATE_CAMERA_GROUP_TABLE(value);
    }

    @Mutation
    MUTATE_CAMERA_GROUP_TABLE(value: ICameraGroupDetail) {
        this.cameraGroupTable = value;
    }

    @Mutation
    MUTATE_CAMERA_GROUPS(cameraGroups: ICameraGroup[]) {
        this.cameraGroups = cameraGroups;
    }

    @Mutation
    MUTATE_LIVEVIEW_LIST(data: ICameraLayout) {
        this.liveViewList = data;
    }

    @Mutation
    MUTATE_ADD_CAMERA_LAYOUT(data: { index: number; cameraInfo: ICameraInfo }) {
        this.liveViewList[data.index] = data.cameraInfo;
    }

    @Mutation
    MUTATE_DELETE_CAMERA_LAYOUT(id: string) {
        const keys = Object.keys(this.liveViewList);
        keys.forEach((key: string) => {
            if (this.liveViewList?.[parseInt(key)]?._id === id) {
                delete this.liveViewList?.[parseInt(key)];
            }
        });
    }

    @Mutation
    MUTATE_SET_CAMERA_LIST(cameras: ILiveView[]) {
        this.cameraList = cameras;
    }

    @Mutation
    MUTATE_SET_CAMERA_LAYOUT_LIST(cameras: ILiveView[]) {
        this.cameraLayoutList = cameras;
    }

    @Mutation
    MUTATE_CAMERA_KEYWORD(value: string) {
        this.cameraKeyword = value;
    }

    @Mutation
    MUTATE_SET_AWS_KEY(value: IAWSKey) {
        this.awsKey = value;
    }

    @Mutation
    MUTATE_CAMERA_MODELS(value: ICameraModelDropDown[]) {
        this.cameraModels = value;
    }
}

export const liveViewModule = getModule(LiveViewModule);
