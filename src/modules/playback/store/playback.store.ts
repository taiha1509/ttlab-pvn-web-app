import { getModule, VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from '@/store';
import moment from 'moment';
import { DEFAULT_LIST_LIMIT, PLAYBACK_MUTATION } from '../contants';
import { IPlaybackDetail, IPlaybackQuery, VideoOrderBy } from '../types';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_SIZE_PER_PAGE,
    OrderDirection,
} from '@/modules/common/constants';
import { playbackService } from '../services/api.service';
import { ICameraDetail } from '@/modules/camera/types';
import { IBodyResponse } from '@/modules/common/types';
import { commonService } from '@/modules/common/service/api.service';
import { PermissionActions, PermissionResources } from '@/modules/role/role.constant';
import { appService } from '@/utils/app';

export const initPlaybackQuery = {
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_SIZE_PER_PAGE,
    startAt: moment().subtract(1, 'year').startOfDay().fmFullTimeString(),
    endAt: moment().add(1, 'year').endOfDay().fmFullTimeString(),
    keyword: '',
    cameraId: '',
    orderDirection: OrderDirection.DESC,
    orderBy: VideoOrderBy.CREATED_AT,
};

@Module({ dynamic: true, namespaced: true, store, name: 'playback' })
class PlaybackModule extends VuexModule {
    playbackQuery: IPlaybackQuery = { ...initPlaybackQuery };

    playbackDetail: IPlaybackDetail = {};
    playbackList: IPlaybackDetail[] = [];
    totalPlaybacks = 0;
    cameraList: ICameraDetail[] = [];
    loadingPlaybackTable = false;

    // return the user permission in role module
    get userPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.PLAYBACK);
    }

    @Action
    async getAllCameraList() {
        const response = await commonService.getDropdownCameraList({
            page: 1,
            limit: DEFAULT_LIST_LIMIT,
        });
        const data = (response.data || []) as ICameraDetail[];
        this.SET_CAMERA_LIST(data);
        return response;
    }

    @Action
    async getPlaybackList(query: IPlaybackQuery) {
        const response = await playbackService.getList({
            page: query.page,
            limit: query.limit,
            startAt: query.startAt,
            endAt: query.endAt,
            keyword: query.keyword,
            orderDirection: query.orderDirection,
            orderBy: query.orderBy,
            cameraIds: query.cameraId ? [query.cameraId] : [],
        });
        this.SET_PLAYBACK_LIST(response.data || {});
        return response;
    }

    @Action
    async getPlaybackDetail(id: string) {
        const response = (await playbackService.getDetail(
            id,
        )) as IBodyResponse<IPlaybackDetail>;
        this.SET_PLAYBACK_DETAIL(response.data || {});
        return response;
    }

    @Action
    setLoadingPlaybackTable(value: boolean) {
        this.MUTATE_SET_LOADING_PLAY_BACK_TABLE(value);
    }

    @Mutation
    [PLAYBACK_MUTATION.SET_PLAYBACK_QUERY](query: IPlaybackQuery) {
        this.playbackQuery = query;
    }

    @Mutation
    [PLAYBACK_MUTATION.SET_CAMERA_LIST](data: ICameraDetail[]) {
        this.cameraList = data || [];
    }

    @Mutation
    [PLAYBACK_MUTATION.SET_PLAYBACK_LIST](data: {
        items: IPlaybackDetail[];
        totalItems: number;
    }) {
        this.playbackList = data.items || [];
        this.totalPlaybacks = data.totalItems || 0;
    }

    @Mutation
    [PLAYBACK_MUTATION.SET_PLAYBACK_DETAIL](data: IPlaybackDetail) {
        this.playbackDetail = data || {};
    }

    @Mutation
    MUTATE_SET_LOADING_PLAY_BACK_TABLE(value: boolean) {
        this.loadingPlaybackTable = value;
    }
}

export const playbackModule = getModule(PlaybackModule);
