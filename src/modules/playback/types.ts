import { OrderDirection } from '../common/constants';

export interface IPlaybackDetail {
    _id?: string;
    camera?: string;
    schedule?: string;
    name?: string;
    src?: string;
    startAt?: Date | string;
    endAt?: Date | string;
    duration?: number | string; // seconds
    status?: string;
    format?: string;
    size?: number | string; // KB
    encoding?: string;
    createdBy?: number;
    createdAt?: Date | string;
    updatedBy?: number;
    updatedAt?: Date | string;
    deletedBy?: number;
    deletedAt?: Date | string;
}

export enum VideoOrderBy {
    NAME = 'name',
    END_AT = 'endAt',
    SIZE = 'size',
    DURATION = 'duration',
    CREATED_AT = 'createdAt',
}

export interface IPlaybackQuery {
    cameraId: string;
    keyword: string;
    startAt: string | Date;
    endAt: string | Date;
    page: number;
    limit: number;
    orderDirection: OrderDirection;
    orderBy: VideoOrderBy;
}

export interface ITableHeader {
    label: string;
    name: string;
    orderBy?: string;
    width?: string | number;
}
