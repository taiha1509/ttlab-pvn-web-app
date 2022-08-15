import { VuexModule, Module, getModule, Action, Mutation } from 'vuex-module-decorators';
import store from '@/store';
import { IGroupUser, IGroupUserPopupParams, IQueryGroupUser } from './types';
import { groupUserService } from './services/api.service';
import { userApiService } from '@/modules/user/services/api.service';
import { IUserDetailReponse, IUserQueryString } from '../user/types';
import { IQueryString } from '../common/types';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_SIZE_PER_PAGE,
    OrderDirection,
} from '../common/constants';
import { appService } from '@/utils/app';
import { PermissionActions, PermissionResources } from '../role/role.constant';

const initialGroup = {
    children: [],
    id: 0,
    level: 0,
    name: '',
    parentId: 0,
};
@Module({ dynamic: true, namespaced: true, store, name: 'groupUserList' })
class GroupUserModule extends VuexModule {
    groups: IGroupUser[] = [];
    group: IGroupUser = { ...initialGroup };
    totalUsers = 0;
    loadingTree = true;

    // users show in the table
    users: IUserDetailReponse[] = [];
    userQueryString: IUserQueryString = {
        limit: DEFAULT_SIZE_PER_PAGE,
        page: DEFAULT_FIRST_PAGE,
        orderBy: DEFAULT_ORDER_BY,
        orderDirection: OrderDirection.DESC,
    };

    parentId: number | null = null;
    queryParams: IQueryGroupUser = {
        keyword: '',
    };

    popupParams: IGroupUserPopupParams = {
        isCreate: false,
        isShow: false,
    };

    // return the user permission in role module
    get userPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.USER_GROUP);
    }

    @Action
    setUserQueryString(value: IUserQueryString) {
        this.MUTATE_SET_USER_QUERY_STRING(value);
    }

    @Action
    setUsers(value: IUserDetailReponse[]) {
        this.MUTATE_SET_USERS(value);
    }

    @Action
    setPage(page: number) {
        this.MUTATE_USER_PAGE(page);
    }

    @Action
    setLimit(limit: number) {
        this.MUTATE_SET_LIMIT(limit);
    }

    @Action
    async getUsers(groupIds: number[]) {
        const response = await userApiService.getUsers({
            ...this.userQueryString,
            groupIds,
        });
        if (response.success) {
            this.setTotalUsers(response?.data?.totalItems);
            this.setUsers(response?.data?.items);
        } else {
            this.setTotalUsers(0);
            this.setUsers([]);
        }
        return response;
    }

    @Action
    setTotalUsers(value: number) {
        this.MUTATE_TOTAL_USERS(value);
    }

    @Action
    setGroups(value: IGroupUser[]) {
        this.MUTATE_SET_GROUPS(value);
    }

    @Action
    setGroup(value: IGroupUser) {
        this.MUTATE_SET_GROUP(value);
    }

    @Action
    setQueryParams(value: IQueryGroupUser) {
        this.MUTATE_SET_QUERY_PARAMS(value);
    }

    @Action
    async getGroups() {
        const response = await groupUserService.getGroups({ ...this.queryParams });
        if (response?.success) {
            this.setGroups(response?.data);
        } else {
            this.setGroups([]);
        }
        return response;
    }

    @Action
    async getGroup(id: number) {
        const response = await groupUserService.getGroup(id);
        if (response.success) {
            this.setGroup(response.data);
        } else {
            this.setGroup({ ...initialGroup });
        }
        return response;
    }

    @Action
    setPopupParams(value: IGroupUserPopupParams) {
        this.MUTATE_SET_POPUP_PARAMS(value);
    }

    @Action
    setParentId(value: number | null) {
        this.MUTATE_SET_PARENT_ID(value);
    }

    @Action
    setLoadingTree(value: boolean) {
        this.MUTATE_SET_LOADING_TREE(value);
    }

    @Action
    resetQuery(): void {
        groupUserModule.setUserQueryString({
            orderBy: DEFAULT_ORDER_BY,
            orderDirection: OrderDirection.DESC,
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
        });
        groupUserModule.setQueryParams({
            keyword: '',
        });
    }

    @Mutation
    MUTATE_SET_LIMIT(value: number) {
        this.userQueryString.limit = value;
    }

    @Mutation
    MUTATE_TOTAL_USERS(value: number) {
        this.totalUsers = value;
    }

    @Mutation
    MUTATE_USER_PAGE(value: number) {
        this.userQueryString.page = value;
    }

    @Mutation
    MUTATE_SET_GROUPS(value: IGroupUser[]) {
        this.groups = value;
    }

    @Mutation
    MUTATE_SET_GROUP(value: IGroupUser) {
        this.group = value;
    }

    @Mutation
    MUTATE_SET_PARENT_ID(value: number | null) {
        this.parentId = value;
    }

    @Mutation
    MUTATE_SET_POPUP_PARAMS(value: IGroupUserPopupParams) {
        this.popupParams = value;
    }

    @Mutation
    MUTATE_SET_QUERY_PARAMS(value: IQueryGroupUser) {
        this.queryParams = value;
    }

    @Mutation
    MUTATE_SET_USERS(value: IUserDetailReponse[]) {
        this.users = value;
    }

    @Mutation
    MUTATE_SET_USER_QUERY_STRING(value: IQueryString) {
        this.userQueryString = value;
    }

    @Mutation
    MUTATE_SET_LOADING_TREE(value: boolean) {
        this.loadingTree = value;
    }
}

export const groupUserModule = getModule(GroupUserModule);
