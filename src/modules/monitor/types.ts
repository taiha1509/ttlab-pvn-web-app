import { LocationQuery } from 'vue-router';
import { IBodyResponse, ICommonListReponse } from '../common/types';

export interface ICameraGroupFilterForm {
    keyword?: string | null;
}

export interface ICameraGroup {
    _id: string;
    name: string;
    childs?: Record<string, string>[];
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

export interface ILiveViewQuery extends LocationQuery {
    cameraGroupId: string;
    cameraId: string;
}

export interface IUpdateCameraGroup {
    name: string;
}

type RTCIceTransportPolicy = 'all' | 'relay';

export interface RTCIceServer {
    credential?: string;
    urls: string | string[];
    username?: string;
}

export interface RTCConfiguration {
    iceServers?: RTCIceServer[];
    iceTransportPolicy?: RTCIceTransportPolicy;
}

export interface RTCIceCandidateInit {
    candidate?: string;
    sdpMLineIndex?: number | null;
    sdpMid?: string | null;
    usernameFragment?: string | null;
}

type RTCSdpType = 'answer' | 'offer' | 'pranswer' | 'rollback';

export interface RTCSessionDescriptionInit {
    sdp?: string;
    type: RTCSdpType;
}
export interface IAWSKey {
    accessKey: string;
    region: string;
    accessKeyId: string;
}

export interface ILiveView {
    _id: string;
    name: string;
    model: string;
    serialNumber: string;
    uid: string;
    channelName: string;
}

export interface ILiveViewListResponse extends ICommonListReponse<ILiveView>, IAWSKey {}

export interface ICameraInfo {
    _id: string;
    groupName: string;
    cameraName: string;
    channelARN: string;
    model: string;
}

export interface ICameraLayout {
    [key: number]: ICameraInfo;
}
