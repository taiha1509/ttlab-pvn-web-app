<template>
    <div class="video-wrapper">
        <div class="video-container" ref="videoContainer">
            <video
                @click="playVideo"
                class="video-player"
                id="video"
                ref="videoPlayBackPlayer"
                :src="srcVideo"
                @timeupdate="setCurrentTime"
            ></video>
            <div class="video-controls" id="video-controls">
                <el-slider
                    ref="timeShift"
                    id="timeShift"
                    :class="{
                        'slider-time': !isFullScreen,
                        'slider-time-fullscreen': isFullScreen,
                    }"
                    v-model="currentTime"
                    :min="0"
                    :max="rawDuration"
                    :step="0.001"
                    :show-tooltip="true"
                    @input="goToTime"
                    :format-tooltip="formatTimeTolltip"
                ></el-slider>
                <div class="btn-control">
                    <div class="element-left">
                        <div @click="playVideo" class="btn-play-video">
                            <img
                                v-show="isPlay"
                                src="@/assets/images/icons/icon-pause.svg"
                            />
                            <img
                                v-show="!isPlay"
                                src="@/assets/images/icons/icon-play.svg"
                            />
                        </div>
                        <div class="time">
                            <span style="color: white">{{ formatCurrentTime }}</span>
                            <span style="color: white">/</span>
                            <span style="color: white">{{ formatDuration }}</span>
                        </div>
                    </div>
                    <div class="element-right">
                        <div @click="muteVideo" class="btn-mute-video">
                            <img
                                v-if="isMute"
                                src="@/assets/images/icons/icon-volume-off.svg"
                            />
                            <img
                                v-else
                                src="@/assets/images/icons/icon-volume-high.svg"
                            />
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
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import moment from 'moment';

@Options({})
export default class PlayBackPlayer extends Vue {
    @Prop({ default: '' }) readonly src!: string;
    $video!: HTMLVideoElement;
    isPlay = false;
    isMute = false;
    isFullScreen = false;
    rawDuration = 0;
    currentTime = 0;
    volume = 0;

    get formatDuration(): string {
        return moment.utc(this.rawDuration * 1000).format('HH:mm:ss');
    }

    get formatCurrentTime(): string {
        return moment.utc(this.currentTime * 1000).format('HH:mm:ss');
    }

    get srcVideo(): string {
        return `${this.src}?${Date.now()}`;
    }

    setCurrentTime(): void {
        this.currentTime = +this.$video?.currentTime.toFixed(3);
    }

    videoPlayBackPlayer(): HTMLVideoElement {
        return this.$refs.videoPlayBackPlayer as HTMLVideoElement;
    }

    formatTimeTolltip(time: number): string {
        return moment.utc(time * 1000).format('HH:mm:ss');
    }

    mounted(): void {
        this.$video = this.videoPlayBackPlayer();
        this.$video.addEventListener('loadedmetadata', () => {
            this.rawDuration = this.$video?.duration;
            this.volume = this.$video.volume;
        });
        this.videoContainer().addEventListener(
            'fullscreenchange',
            this.checkExitVideoFullScreenWithKeyDown,
        );
    }

    checkExitVideoFullScreenWithKeyDown(): void {
        if (!document.fullscreenElement && this.isFullScreen) {
            this.isFullScreen = false;
        }
    }

    playVideo(): void {
        if (!this.isPlay) {
            this.$video.play();
            this.isPlay = true;
        } else {
            this.$video.pause();
            this.isPlay = false;
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

    goToTime(currentTime: number): void {
        this.$video.currentTime = currentTime;
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

    videoContainer(): HTMLElement {
        return this.$refs.videoContainer as HTMLElement;
    }

    toggleFullScreen(): void {
        this.isFullScreen = !this.isFullScreen;
        if (document.fullscreenElement) {
            // If the video is in full screen mode, exit full screen mode
            document.exitFullscreen();
        } else {
            this.videoContainer().requestFullscreen();
        }
    }
}
</script>

<style lang="scss" scoped>
.video-player {
    width: 100%;
    height: calc(100% + 5px);
    background: #333333;
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
.video-container {
    width: 100%;
    height: 100%;
    position: relative;
    .video-controls {
        position: absolute;
        bottom: 0;
        width: 100%;
        // box-shadow: inset 0 -50px 30px rgba(0, 0, 0, 0.5);
        z-index: 99;
    }
    .slider-time {
        margin: 0px;
        height: 17px;
    }
    .slider-time-fullscreen {
        margin: 0 8px !important;
        width: calc(100% - 16px) !important;
    }
    .btn-control {
        display: flex;
        justify-content: space-between;
    }
    .element-left {
        display: flex;
        align-items: center;
        .btn-play-video {
            margin: 0 8px;
            cursor: pointer;
        }
    }
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
    }
}
</style>
