export interface IGroupUser {
    id: number;
    name: string;
    level: number;
    children: IGroupUser[];
    parentId: number | null;
}

export interface IRefGroupUser {
    id: number;
    userId: number;
    groupId: number;
}

export interface IBaseGroup {
    name: string;
}

export interface ICreateGroup extends IBaseGroup {
    parentId: number | null;
}

export type IUpdateGroup = IBaseGroup;

export interface IGroupUserPopupParams {
    isShow: boolean;
    isCreate: boolean;
}

export interface IQueryGroupUser {
    keyword?: string;
}
