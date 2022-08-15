import { Vue } from 'vue-class-component';
import { PermissionActions, PermissionResources } from './role.constant';

export interface IPermissionAction {
    id: number;
    content: PermissionActions;
}

export interface IPermissionResource {
    id: number;
    content: PermissionResources;
}

export interface IRole {
    id: number;
    name: string;
    description: string;
    permissions: {
        id: number;
        actionId: number;
        resourceId: number;
        action: IPermissionAction;
        resource: IPermissionResource;
    }[];
}

export interface IPermissionTree {
    id?: number;
    name: string;
    resource?: PermissionResources;
    children?: IPermissionTree[];
}

export interface IAction {
    permissionId: number;
    action: PermissionActions;
}

export interface IPermission {
    resource: PermissionResources;
    actions: IAction[];
}

export interface ICreateRoleDto {
    name: string;
    permissionIds: number[];
    description: string;
}

export type IUpdateRoleDto = ICreateRoleDto;

export interface ITreeStatus {
    checkedKeys: string[];
    checkedNodes: IPermissionTree[];
    halfCheckedKeys: string[];
    halfCheckedNodes: IPermissionTree[];
}

export type PermissionTree = Vue & {
    setChecked: (data: IPermissionTree | number, checked: boolean, deep: boolean) => void;
};
