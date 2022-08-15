import { ICameraDetail } from '../camera/types';

export interface ILayoutMapFile {
    originalName: string;
    fileName: string;
    extension: string;
    mimetype: string;
    size: number | null;
}

export interface ICameraCoordinate {
    cameraId: string;
    camera?: ICameraDetail;
    x: number | null;
    y: number | null;
}

export interface ILayoutMapDetail {
    _id?: string;
    cameraGroupId?: string;
    name?: string;
    file?: ILayoutMapFile;
    cameraCoordinates?: ICameraCoordinate[];
}

export interface ICreateLayoutMapBody {
    cameraGroupId: string;
    name: string;
    file: ILayoutMapFile;
}

export interface IUpdateLayoutMapBody {
    name?: string;
    cameraCoordinates: ICameraCoordinate[];
    file: ILayoutMapFile;
}

export interface ILayoutMapCamera extends ICameraDetail {
    isAssigned: boolean; // specify whether this camera is assigned on e-map or not
    x?: number | null;
    y?: number | null;
}

export interface ILayoutMapData {
    cameras: ILayoutMapCamera[];
}

export interface ILayoutMapForm {
    data: ILayoutMapData;
    originalData: ILayoutMapData;
}

export interface IDnDLayoutMapEvent {
    position: { x: number; y: number };
    data: ILayoutMapCamera;
}
