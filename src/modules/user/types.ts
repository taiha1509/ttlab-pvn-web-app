import { IQueryString } from '../common/types';
import { IRole } from '../role/type';
import { IGroupUser, IRefGroupUser } from '../user-group/types';
import { UserAction, UserStatus, UserTypes } from './constant';

export interface IUserFilterForm {
    keyword?: string;
    roleIds?: number[];
    groupIds?: number[];
    statuses?: UserStatus[];
} /*  */

export interface IUserQueryString extends IQueryString, IUserFilterForm {}

export interface IuserPopParams {
    action: UserAction;
    isShowFormPopup: boolean;
    isShowDetailPopup: boolean;
}

export interface IUserRequest {
    username: string;
    email: string | null;
    fullName: string | null;
    phoneNumber: string | null;
    roleIds: number[];
    groupIds: number[];
    password: string;
    confirmPassword: string;
    status: UserStatus;
    action: UserAction;
    cameraIds: string[];
    cameraGroupIds: string[];
}

export interface ICVMCameraDetailResponseDto {
    _id: string;
    name: string;
}

export interface ICVMCameraGroupDetailResponseDto {
    _id: string;
    name: string;
}

export interface IUserDetailReponse {
    id?: number;
    username: string;
    email: string;
    fullName?: string | null;
    phoneNumber: string | null;
    types: UserTypes[];
    roles: IRole[];
    status: UserStatus;
    groups: IGroupUser[];
    groupUsers: IRefGroupUser[];
    action?: UserAction;
    cameras: ICVMCameraDetailResponseDto[];
    cameraGroups: ICVMCameraGroupDetailResponseDto[];
    firstLogin?: boolean;
}

export interface ICameraDropdown {
    _id: string;
    serialNumber: string;
    name: string;
    cameraGroupId: string;
}

export interface ICameraGroupDropdown {
    _id: string;
    children: ICameraGroupDropdown[];
    level: number;
    name: string;
}

export interface IRoleDropdown {
    id: number;
    name: string;
}
