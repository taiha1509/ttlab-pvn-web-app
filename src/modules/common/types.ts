import { AxiosResponse, AxiosInstance } from 'axios';
import { Vue } from 'vue-property-decorator';
import { ConfigurationAttribute } from '../camera/constants';
import { CameraListOrderBy, ElTableOrderDirection, OrderDirection } from './constants';

export interface IDeleteResponse {
    _id: string | number;
}
export interface IResponseError {
    key: string;
    errorCode: number;
    message: string;
    rule?: string;
    path?: string;
}

export interface ICommonListReponse<T> {
    items: T[];
    totalItems: number;
}

// Interfaces for general response of all apis
export interface IBodyResponse<T> extends AxiosResponse {
    success: boolean;
    isRequestError?: boolean;
    code: number;
    message: string;
    data: T;
    errors?: IResponseError[];
}

export interface ISelectOptions {
    label: string;
    value: string | number | boolean;
}

export interface IBreadcrumb {
    title: string;
    to?: string | Record<string, unknown>;
    isActive?: boolean;
}

export interface IPagination {
    page: number;
    limit: number;
}
export interface IQueryString extends IPagination {
    orderBy?: string | null;
    orderDirection?: OrderDirection | null;
}

export interface ISubMenu {
    icon?: string;
    name: string;
    class?: string;
    to?: string;
    badge?: number | string;
    active: boolean;
    subdrop?: boolean;
    hasNotify?: boolean;
    childs?: ISubMenu[];
    requiredPermissions?: string[];
    highlightMenu?: string;
}
export interface IMenu {
    icon?: string;
    name: string;
    class?: string;
    to?: string;
    badge?: number | string;
    active: boolean;
    subdrop?: boolean;
    hasNotify?: boolean;
    childs?: ISubMenu[];
    highlightMenu?: string;
}

export interface IPopupAttributes {
    confirmButtonText?: string | undefined;
    cancelButtonText?: string | undefined;
    confirmButtonClass?: string | undefined;
    cancelButtonClass?: string | undefined;
}

export interface IPaginationParams {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
}

export interface ITreeNode {
    id?: number;
    _id?: string;
    name: string;
    children?: ITreeNode[];
    level: number;
}

export interface ICommonOption {
    label: string;
    value: string | number;
}

export interface ICommonCameraListQuery {
    page: number;
    limit: number;
    keyword?: string;
    orderDirection?: OrderDirection;
    orderBy?: CameraListOrderBy;
}

export interface IUserDropdownResponse {
    id: number;
    username: string;
}

export interface IUserGroupDropdownResponse {
    id: number;
    name: string;
    children: IUserGroupDropdownResponse[];
}
export interface ISelectForm extends Vue {
    selectWrapper: Record<string, unknown>;
    blur: () => void;
}

export interface IGetListParams {
    limit?: number;
    page?: number;
}

export interface IServiceOption {
    baseUrl: string;
}

export interface IService {
    client: AxiosInstance;
    baseUrl: string;
}

export interface IMenuGroup {
    title?: string;
    class?: string;
    submenu: ISubMenu[];
}
export interface IUserDetailBase {
    id: number;
    email: string;
}

export interface ICameraModelDropDown {
    name: string;
    configurations: ConfigurationAttribute[];
}

export interface IPropSortTable {
    column: any;
    prop: string;
    order: ElTableOrderDirection | null;
}
