import { getModule, VuexModule, Action, Module, Mutation } from 'vuex-module-decorators';
import store from '@/store';
import { ICameraDetail, ICameraGroupDropdown } from '../types';
import { ICameraGroup } from '@/modules/camera-group/types';
import { commonService, dropdownIAMService } from '@/modules/common/service/api.service';
import { ISelectOptions, ITreeNode, IUserDropdownResponse } from '@/modules/common/types';
import { PermissionActions, PermissionResources } from '@/modules/role/role.constant';
import { appService } from '@/utils/app';
import { ConnectionStatus } from '../constants';

@Module({ dynamic: true, namespaced: true, store, name: 'cameraForm' })
class CameraFormModule extends VuexModule {
    isCreatingCamera = false;
    _id = '';
    cameraDetail: ICameraDetail = {
        _id: '',
        uid: '',
        model: '',
        serialNumber: '',
        name: '',
        cameraGroups: [],
        userIds: [],
        userGroupIds: [],
        usersInfo: [],
        groupUserInfo: [],
        connectionStatus: ConnectionStatus.ONLINE,
        password: '',
        onvifProfile: {},
    };

    cameraGroups = [] as ICameraGroup[];
    userGroups = [] as ITreeNode[];
    users = [] as ISelectOptions[];

    // getters
    // return the user permission in role module
    get userPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.CAMERA);
    }

    @Action
    setId(id: string) {
        this.MUTATE_ID(id);
    }

    @Action
    setIsCreatingCamera(value: boolean) {
        this.MUTATE_CREATING_CAMERA(value);
    }

    @Action
    async getCameraGroupList() {
        const response =
            (await commonService.getDropdownCameraGroupData()) as ICameraGroupDropdown;
        if (response.success) {
            this.MUTATE_CAMERA_GROUP(response.data);
        } else {
            this.MUTATE_CAMERA_GROUP([]);
        }
    }

    @Action({})
    async getDropdownUserGroup() {
        const response = await dropdownIAMService.getDropdownUserGroup();
        if (response.success) {
            this.setUserGroupTree(response.data as ITreeNode[]);
        } else {
            this.setUserGroupTree([]);
        }
        return response;
    }

    @Action({})
    async getDropdownUsers() {
        const response = await dropdownIAMService.getDropdownUser();
        if (response.success) {
            this.setUserTree(response.data as IUserDropdownResponse[]);
        } else {
            this.setUserTree([]);
        }
        return response;
    }

    @Action
    setCameraDetail(cameraDetial: ICameraDetail) {
        this.MUTATE_CAMERA_DETAIL(cameraDetial);
    }

    @Action
    setUserGroupTree(userGroup: ITreeNode[]) {
        this.MUTATE_USER_GROUPS(userGroup);
    }

    @Action
    setUserTree(users: IUserDropdownResponse[]) {
        this.MUTATE_USERS(
            users.map((ele) => ({
                label: ele.username,
                value: ele.id,
            })) as ISelectOptions[],
        );
    }

    @Mutation
    MUTATE_CREATING_CAMERA(value: boolean) {
        this.isCreatingCamera = value;
    }

    @Mutation
    MUTATE_ID(value: string) {
        this._id = value;
    }

    @Mutation
    MUTATE_USERS(users: ISelectOptions[]) {
        this.users = users;
    }

    @Mutation
    MUTATE_USER_GROUPS(userGroup: ITreeNode[]) {
        this.userGroups = userGroup;
    }

    @Mutation
    MUTATE_CAMERA_GROUP(value: ICameraGroup[]) {
        this.cameraGroups = value;
    }

    @Mutation
    MUTATE_CAMERA_DETAIL(cameraDetail: ICameraDetail) {
        this.cameraDetail =
            {
                ...cameraDetail,
                cameraGroups: cameraDetail?.cameraGroups,
                userIds: cameraDetail?.userIds || [],
                userGroupIds: cameraDetail?.userGroupIds || [],
                groupUserInfo: cameraDetail?.groupUserInfo || [],
            } || null;
    }
}

export const cameraFormModule = getModule(CameraFormModule);
