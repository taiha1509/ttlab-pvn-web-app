import { IBodyResponse, ICommonListReponse } from '../common/types';

export interface ICameraGroupFilterForm {
    keyword?: string | null;
}

export interface ICameraGroup {
    _id: string;
    name: string;
    children?: ICameraGroup[];
    level: number;
}

export interface ICameraGroupDetail {
    _id: string;
    name: string;
}
export interface IGetListCameraGroupResponse
    extends IBodyResponse<ICommonListReponse<ICameraGroup>> {
    data: {
        items: ICameraGroup[];
        totalItems: number;
    };
}

export interface IUpdateCameraGroup {
    name: string;
}

export interface IGetDetailCameraGroup extends IBodyResponse<ICameraGroupDetail> {
    data: ICameraGroupDetail;
}
