<template>
    <div class="liveview-container" :class="`layout-${isFullScreen}-${layout}`">
        <BaseLiveViewPlayer
            v-if="channelARN !== ''"
            :id="cameraInfo._id"
            :viewer="viewer"
            :cameraInfo="cameraInfo"
            :layout="layout"
            :isShowPanControl="isShowPanControl"
            :isShowTiltControl="isShowTiltControl"
            :isShowZoomControl="isShowZoomControl"
            @control-ptz="controlPTZ"
        />
        <div class="drag-block d-flex" v-else>
            <div class="img-block">
                <img
                    src="@/assets/images/drag_n_drop.png"
                    :width="50 / sizeOfIcon"
                    :height="50 / sizeOfIcon"
                />
            </div>
            <span
                class="mt-3 mb-1 fw-semibold row p-2 text-center text-center"
                :style="{ fontSize: fontSize }"
            >
                {{ $t('monitor.monitor.drag') }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import { UtilMixins } from '@/mixins/utilMixins';
import { Prop, Watch } from 'vue-property-decorator';
import { getAWSLiveView, stopViewerKinesis } from '../kinesisHelper';
import { ICameraInfo } from '../types';
import { PTZCommand, PTZValue } from '../../device-controller/constants';
import { deviceControllerService } from '../../device-controller/service/api.service';
import first from 'lodash/first';
import { liveViewModule } from '../store/monitor.store';
import { ICameraModelDropDown } from '@/modules/common/types';
import { ConfigurationAttribute } from '@/modules/camera/constants';
import i18n from '@/plugins/vue-i18n';
import { DEFAULT_FONT_SIZE } from '@/modules/common/constants';

@Options({
    components: {},
})
export default class LiveViewComponent extends mixins(UtilMixins) {
    @Prop({ default: '' }) readonly accessKeyId!: string;
    @Prop({ default: '' }) readonly secretAccessKey!: string;
    @Prop({ default: '' }) readonly region!: string;
    @Prop({ default: {} }) readonly cameraInfo!: ICameraInfo;
    @Prop({ default: 1 }) readonly layout!: number;
    @Prop({ default: '' }) readonly channelARN!: string;
    @Prop({ default: false }) readonly isFullScreen!: boolean;

    isShowPanControl = false;
    isShowTiltControl = false;
    isShowZoomControl = false;

    viewer = {} as Record<string, string> | unknown;

    get sizeOfIcon(): number {
        return this.layout === 1 ? Math.sqrt(this.layout) : Math.pow(this.layout, 0.25);
    }

    get fontSize(): string {
        return `${Math.ceil(
            DEFAULT_FONT_SIZE / Math.pow(this.layout, 0.1),
        )}px !important`;
    }

    get cameraModels(): ICameraModelDropDown[] {
        return liveViewModule.cameraModels;
    }

    @Watch('layout')
    updateWhenLayoutChange(): void {
        this.$forceUpdate();
    }

    getVideoStream(): void {
        // Get channel ARN
        const channelARN = this.cameraInfo.channelARN;
        if (channelARN) {
            setTimeout(async () => {
                try {
                    const remoteView = document.getElementById(
                        `${this.cameraInfo._id}`,
                    ) as HTMLMediaElement;
                    this.viewer = await getAWSLiveView(
                        this.region,
                        this.accessKeyId,
                        this.secretAccessKey,
                        channelARN,
                        remoteView,
                    );
                } catch (error) {
                    this.showErrorNotification(
                        i18n.global.t('monitor.monitor.error.aws') as string,
                    );
                }
            }, 500);
        }
    }

    @Watch('channelARN')
    async onPlay(oldVal: string, newVal: string): Promise<void> {
        if (newVal !== oldVal) {
            await stopViewerKinesis(this.viewer);
            this.getVideoStream();
        }
    }

    async controlPTZ(value: PTZValue): Promise<void> {
        const response = await deviceControllerService.controlCameraPTZ(
            this.cameraInfo?._id || '',
            {
                command: first(value.split('_')) as PTZCommand,
                value,
            },
        );
        if (!response.success && !response.isRequestError) {
            this.showErrorNotification(this.$t('common.app.errors.network'));
        }
    }

    @Watch('cameraInfo.model')
    onChangeCameraModel(modelName: string): void {
        const cameraModel = this.cameraModels.find((model) => model.name === modelName);
        const configurations = cameraModel?.configurations || [];
        this.isShowPanControl = configurations.includes(
            ConfigurationAttribute.CONTROL_PAN,
        );
        this.isShowTiltControl = configurations.includes(
            ConfigurationAttribute.CONTROL_TILT,
        );
        this.isShowZoomControl = configurations.includes(
            ConfigurationAttribute.CONTROL_ZOOM,
        );
    }
}
</script>

<style lang="scss" scoped>
.drag-block {
    margin-left: auto;
    margin-right: auto;
    flex-direction: column;
    justify-content: center;
}
:deep(.vjs-big-play-button) {
    display: none !important;
}
.img-block {
    text-align: center;
}
:deep(.camera-detail) {
    display: none !important;
}
.liveview-container {
    display: flex;
    border-radius: calc(0.5rem - 5px) calc(0.5rem - 5px) 0 0;
    border: 1px solid #e0e0e0;
    video {
        width: 100% !important;
    }
}
.layout-true-1 {
    height: calc(100vh - 80px) !important;
    :deep(.video-container) {
        height: calc(100% - 10px) !important;
    }
}
.layout-true-4 {
    height: calc((100vh - 80px) / 2) !important;
    :deep(.video-container) {
        height: calc(100% - 20px) !important;
    }
}
.layout-true-9 {
    height: calc((100vh - 80px) / 3) !important;
    :deep(.video-container) {
        height: calc(100% - 25px) !important;
    }
}
.layout-true-16 {
    height: calc((100vh - 80px) / 4) !important;
    :deep(.video-container) {
        height: calc(100% - 30px) !important;
    }
}
.layout-false-1 {
    height: calc(100vh - 275px) !important;
    :deep(.video-container) {
        height: calc(100% - 10px) !important;
    }
}
.layout-false-4 {
    height: calc((100vh - 280px) / 2) !important;
    :deep(.video-container) {
        height: calc(100% - 20px) !important;
    }
}
.layout-false-9 {
    height: calc((100vh - 285px) / 3) !important;
    :deep(.video-container) {
        height: calc(100% - 25px) !important;
    }
}
.layout-false-16 {
    height: calc((100vh - 290px) / 4) !important;
    :deep(.video-container) {
        height: calc(100% - 30px) !important;
    }
}
</style>
