import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';

class PlaybackService extends BaseService {
    //
}
export const playbackService = new PlaybackService({ baseUrl: '/video' }, service);
