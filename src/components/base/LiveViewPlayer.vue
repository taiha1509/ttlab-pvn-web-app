<template>
    <div class="video-wrapper">
        <div class="camera-info" v-if="isShowCameraInfo">
            <span :style="textStyle">{{ cameraInfo?.cameraName }}</span>
            <span :style="textStyle">{{ cameraInfo?.groupName || '' }}</span>
        </div>
        <div class="video-container" ref="videoContainer">
            <el-tooltip
                effect="dark"
                :content="$t('common.app.tooltip.removeCamera')"
                placement="left"
                :hide-after="0"
                v-if="isShowCloseBtn"
                :visible-arrow="false"
            >
                <button class="close-btn" @click="onClickCloseBtn">
                    <el-icon>
                        <CloseBold style="width: 1em, height: 1em" />
                    </el-icon>
                </button>
            </el-tooltip>
            <video class="video-player" ref="videoLiveViewPlayer" :id="id" />
            <div class="video-control">
                <div class="element-right">
                    <div id="ptz-control-btn" class="btn-ptz-control">
                        <img src="@/assets/images/icons/icon-control.svg" />
                        <PTZcontrol id="ptz-containter" class="js-ptz-container" />
                    </div>
                    <div @click="muteVideo" class="btn-mute-video">
                        <img
                            v-if="isMute"
                            src="@/assets/images/icons/icon-volume-off.svg"
                        />
                        <img v-else src="@/assets/images/icons/icon-volume-high.svg" />
                    </div>
                    <el-slider
                        class="slider-volume"
                        v-model="volume"
                        :min="0"
                        :max="1"
                        :step="0.001"
                        :show-tooltip="false"
                        @input="setVolume"
                    ></el-slider>
                    <div @click="toggleFullScreen" class="btn-mute-full-screen">
                        <img
                            v-if="isFullScreen"
                            src="@/assets/images/icons/icon-fullscreen-exit.svg"
                        />
                        <img v-else src="@/assets/images/icons/icon-fullscreen.svg" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { CloseBold } from '@element-plus/icons-vue';
import { liveViewModule } from '@/modules/monitor/store/monitor.store';
import { stopViewerKinesis } from '@/modules/monitor/kinesisHelper';
import PTZControl from '../video/PTZControl.vue';
import { createApp } from 'vue';
import get from 'lodash/get';

@Options({
    components: { CloseBold },
})
export default class LiveViewPlayer extends Vue {
    @Prop({ default: '' }) readonly src!: string;
    @Prop({ default: '' }) readonly type!: string;
    @Prop({ default: 'video' }) readonly id!: string;
    @Prop({ default: {} }) readonly cameraInfo!: Record<string, string>;
    @Prop({ default: true }) readonly isShowCloseBtn!: boolean;
    @Prop({ default: false }) readonly isShowPanControl!: boolean;
    @Prop({ default: false }) readonly isShowTiltControl!: boolean;
    @Prop({ default: false }) readonly isShowZoomControl!: boolean;
    @Prop({ default: true }) readonly isShowCameraInfo!: boolean;
    @Prop({ default: {} }) readonly viewer!: Record<string, string>;
    @Prop({ default: 1 }) readonly layout!: number;

    addPTZButton = false;
    $video!: HTMLVideoElement;
    isMute = false;
    isFullScreen = false;
    volume = 1;

    onClickCloseBtn(): void {
        const index = liveViewModule.cameraList.findIndex((ele) => ele._id === this.id);
        if (index > -1)
            liveViewModule.cameraLayoutList.push(liveViewModule.cameraList[index]);
        liveViewModule.removeCameraInLayout(this.id);
        const remoteView = document.getElementById(
            `${this.cameraInfo._id}`,
        ) as HTMLMediaElement;
        if (remoteView) stopViewerKinesis(remoteView);
    }

    videoLiveViewPlayer(): HTMLVideoElement {
        return this.$refs.videoLiveViewPlayer as HTMLVideoElement;
    }

    videoContainer(): HTMLElement {
        return this.$refs.videoContainer as HTMLElement;
    }

    toggleFullScreen(): void {
        if (document.fullscreenElement) {
            // If the video is in full screen mode, exit full screen mode
            this.isFullScreen = false;
            document.exitFullscreen();
        } else {
            this.isFullScreen = true;
            this.videoContainer().requestFullscreen();
        }
    }

    muteVideo(): void {
        if (!this.isMute) {
            this.$video.muted = true;
            this.isMute = true;
            this.volume = 0;
        } else {
            this.$video.muted = false;
            this.isMute = false;
            this.volume = this.$video.volume;
        }
    }

    setVolume(volume: number): void {
        this.$video.volume = +volume;
        this.volume = +volume;
        if (volume === 0) {
            this.isMute = true;
        } else {
            this.isMute = false;
        }
    }

    addPTZControlComponent(): void {
        // create ptz controller container
        const ptzControl = createApp(PTZControl, {
            isShowPanControl: this.isShowPanControl,
            isShowTiltControl: this.isShowTiltControl,
            isShowZoomControl: this.isShowZoomControl,
        });
        const ptzContainer = this.$el.querySelector('#ptz-containter');
        const ptzControlButton = this.$el.querySelector('#ptz-control-btn');
        ptzControlButton.appendChild(ptzContainer);
        ptzControlButton.addEventListener('mouseover', () => {
            ptzContainer.classList.add('is-show-ptz-container');
        });
        ptzControlButton.addEventListener('mouseleave', () => {
            ptzContainer.classList.remove('is-show-ptz-container');
        });
        const ptzControlComponent = ptzControl.mount(ptzContainer);
        // create ptz controller button
        ptzContainer.addEventListener('click', () => {
            const ptzValue = get(ptzControlComponent, 'ptzValue');
            this.$emit('control-ptz', ptzValue);
        });
    }

    mounted(): void {
        this.$video = this.videoLiveViewPlayer();
        if (this.$video) {
            this.$video.addEventListener('loadedmetadata', () => {
                this.volume = this.$video.volume;
            });
            this.$video.play();
            this.addPTZControlComponent();
        }
    }

    get textStyle(): Record<string, string> {
        return {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: `${200 / Math.sqrt(this.layout)}px`,
        };
    }
}
</script>

<style lang="scss" scoped>
:deep(.btn-ptz-control) {
    position: relative;
    .js-ptz-container {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        transform: translate(-40%, -100%);
        transition: all 0.15s ease-in-out;
        background: black;
        opacity: 0.7;
        width: 130px;
        height: 25px;
        display: none;
    }
    .is-show-ptz-container {
        display: block !important;
    }
}
.video-player {
    width: 100%;
    height: 100%;
    background: #333333;
}
.close-btn {
    right: 0;
    position: absolute;
    z-index: 1;
    border-radius: 50%;
    background: #303134;
    border: 0px;
    color: #e0e0e0;
    margin-top: 5px;
    margin-right: 5px;
}
.video-wrapper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    width: 100% !important;
}
.video-wrapper > video {
    width: 100%;
}
.camera-info {
    display: flex;
    font-size: 14px;
    font-weight: 500;
    color: #2c3652;
    justify-content: space-between;
    margin-bottom: 8px;
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
}
.video-container {
    width: 100%;
    height: 100%;
    position: relative;
    .video-control {
        display: flex;
        justify-content: flex-end;
        position: absolute;
        bottom: 0;
        width: 100%;
        box-shadow: inset 0 -50px 30px rgba(0, 0, 0, 0.5);
        z-index: 99;
        .element-right {
            display: flex;
            align-items: center;
            .btn-mute-video {
                margin: 0 10px;
                cursor: pointer;
            }
            .slider-volume {
                width: 40px;
            }
            .btn-mute-full-screen {
                margin: 0 8px 0 10px;
                cursor: pointer;
            }
            .btn-ptz-control {
                margin: 0 8px 0 10px;
                cursor: pointer;
            }
        }
    }
}
</style>
