<template>
    <LayoutMainContent :breadcrumbs="breadcrumbs" :isShowSubSideBar="false">
        <template #filter-form>
            <FilterForm @on-search-playback-list="searchPlaybackList" />
        </template>
        <template #content>
            <PlaybackList
                @keydown.enter="searchPlaybackList"
                @on-search-playback-list="searchPlaybackList"
            />
        </template>
    </LayoutMainContent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FilterForm from '../components/FilterForm.vue';
import PlaybackList from '../components/PlaybackList.vue';
import { initPlaybackQuery, playbackModule } from '../store/playback.store';
import { IPlaybackQuery } from '../types';
import { ElLoading } from 'element-plus';
import { IBreadcrumb } from '@/modules/common/types';

@Options({
    components: { FilterForm, PlaybackList },
})
export default class PlaybackPage extends Vue {
    get breadcrumbs(): IBreadcrumb[] {
        return [
            {
                title: this.$t('common.app.sidebar.monitoring'),
            },
            {
                title: this.$t('common.app.sidebar.playback'),
                isActive: true,
            },
        ];
    }

    get query(): IPlaybackQuery {
        return playbackModule.playbackQuery;
    }

    async created(): Promise<void> {
        const loading = ElLoading.service({
            target: '.page-content',
        });
        playbackModule.setLoadingPlaybackTable(true);
        await Promise.all([
            playbackModule.getAllCameraList(),
            playbackModule.getPlaybackList(this.query),
        ]);
        playbackModule.setLoadingPlaybackTable(false);
        loading.close();
    }

    beforeCreate(): void {
        if (window.history.state?.back.split('/')[1] !== 'playback') {
            playbackModule.SET_PLAYBACK_LIST({ items: [], totalItems: 0 });
            playbackModule.SET_PLAYBACK_QUERY({ ...initPlaybackQuery });
        }
    }

    async searchPlaybackList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.page-content',
        });
        await playbackModule.getPlaybackList(this.query);
        loading.close();
    }
}
</script>
<style lang="scss" scoped></style>
