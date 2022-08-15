import { getModule, VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from '@/store';
import { LAYOUT_MAP_MUTATIONS } from '../constant';
import { IGetListCameraGroupResponse, ICameraGroup } from '@/modules/camera-group/types';
import { cameraGroupService } from '@/modules/camera-group/services/api.service';
import { ICameraDetail, IGetListCameraResponse } from '@/modules/camera/types';
import { IBodyResponse } from '@/modules/common/types';
import cloneDeep from 'lodash/cloneDeep';
import { layoutMapService } from '../services/api.service';
import {
    ICreateLayoutMapBody,
    ILayoutMapDetail,
    IUpdateLayoutMapBody,
    ILayoutMapData,
    ILayoutMapForm,
} from '../types';
import { PermissionActions, PermissionResources } from '@/modules/role/role.constant';
import { appService } from '@/utils/app';
import { parseLayoutMapCameras } from '../helper';
import { DEFAULT_LIST_LIMIT } from '@/modules/playback/contants';
import { cameraService } from '@/modules/camera/services/api.service';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    OrderDirection,
} from '@/modules/common/constants';

@Module({ dynamic: true, namespaced: true, store, name: 'layoutMap' })
class LayoutMapModule extends VuexModule {
    isShowUploadLayoutMapPopup = false;
    layoutMapDetail: ILayoutMapDetail = {};
    canEditLayoutMap = true;
    loadingEMap = false;
    selectedCameraGroupId = '';
    cameraGroupList: ICameraGroup[] = [];

    cameraList: ICameraDetail[] = [];
    cameraListQuery = {
        page: DEFAULT_FIRST_PAGE,
        limit: DEFAULT_LIST_LIMIT,
        orderBy: DEFAULT_ORDER_BY,
        orderDirection: OrderDirection.DESC,
    };

    layoutMapForm: ILayoutMapForm = {
        data: {
            cameras: [],
        },
        originalData: {
            cameras: [],
        },
    };

    // return the user permission in role module
    get userPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.E_MAP);
    }

    get cameras() {
        return this.layoutMapForm.data.cameras || [];
    }

    get unassignedCameras() {
        return this.layoutMapForm.data.cameras.filter((camera) => !camera.isAssigned);
    }

    get assignedCameras() {
        return this.layoutMapForm.data.cameras.filter((camera) => camera.isAssigned);
    }

    @Action
    initLayoutMapFormData(layoutMapDetail: ILayoutMapDetail) {
        this.SET_LAYOUT_MAP_DETAIL(layoutMapDetail || {});
        const cameraCoordinates = layoutMapDetail.cameraCoordinates || [];
        const cameras = parseLayoutMapCameras({
            selectedGroupId: this.selectedCameraGroupId,
            allCameraList: this.cameraList,
            assignedCameras: cameraCoordinates,
        });
        const originalData = {
            cameras,
        };
        this.SET_LAYOUT_MAP_FORM({ data: cloneDeep(originalData), originalData });
        this.SET_CAN_EDIT_LAYOUT_MAP(!!layoutMapDetail?._id);
    }

    @Action
    setLoadingEMap(value: boolean) {
        this.MUTATATE_SET_LOADING_E_MAP(value);
    }

    @Action
    async getLayoutMapDetailByCameraGroupId(id: string) {
        const response = (await layoutMapService.getLayoutMapDetailByCameraGroupId(
            id,
        )) as IBodyResponse<ILayoutMapDetail>;
        this.initLayoutMapFormData(response.data || {});
        return response;
    }

    @Action
    async createLayoutMap(body: ICreateLayoutMapBody) {
        const response = (await layoutMapService.create(
            body,
        )) as IBodyResponse<ILayoutMapDetail>;
        this.initLayoutMapFormData(response.data || {});
        return response;
    }

    @Action
    async updateLayoutMap(data: { id: string; body: IUpdateLayoutMapBody }) {
        const response = (await layoutMapService.update(
            data.id,
            data.body,
        )) as IBodyResponse<ILayoutMapDetail>;
        if (response.success) {
            this.initLayoutMapFormData(response.data || {});
        }
        return response;
    }

    @Action
    async deleteLayoutMap(id: string) {
        const response = (await layoutMapService.delete(id)) as IBodyResponse<{
            _id: string;
        }>;
        if (response.success) this.SET_LAYOUT_MAP_DETAIL({});
        return response;
    }

    @Action
    async getCameraGroupList() {
        const response = (await cameraGroupService.getList(
            {},
        )) as IGetListCameraGroupResponse;
        const cameraGroupList = response?.data?.items || [];
        if (cameraGroupList.length) {
            const firstCameraGroup = cameraGroupList[0];
            this.SET_SELECTED_CAMERA_GROUP_ID(firstCameraGroup?._id || '');
        }
        this.SET_CAMERA_GROUP_LIST(cameraGroupList);
        return response;
    }

    @Action
    async getCameraList() {
        const response = (await cameraService.getList({
            ...this.cameraListQuery,
            cameraGroupId: this.selectedCameraGroupId,
        })) as IGetListCameraResponse;
        const cameraList = response?.data?.items || [];
        this.SET_CAMERA_LIST(cameraList);
        return response;
    }

    @Mutation
    [LAYOUT_MAP_MUTATIONS.SHOW_UPLOAD_LAYOUT_MAP_POPUP](isShow: boolean) {
        this.isShowUploadLayoutMapPopup = isShow;
    }

    @Mutation
    [LAYOUT_MAP_MUTATIONS.SET_SELECTED_CAMERA_GROUP_ID](id: string) {
        this.selectedCameraGroupId = id;
    }

    @Mutation
    [LAYOUT_MAP_MUTATIONS.SET_CAMERA_GROUP_LIST](cameraGroupList: ICameraGroup[]) {
        this.cameraGroupList = cameraGroupList || [];
    }

    @Mutation
    [LAYOUT_MAP_MUTATIONS.SET_CAMERA_LIST](cameraList: ICameraDetail[]) {
        this.cameraList = cameraList || [];
    }

    @Mutation
    [LAYOUT_MAP_MUTATIONS.SET_LAYOUT_MAP_DETAIL](layoutMapDetail: ILayoutMapDetail) {
        this.layoutMapDetail = layoutMapDetail || {};
    }

    @Mutation
    [LAYOUT_MAP_MUTATIONS.SET_CAN_EDIT_LAYOUT_MAP](value: boolean) {
        this.canEditLayoutMap = value;
    }

    @Mutation
    [LAYOUT_MAP_MUTATIONS.SET_LAYOUT_MAP_FORM](data: {
        data: ILayoutMapData;
        originalData?: ILayoutMapData;
    }) {
        if (data.data) this.layoutMapForm.data = data.data;
        if (data.originalData) this.layoutMapForm.originalData = data.originalData;
    }

    @Mutation
    MUTATATE_SET_LOADING_E_MAP(value: boolean) {
        this.loadingEMap = value;
    }
}

export const layoutMapModule = getModule(LayoutMapModule);
