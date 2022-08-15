import { IBodyResponse, ICommonListReponse, IQueryString } from '../common/types';
import { ICameraGroup } from '../camera-group/types';
import {
    ConnectionStatus,
    Encoding,
    Resolution,
    ScheduleRepeatType,
    Weekday,
} from './constants';

export interface ICameraFilterForm {
    keyword?: string | null;
    uid?: string | null;
    cameraGroupId?: string | null;
}

export interface IQueryStringCamera extends IQueryString, ICameraFilterForm {}

export interface ICamera {
    _id: string;
    model: string;
    serialNumber: string;
    name: string;
    password: string;
    uid: string;
    connectionStatus: ConnectionStatus;
}

export interface ICameraDnD {
    _id: string;
    model: string;
    serialNumber: string;
    name: string;
    uid: string;
    channelName: string;
}

export interface IDnDCameraEvent {
    data: ICameraDnD;
}

export interface ILiveViewCamera {
    _id: string;
    name: string;
    channelName: string;
    model: string;
}

export interface IGetListCameraResponse
    extends IBodyResponse<ICommonListReponse<ICamera>> {
    data: {
        items: ICamera[];
        totalItems: number;
    };
}

export interface ICameraGroupDropdown extends IBodyResponse<ICameraGroup[]> {
    data: ICameraGroup[];
}

export interface IUserDetail {
    id: number;
    username: string;
}

export interface IUserGroupDetail {
    id: number;
    name: string;
}

export interface ICameraRecordingConfiguration {
    hasAudio: boolean;
    gpsLocate: boolean;
    encoding: Encoding | null;
    resolution: Resolution | null;
}
export interface ICameraDetail extends ICamera {
    _id: string;
    cameraGroups?: ICameraGroup[] | null;
    cameraGroupIds?: string[];
    userIds?: number[];
    userGroupIds?: number[];
    password: string;
    userName?: string;
    onvifProfile?: Record<string, string>;
    usersInfo?: IUserDetail[];
    groupUserInfo?: IUserGroupDetail[];
    configurations?: string[];
    recordingConfiguration?: ICameraRecordingConfiguration;
}
export interface ICameraForm extends ICamera {
    _id: string;
    cameraGroups?: string[] | null;
    userIds?: number[];
    userGroupIds?: number[];
}

export interface IGetDetailCamera extends IBodyResponse<ICameraDetail> {
    data: ICameraDetail;
}

export interface IUpdateCamera {
    name: string;
    cameraGroups: string[] | null;
    userIds: number[];
    userGroupIds: number[];
}

export interface ISchedule {
    _id?: string | null;
    startDate: Date | string;
    endDate: Date | string;
    timeRange: {
        start: string;
        end: string;
    };
    repeatType: ScheduleRepeatType | string;
    repeatDays: Weekday[];
}

export interface IScheduleConfiguration {
    _id?: string;
    cameraId?: string;
    repeatDays?: Weekday[];
    repeatType?: ScheduleRepeatType;
    repeatEndDate?: string;
    initEndAt?: string;
    initStartAt?: string;
    recordAtServer?: boolean;
}

export interface IUpdateScheduleConfigurationBody {
    cameraId: string;
    initStartAt: string;
    initEndAt: string;
    repeatEndDate: string;
    repeatType: string;
    repeatDays: string[];
    recordAtServer: boolean;
}
export interface ICreateScheduleConfigurationBody {
    initStartAt: string;
    initEndAt: string;
    repeatEndDate: string;
    repeatType: string;
    repeatDays: string[];
    recordAtServer: boolean;
}

export interface IScheduleConfigurationForm {
    data: {
        startDate?: string | Date;
        endDate?: string | Date;
        startTime?: string;
        endTime?: string;
        repeatType?: string;
        repeatDays?: string[];
    };
    error: {
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
        repeatType?: string;
        repeatDays?: string;
    };
}

export interface ISocketRefreshConnectionStatusBody {
    clientSocketRoom: string;
}

export interface ISocketConnectionStatusResponse {
    clientSocketRoom: string;
    uid: string;
}
