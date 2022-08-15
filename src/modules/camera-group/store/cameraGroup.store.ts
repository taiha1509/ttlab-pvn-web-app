import { VuexModule, Action, Module, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import {
    IGetListCameraGroupResponse,
    ICameraGroup,
    ICameraGroupDetail,
    ICameraGroupFilterForm,
} from '../types';
import { cameraGroupService } from '../services/api.service';
import { ICamera, IGetListCameraResponse } from '@/modules/camera/types';
import { cameraService } from '@/modules/camera/services/api.service';

import { PermissionActions, PermissionResources } from '@/modules/role/role.constant';
import { appService } from '@/utils/app';
import { DEFAULT_CAMERA_SIZE } from '@/modules/common/constants';

@Module({ dynamic: true, namespaced: true, store, name: 'cameraGroupList' })
class CameraGroupListModule extends VuexModule {
    cameraGroups: ICameraGroup[] = [];
    cameras: ICamera[] = [];
    isCreate = false;
    totalcameraGroups = 0;
    cameraGroupTable = {
        _id: '',
        name: '',
    };

    cameraGroupDetail = {
        _id: '',
        name: '',
    };

    loadingTree = true;
    isShowCameraGroupPopup = false;

    queryString = {
        name: null,
    } as ICameraGroupFilterForm;

    // getters
    // return the user permission in role module
    get userPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.CAMERA_GROUP);
    }

    @Action
    async getCameraGroupList() {
        const response = (await cameraGroupService.getList({
            ...this.queryString,
        })) as IGetListCameraGroupResponse;
        if (response.success) {
            this.MUTATE_CAMERA_GROUPS(response?.data?.items);
            this.MUTATE_TOTAL_CAMERA_GROUPS(response?.data?.totalItems);
        } else {
            this.MUTATE_CAMERA_GROUPS([]);
            this.MUTATE_TOTAL_CAMERA_GROUPS(0);
        }
    }

    @Action
    async getCameraListBycameraGroupId() {
        const response = (await cameraService.getList({
            limit: DEFAULT_CAMERA_SIZE,
            cameraGroupId: this.cameraGroupTable._id,
        })) as IGetListCameraResponse;
        if (response.success) {
            this.setCameras(response?.data?.items);
        } else {
            this.setCameras([]);
        }
    }

    @Action
    setIsCreate(value: boolean) {
        this.MUTATE_IS_CREATE(value);
    }

    @Action
    setFilterForm(form: ICameraGroupFilterForm) {
        this.MUTATE_CAMERA_FILTER_FORM(form);
    }

    @Action
    setIsShowFormPopup(value: boolean) {
        this.MUTATE_FORM_POPUP(value);
    }

    @Action
    setLoadingTree(value: boolean) {
        this.MUTATTE_SET_LOADING_TREE(value);
    }

    @Action
    setCameraGroupTable(value: ICameraGroupDetail) {
        this.MUTATE_CAMERA_GROUP_TABLE(value);
    }

    @Action
    setGroupDetail(value: ICameraGroupDetail) {
        this.MUTATE_CAMERA_GROUP_DETAIL(value);
    }

    @Action
    setCameras(value: ICamera[]) {
        this.MUTATE_CAMERAS(value);
    }

    @Action
    clearFilterForm() {
        this.MUTATE_CAMERA_FILTER_FORM({});
    }

    @Mutation
    MUTATE_CAMERA_FILTER_FORM(form: ICameraGroupFilterForm) {
        this.queryString.keyword = form?.keyword || null;
    }

    @Mutation
    MUTATE_FORM_POPUP(value: boolean) {
        this.isShowCameraGroupPopup = value;
    }

    @Mutation
    MUTATE_CAMERA_GROUP_TABLE(value: ICameraGroupDetail) {
        this.cameraGroupTable = value;
    }

    @Mutation
    MUTATE_CAMERA_GROUP_DETAIL(value: ICameraGroupDetail) {
        this.cameraGroupDetail = value;
    }

    @Mutation
    MUTATE_IS_CREATE(value: boolean) {
        this.isCreate = value;
    }

    @Mutation
    async MUTATE_CAMERA_GROUPS(cameraGroups: ICameraGroup[]) {
        this.cameraGroups = cameraGroups;
    }

    @Mutation
    async MUTATTE_SET_LOADING_TREE(value: boolean) {
        this.loadingTree = value;
    }

    @Mutation
    async MUTATE_CAMERAS(cameras: ICamera[]) {
        this.cameras = cameras;
    }

    @Mutation
    async MUTATE_TOTAL_CAMERA_GROUPS(totalCameras: number) {
        this.totalcameraGroups = totalCameras;
    }
}

export const cameraGroupListModule = getModule(CameraGroupListModule);
