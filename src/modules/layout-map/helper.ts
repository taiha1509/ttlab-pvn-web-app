import cloneDeep from 'lodash/cloneDeep';
import { ICameraDetail } from '../camera/types';
import { ICameraCoordinate, ILayoutMapCamera } from './types';

export function parseLayoutMapCameras(data: {
    selectedGroupId: string;
    allCameraList: ICameraDetail[];
    assignedCameras: ICameraCoordinate[];
}): ILayoutMapCamera[] {
    const assignedCameraObj = (data.assignedCameras || []).reduce(
        (acc: Record<string, ICameraCoordinate>, cameraCoordinate) => {
            acc[cameraCoordinate.cameraId] = cameraCoordinate;
            return acc;
        },
        {},
    );

    const camerasByGroupId = cloneDeep(data.allCameraList || []).reduce(
        (acc: ILayoutMapCamera[], camera) => {
            const assignedCamera = assignedCameraObj[camera._id];
            const parsedCamera: ILayoutMapCamera = {
                ...camera,
                isAssigned: !!assignedCamera,
                x: assignedCamera?.x,
                y: assignedCamera?.y,
            };
            acc.push(parsedCamera);
            return acc;
        },
        [],
    );
    return camerasByGroupId;
}
