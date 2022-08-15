import { getModule, VuexModule, Module, Action, Mutation } from 'vuex-module-decorators';
import store from '@/store';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_SIZE_PER_PAGE,
    OrderDirection,
} from '../common/constants';
import {
    ICameraDropdown,
    ICameraGroupDropdown,
    IRoleDropdown,
    IUserDetailReponse,
    IUserQueryString,
} from './types';
import { IPaginationParams, ITreeNode } from '../common/types';
import { userApiService } from './services/api.service';
import { ElNotification } from 'element-plus';
import i18n from '@/plugins/vue-i18n';
import { POPUP_NAME, UserStatus } from './constant';
import { dropdownCVMService, dropdownIAMService } from '../common/service/api.service';
import { PermissionActions, PermissionResources } from '../role/role.constant';
import { appService } from '@/utils/app';

@Module({ dynamic: true, namespaced: true, store, name: 'user' })
class UserModule extends VuexModule {
    initUser = {
        email: '',
        id: undefined,
        phoneNumber: '',
        roles: [],
        groups: [],
        status: UserStatus.ACTIVE,
        types: [],
        username: '',
        fullName: '',
        groupUsers: [],
        cameras: [],
        cameraGroups: [],
    };

    loadingUserTabel = false;

    user: IUserDetailReponse = { ...this.initUser };

    userGroupTree: ITreeNode[] = [];

    users: IUserDetailReponse[] = [];

    queryString: IUserQueryString = {
        page: DEFAULT_FIRST_PAGE,
        limit: DEFAULT_SIZE_PER_PAGE,
        keyword: '',
        orderBy: DEFAULT_ORDER_BY,
        orderDirection: OrderDirection.DESC,
    };

    paginationParams: IPaginationParams = {
        totalItems: 0,
        currentPage: DEFAULT_FIRST_PAGE,
        itemsPerPage: DEFAULT_SIZE_PER_PAGE,
    };

    cameras: ICameraDropdown[] = [];
    cameraGroups: ICameraGroupDropdown[] = [];
    roles: IRoleDropdown[] = [];

    displayUsersPopups: Record<POPUP_NAME, boolean> = {
        formPopup: false,
        detailPopup: false,
    };

    previousDisplayPopup: POPUP_NAME | '' = '';

    // getters
    // get user permission in user module
    get userPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.USER);
    }

    get rolePermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.ROLE);
    }

    get userGroupPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.USER_GROUP);
    }

    get cameraGroupPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.CAMERA_GROUP);
    }

    get cameraPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.CAMERA);
    }

    @Action
    openUserPopup(popupName: POPUP_NAME) {
        // find current open popup
        const currentDislayPopup = Object.keys(this.displayUsersPopups).find(
            (key: string) => this.displayUsersPopups[key as POPUP_NAME],
        ) as POPUP_NAME;
        if (currentDislayPopup) {
            this.MUTATE_PREVIOUS_DISPLAY_POPUP(currentDislayPopup);
        }
        // set display popup
        const displayUserPopups: Record<POPUP_NAME, boolean> = {
            detailPopup: false,
            formPopup: false,
        };
        displayUserPopups[popupName] = true;
        this.MUTATE_DISPLAY_USER_POPUPS(displayUserPopups);
    }

    @Action
    closeUserPopup(popupName: POPUP_NAME) {
        const displayUsersPopups = {
            ...this.displayUsersPopups,
        };
        displayUsersPopups[popupName] = false;
        if (this.previousDisplayPopup) {
            displayUsersPopups[this.previousDisplayPopup] = true;
            this.MUTATE_PREVIOUS_DISPLAY_POPUP('');
        }
        this.MUTATE_DISPLAY_USER_POPUPS(displayUsersPopups);
    }

    @Action
    setCameras(values: ICameraDropdown[]) {
        this.MUTATE_SET_CAMERAS(values);
    }

    @Action
    async getCameras() {
        const response = await dropdownCVMService.getDropdownCameras();
        if (response.data) {
            this.setCameras(response.data);
        } else {
            this.setCameras([]);
        }
    }

    @Action
    async getRoles() {
        const response = await dropdownIAMService.getDropdownRole();
        if (response.data) {
            this.setRoles(response.data);
        } else {
            this.setRoles([]);
        }
    }

    @Action
    async getCameraGroups() {
        const response = await dropdownCVMService.getDropdownCameraGroups();
        if (response.data) {
            this.setCameraGroups(response.data);
        } else {
            this.setCameraGroups([]);
        }
    }

    @Action
    setCameraGroups(values: ICameraGroupDropdown[]) {
        this.MUTATE_SET_CAMERA_GROUPS(values);
    }

    @Action
    setRoles(values: IRoleDropdown[]) {
        this.MUTATE_SET_ROLES(values);
    }

    @Action
    setPaginationParams(value: IPaginationParams) {
        this.MUTATE_SET_PAGINATION_PARAMS(value);
    }

    @Action({})
    setUserGroupTree(value: ITreeNode[]) {
        this.MUTATE_SET_USER_GROUP_TREE(value);
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

    @Action
    async getUser(id: number) {
        const response = await userApiService.getUser(id);
        if (response.success) {
            this.MUTATE_USER(response.data);
        } else {
            ElNotification({
                type: 'error',
                message: response.message,
                title: i18n.global.t('common.app.notification'),
            });
            await this.getUsers();
        }
    }

    @Action
    setUser(value: IUserDetailReponse) {
        this.MUTATE_USER(value);
    }

    @Action
    setUsers(value: IUserDetailReponse[]) {
        this.MUTATE_USERS(value);
    }

    @Action
    setLoadingUserTable(value: boolean) {
        this.MUTATE_SET_LOADING_USER_TABLE(value);
    }

    @Action
    async getUsers() {
        this.setQueryString({
            ...this.queryString,
            limit: this.paginationParams.itemsPerPage,
            page: this.paginationParams.currentPage,
        });
        const response = await userApiService.getUsers(this.queryString);
        if (response.success) {
            this.MUTATE_USERS(response.data.items);
        } else {
            this.MUTATE_USERS([]);
        }
        this.setPaginationParams({
            ...this.paginationParams,
            totalItems: response?.data?.totalItems || 0,
        });
        return response;
    }

    @Action
    setQueryString(value: IUserQueryString): void {
        this.MUTATE_QUERY_STRING(value);
    }

    // Mutations
    @Mutation
    MUTATE_USERS(values: IUserDetailReponse[]) {
        this.users = values;
    }

    @Mutation
    MUTATE_PREVIOUS_DISPLAY_POPUP(previousDisplayPopup: POPUP_NAME | '') {
        this.previousDisplayPopup = previousDisplayPopup;
    }

    @Mutation
    MUTATE_USER(value: IUserDetailReponse) {
        this.user = value;
    }

    @Mutation
    MUTATE_DISPLAY_USER_POPUPS(displayUserPopups: Record<POPUP_NAME, boolean>) {
        this.displayUsersPopups = displayUserPopups;
    }

    @Mutation
    MUTATE_QUERY_STRING(value: IUserQueryString) {
        this.queryString = value;
    }

    @Mutation
    MUTATE_SET_PAGINATION_PARAMS(value: IPaginationParams) {
        this.paginationParams = value;
    }

    @Mutation
    MUTATE_SET_USER_GROUP_TREE(value: ITreeNode[]) {
        this.userGroupTree = value;
    }

    @Mutation
    MUTATE_SET_CAMERAS(value: ICameraDropdown[]) {
        this.cameras = value;
    }

    @Mutation
    MUTATE_SET_ROLES(value: IRoleDropdown[]) {
        this.roles = value;
    }

    @Mutation
    MUTATE_SET_CAMERA_GROUPS(value: ICameraGroupDropdown[]) {
        this.cameraGroups = value;
    }

    @Mutation
    MUTATE_SET_LOADING_USER_TABLE(value: boolean) {
        this.loadingUserTabel = value;
    }
}

export const userModule = getModule(UserModule);
