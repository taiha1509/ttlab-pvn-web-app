<template>
    <div class="filter-form">
        <BaseFilterForm :isShowCreateButton="false" @search="searchPlaybackList">
            <template #filter-title>
                <h5 class="filter-title">
                    {{ $t('common.app.filterForm.searchBy') }}
                </h5>
            </template>
            <slot>
                <div class="row">
                    <div class="col-xl-4 col-md-6 col-12 mb-sm-2">
                        <BaseDatePicker
                            v-model:value="timeRange"
                            class="date-time-picker"
                            :placeholder="$t('playback.playback.placeholder.timeRange')"
                            :clearable="false"
                            type="datetimerange"
                            :dateFormat="format"
                            :valueFormat="valueFormat"
                            @changeValue="searchPlaybackList"
                        />
                    </div>
                    <div class="col-xl-4 col-md-6 col-12 mb-sm-2">
                        <BaseInputText
                            v-model:value="keyword"
                            :placeholder="$t('playback.playback.placeholder.keyword')"
                            @on-enter="searchPlaybackList"
                        />
                    </div>
                    <div class="col-xl-4 col-md-6 col-12 mb-sm-2">
                        <BaseAutoComplete
                            v-model:value="cameraId"
                            :placeholder="
                                $t('playback.playback.placeholder.cameraSelect')
                            "
                            :options="cameraOptions"
                        />
                    </div>
                </div>
            </slot>
        </BaseFilterForm>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { DATE_TIME_FORMAT, PageName } from '@/modules/common/constants';
import { initPlaybackQuery, playbackModule } from '../store/playback.store';
import { IPlaybackQuery } from '../types';
import moment from 'moment';
import { ICommonOption } from '@/modules/common/types';
import { ICameraDetail } from '@/modules/camera/types';

@Options({})
export default class FilterForm extends Vue {
    format = DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_mm_DIV;
    valueFormat = DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_mm_ss_DIV;

    get playbackQuery(): IPlaybackQuery {
        return playbackModule.playbackQuery || {};
    }

    get timeRange(): (string | Date)[] | null {
        return this.playbackQuery.startAt && this.playbackQuery.endAt
            ? [this.playbackQuery.startAt, this.playbackQuery.endAt]
            : null;
    }

    set timeRange(value: (string | Date)[] | null) {
        const [startAt, endAt] = value || [];
        playbackModule.SET_PLAYBACK_QUERY({
            ...this.playbackQuery,
            startAt: startAt ? moment(startAt).fmFullTimeString() : '',
            endAt: endAt ? moment(endAt).fmFullTimeString() : '',
        });
    }

    get keyword(): string {
        return this.playbackQuery.keyword || '';
    }

    set keyword(keyword: string) {
        playbackModule.SET_PLAYBACK_QUERY({
            ...this.playbackQuery,
            keyword,
        });
    }

    get cameraId(): string {
        return this.playbackQuery?.cameraId;
    }

    set cameraId(cameraId: string) {
        playbackModule.SET_PLAYBACK_QUERY({
            ...this.playbackQuery,
            cameraId,
        });
    }

    get cameraList(): ICameraDetail[] {
        return playbackModule.cameraList || [];
    }

    get cameraOptions(): ICommonOption[] {
        return this.cameraList.map((camera) => ({
            label: camera.name || '',
            value: camera._id,
        }));
    }

    searchPlaybackList(): void {
        this.$emit('on-search-playback-list');
    }

    beforeUnmount(): void {
        const nextPage = this.$route.name;
        if (nextPage !== PageName.PLAYBACK_DETAIL_PAGE) {
            playbackModule.SET_PLAYBACK_QUERY({ ...initPlaybackQuery });
        }
    }
}
</script>

<style lang="scss" scoped>
.date-time-picker {
    :deep(.el-date-editor--datetimerange.el-input__inner) {
        width: 100%;
    }
}
</style>
