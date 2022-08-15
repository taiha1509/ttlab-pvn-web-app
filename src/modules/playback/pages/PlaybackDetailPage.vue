<template>
    <LayoutMainContent :breadcrumbs="breadcrumbs" :isShowSubSideBar="false">
        <template #content>
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">{{ playbackDetail.name }}</h4>
                </div>
                <div class="card-body">
                    <div class="ratio">
                        <BasePlaybackPlayer
                            v-if="playbackDetail.src !== ''"
                            :src="playbackDetail.src"
                        />
                    </div>
                </div>
            </div>
        </template>
    </LayoutMainContent>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { IBreadcrumb } from '@/modules/common/types';
import { ElLoading } from 'element-plus';
import { Options, mixins } from 'vue-class-component';
import { playbackModule } from '../store/playback.store';
import { IPlaybackDetail } from '../types';

@Options({})
export default class PlaybackDetailPage extends mixins(UtilMixins) {
    get breadcrumbs(): IBreadcrumb[] {
        return [
            {
                title: this.$t('common.app.sidebar.monitoring'),
            },
            {
                title: this.$t('common.app.sidebar.playback'),
                to: '/playback',
            },
            {
                title: this.$t('playback.playback.breadcrumbs.video'),
                isActive: true,
            },
        ];
    }

    async created(): Promise<void> {
        playbackModule.SET_PLAYBACK_DETAIL({});
        this.getPlaybackDetail();
    }

    async getPlaybackDetail(): Promise<void> {
        const id = this.$route?.params?.id as string;
        const loading = ElLoading.service({
            target: '.page-content',
        });
        const response = await playbackModule.getPlaybackDetail(id || '');
        loading.close();
        if (!response.isRequestError && !response.success) {
            this.showErrorNotification(this.$t('playback.playback.error.videoNotExist'));
            this.$router.push('/playback');
        }
    }

    get playbackDetail(): IPlaybackDetail {
        return playbackModule.playbackDetail;
    }
}
</script>
<style lang="scss" scoped>
.ratio {
    height: calc(100vh - 264px);
}
</style>
