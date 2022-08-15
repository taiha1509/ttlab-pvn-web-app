<template>
    <div class="playback-list">
        <BasePagination
            v-model:onChangePage="query.page"
            :isShowPagination="true"
            :totalItems="totalItems"
            :pageSize="query.limit"
            @changePageSize="handleChangePageSize"
            @handlePaginate="handlePaginate"
        />
        <div class="playback-table">
            <BaseTableLayout
                v-show="!loadingPlaybackTable"
                :data="playbackList"
                @row-click="showPlaybackVideo"
                @onSort="onSort"
                :layoutHasFilterForm="true"
            >
                <template #table-columns>
                    <el-table-column type="index" align="center" :label="'#'" />
                    <el-table-column
                        v-for="(header, index) in tableHeaders"
                        :key="index"
                        :prop="header.name"
                        :sortable="header.orderBy"
                    >
                        <template #header>
                            <div class="playback-header">
                                {{ header.label }}
                            </div>
                        </template>
                        <template #default="{ row }">
                            <template v-if="header.name === 'name'">
                                <el-tooltip
                                    placement="right-end"
                                    :key="index"
                                    :hide-after="0"
                                    :append-to-body="false"
                                >
                                    <template #content>
                                        <span>
                                            {{ $t('playback.playback.recordedDate') }}:
                                            {{ row['startAt'] }}
                                        </span>
                                        <br />
                                        <span>
                                            {{ $t('playback.playback.updatedDate') }}:
                                            {{ row['updatedAt'] }}
                                        </span>
                                    </template>
                                    <div>{{ row[header.name] }}</div>
                                </el-tooltip>
                            </template>
                            <template v-else>
                                <div>{{ row[header.name] }}</div>
                            </template>
                        </template>
                    </el-table-column>
                </template>
            </BaseTableLayout>
        </div>
    </div>
</template>

<script lang="ts">
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    ElTableOrderDirection,
    OrderDirection,
    PageName,
} from '@/modules/common/constants';
import { IPropSortTable } from '@/modules/common/types';
import moment from 'moment';
import { Options, Vue } from 'vue-class-component';
import { parseSecondsToHMS } from '../helpers';
import { playbackModule } from '../store/playback.store';
import { IPlaybackDetail, IPlaybackQuery, ITableHeader, VideoOrderBy } from '../types';

@Options({})
export default class PlaybackList extends Vue {
    headers = [
        { name: 'name', orderBy: VideoOrderBy.NAME },
        { name: 'createdAt', orderBy: VideoOrderBy.CREATED_AT },
        { name: 'format' },
        { name: 'size', orderBy: VideoOrderBy.SIZE },
        { name: 'duration', orderBy: VideoOrderBy.DURATION },
        // { name: 'encoding' },
    ];

    get loadingPlaybackTable(): boolean {
        return playbackModule.loadingPlaybackTable;
    }

    get tableHeaders(): ITableHeader[] {
        return this.headers.map((item) => ({
            ...item,
            label: this.$t(`playback.playback.tableHeader.${item.name}`) as string,
        }));
    }

    get totalItems(): number {
        return playbackModule.totalPlaybacks;
    }

    get playbackList(): IPlaybackDetail[] {
        const playbackList = playbackModule.playbackList || [];
        return playbackList.map((item) => ({
            ...item,
            startAt: item.startAt ? moment(item.startAt).fmFullTimeString() : '',
            endAt: item.endAt ? moment(item.endAt).fmFullTimeString() : '',
            createdAt: item.createdAt ? moment(item.createdAt).fmFullTimeString() : '',
            updatedAt: item.updatedAt ? moment(item.updatedAt).fmFullTimeString() : '',
            size: `${item.size} KB`,
            duration: parseSecondsToHMS(item.duration as number),
        }));
    }

    get query(): IPlaybackQuery {
        return playbackModule.playbackQuery;
    }

    handleChangePageSize(limit: number): void {
        playbackModule.SET_PLAYBACK_QUERY({
            ...this.query,
            page: DEFAULT_FIRST_PAGE,
            limit,
        });
        this.$emit('on-search-playback-list');
    }

    handlePaginate(page: number): void {
        playbackModule.SET_PLAYBACK_QUERY({
            ...this.query,
            page,
        });
        this.$emit('on-search-playback-list');
    }

    onSort(scoped: IPropSortTable): void {
        const cloneQuery = { ...this.query };
        cloneQuery.orderDirection =
            scoped.order === ElTableOrderDirection.ASCENDING
                ? OrderDirection.ASC
                : OrderDirection.DESC;

        cloneQuery.orderBy = (scoped.prop as VideoOrderBy) || DEFAULT_ORDER_BY;
        playbackModule.SET_PLAYBACK_QUERY(cloneQuery);
        this.$emit('on-search-playback-list');
    }

    showPlaybackVideo(playback: IPlaybackDetail): void {
        this.$router.push({
            name: PageName.PLAYBACK_DETAIL_PAGE,
            params: { id: playback._id },
        });
    }
}
</script>

<style lang="scss" scoped>
.playback-list :deep(.el-pagination) {
    text-align: right;
}
:deep(.el-table__row) {
    .el-popper {
        width: 250px;
    }
}
:deep(.el-table__row) {
    &:hover {
        cursor: pointer;
    }
}

.playback-header {
    display: inline;
}
</style>
