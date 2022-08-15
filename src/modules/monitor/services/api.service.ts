import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';

class CameraGroupService extends BaseService {}
export const cameraGroupService = new CameraGroupService(
    { baseUrl: '/camera-group' },
    service,
);
