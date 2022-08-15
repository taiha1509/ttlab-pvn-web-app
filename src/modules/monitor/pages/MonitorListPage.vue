<template>
    <LayoutMainContent class="live-view-page" :breadcrumbs="breadcrumbs">
        <template #sub-side-bar>
            <div class="card filter-form">
                <div class="card-header d-flex">
                    <h4 class="my-0 align-self-center">
                        {{ $t('common.app.sidebar.cameraGroup') }}
                    </h4>
                </div>
                <div class="card-body">
                    <BaseSingleSelectTreeView
                        v-model:value="cameraGroupId"
                        :treeData="cameraGroups"
                        :filterable="true"
                        @onClickNode="onClickNode"
                        :placeholder="$t('common.app.filterForm.select')"
                    />
                    <h4>
                        {{ $t('common.app.sidebar.camera') }}
                    </h4>
                    <div class="d-flex align-items-center">
                        <BaseInputText
                            class="search-input"
                            v-model:value="cameraKeyword"
                            @on-enter="search"
                            :placeholder="$t('common.app.filterForm.search')"
                        >
                        </BaseInputText>
                    </div>
                    <div class="dropzone camera-group" id="cameraList">
                        <Drag
                            class="camera-detail camera-item"
                            v-for="(camera, index) in cameraList"
                            :key="index"
                            :id="`draggable-${camera._id}`"
                            :data="camera"
                        >
                            <el-icon :size="20">
                                <Camera />
                            </el-icon>
                            <span class="camera-content-name">{{ camera.name }}</span>
                        </Drag>
                        <div v-if="cameraList.length === 0 && !loading">
                            <el-empty></el-empty>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #content>
            <div class="card liveview-detail fullscreen-wrapper">
                <div class="card-header d-flex">
                    <div
                        class="icon-group"
                        v-for="n in layout"
                        :key="n"
                        @click="onClickLayout(n)"
                    >
                        <span class="centered">{{ n }}</span>
                        <img
                            :id="`layout${n}`"
                            :class="{
                                'active-icon': selectedLayout === n,
                            }"
                            class="grid-icon"
                            :src="require(`@/assets/images/icons/layout-${n}.png`)"
                        />
                    </div>
                    <div class="full-screen" @click="toogleFullscreen">
                        <img
                            class="grid-icon"
                            :src="
                                fullScreen
                                    ? require(`@/assets/images/icons/minimize.png`)
                                    : require(`@/assets/images/icons/fullscreen.png`)
                            "
                        />
                    </div>
                </div>
                <div class="card-body">
                    <div class="camera-grid" :style="gridStyle">
                        <template v-for="n in selectedLayout" :key="n">
                            <Drop @drop="onDropCamera($event, n)">
                                <LiveViewComponent
                                    :accessKeyId="awsConfig?.accessKeyId"
                                    :secretAccessKey="awsConfig?.accessKey"
                                    :region="awsConfig?.region"
                                    :cameraInfo="liveViewList[n]"
                                    :layout="selectedLayout"
                                    :channelARN="liveViewList[n]?.channelARN"
                                    :isFullScreen="fullScreen"
                                />
                            </Drop>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </LayoutMainContent>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import { UtilMixins } from '@/mixins/utilMixins';
import LiveViewComponent from '../components/LiveViewComponent.vue';
import { liveViewModule } from '../store/monitor.store';
import { ICameraGroup } from '@/modules/camera-group/types';
import { ElLoading } from 'element-plus';
import { Search, Camera } from '@element-plus/icons-vue';
import { IAWSKey, ILiveView, ICameraLayout, ICameraInfo, ILiveViewQuery } from '../types';
import { vietnameseStringInclude } from '@/utils/commonFunction';
import { IDnDCameraEvent, ILiveViewCamera } from '@/modules/camera/types';
import { api as fullscreen } from 'vue-fullscreen';
import { IBreadcrumb } from '@/modules/common/types';
import { Drag, Drop } from '@/plugins/dragEasy';
import { ConnectionStatus } from '@/modules/camera/constants';

@Options({
    components: { LiveViewComponent, Search, Camera, Drag, Drop },
})
export default class MonitorListPage extends mixins(UtilMixins) {
    layout = [1, 4, 9, 16];
    selectedLayout = 1;
    loading = true;
    cameraKeyword = '';
    cameraGroupId = '' as string;
    selectedCamera = {} as ILiveViewCamera;

    fullScreen = false;

    get awsConfig(): IAWSKey {
        return liveViewModule.awsKey;
    }

    beforeDestroy(): void {
        window.removeEventListener('online', this.onChangeNetworkStatus);
        window.removeEventListener('offline', this.onChangeNetworkStatus);
    }

    internetStatus = navigator.onLine;

    onChangeNetworkStatus(e: Event): void {
        const { type } = e;
        this.internetStatus = type === ConnectionStatus.ONLINE;
        if (!this.internetStatus) {
            this.showAlertMessage(this.$t('common.app.errors.network'));
        }
    }

    onDropCamera(e: IDnDCameraEvent, index: number): void {
        if (this.liveViewList[index]) {
            liveViewModule.removeCameraInLayout(this.liveViewList[index]?._id);
        }
        this.selectedCamera =
            {
                _id: e.data._id,
                name: e.data.name,
                model: e.data.model,
                channelName: e.data.channelName,
            } || {};
        liveViewModule.appendCameraIntoLayout({
            index: index,
            cameraInfo: {
                groupName: liveViewModule.cameraGroupTable.name,
                _id: this.selectedCamera?._id,
                channelARN: this.selectedCamera?.channelName,
                cameraName: this.selectedCamera?.name,
                model: this.selectedCamera?.model,
            } as ICameraInfo,
        });
    }

    isDropped(n: number): boolean {
        return (
            Object.keys(this.liveViewList).findIndex((ele) => ele === n.toString()) > -1
        );
    }

    get liveViewList(): ICameraLayout {
        return liveViewModule.liveViewList;
    }

    async toogleFullscreen(): Promise<void> {
        await fullscreen.toggle(this.$el.querySelector('.fullscreen-wrapper'), {
            teleport: true,
            callback: (isFullscreen: boolean) => {
                this.fullScreen = isFullscreen;
            },
        });
    }

    get gridStyle(): string {
        return `grid-template-columns: 
                repeat(${Math.sqrt(this.selectedLayout)}, ${Math.sqrt(
            this.selectedLayout,
        )}fr )`;
    }

    search(): void {
        liveViewModule.setCameraKeyword(this.cameraKeyword);
    }

    onClickLayout(value: number): void {
        this.selectedLayout = value;
    }

    async onClickNode(data: ICameraGroup): Promise<void> {
        this.loading = true;
        liveViewModule.setCameraLayoutList([]);
        await liveViewModule.getCameraList(this.cameraGroupId);
        this.loading = false;
        liveViewModule.setCameraGroupTable({
            _id: data._id,
            name: data.name,
        });
    }

    beforeCreate(): void {
        liveViewModule.setLiveViewList({} as ICameraLayout);
    }

    async created(): Promise<void> {
        window.addEventListener('online', this.onChangeNetworkStatus);
        window.addEventListener('offline', this.onChangeNetworkStatus);
        const loading = await ElLoading.service({
            target: '.page-content',
        });
        await Promise.all([
            liveViewModule.getCameraGroupList(),
            liveViewModule.getCameraModels(),
        ]);
        liveViewModule.setLiveViewList({} as ICameraLayout);
        this.onClickLayout(this.selectedLayout);
        if (liveViewModule.cameraGroups.length > 0) {
            const query = this.$route?.query as ILiveViewQuery;
            if (query?.cameraId && query?.cameraGroupId) {
                this.cameraGroupId = query.cameraGroupId as string;
                const liveViewIndex = liveViewModule.cameraGroups.findIndex(
                    (ele) => ele._id === this.cameraGroupId,
                );
                liveViewModule.setCameraGroupTable({
                    _id: query.cameraGroupId,
                    name:
                        liveViewIndex > -1
                            ? liveViewModule.cameraGroups[liveViewIndex].name
                            : liveViewModule.cameraGroups[0].name,
                });
                await liveViewModule.getCameraList(query.cameraGroupId);
                const index = liveViewModule.cameraList.findIndex(
                    (ele) => ele._id === query.cameraId,
                );
                if (index > -1) {
                    liveViewModule.appendCameraIntoLayout({
                        index: 1,
                        cameraInfo: {
                            groupName: liveViewModule.cameraGroupTable.name,
                            _id: query?.cameraId,
                            channelARN: liveViewModule.cameraList[index]?.channelName,
                            cameraName: liveViewModule.cameraList[index]?.name,
                            model: liveViewModule.cameraList[index]?.model,
                        } as ICameraInfo,
                    });
                }
            } else {
                this.cameraGroupId = liveViewModule.cameraGroups[0]?._id as string;
                liveViewModule.setCameraGroupTable({
                    _id: liveViewModule.cameraGroups[0]._id,
                    name: liveViewModule.cameraGroups[0].name,
                });
                await liveViewModule.getCameraList(liveViewModule.cameraGroups[0]._id);
            }
        }
        loading.close();
        this.loading = false;
    }

    get breadcrumbs(): IBreadcrumb[] {
        return [
            {
                title: this.$t('common.app.sidebar.monitoring'),
            },

            {
                title: this.$t('common.app.sidebar.liveview'),
                isActive: true,
            },
        ];
    }

    get cameraList(): ILiveView[] {
        let temp = [] as ILiveView[];
        temp = liveViewModule.cameraLayoutList.filter((item) => {
            for (const index in liveViewModule.liveViewList)
                if (liveViewModule.liveViewList[index]._id === item._id) return false;
            return true;
        });
        return Array.from(
            new Set(
                temp.filter((item) =>
                    vietnameseStringInclude(item.name, this.cameraKeyword),
                ),
            ),
        );
    }

    get cameraGroups(): ICameraGroup[] {
        return liveViewModule.cameraGroups;
    }
}
</script>

<style lang="scss" scoped>
.tree-view {
    width: 300px;
}
.heading {
    top: 0px;
    position: sticky;
    z-index: map-get($map: $zIndex, $key: TreeView);
    background-color: white;
}
.live-view-page {
    .card {
        margin-bottom: 0;
        height: 100%;
        height: calc(100vh - 192px);
    }
}
.icon-group {
    padding-left: 0px;
    padding-right: 0px;
    position: relative;
    text-align: center;
    margin-right: 15px;
    color: transparent;
    width: 40px;
    font-size: 20px;
    &:hover {
        cursor: pointer;
    }
}
.camera-gird {
    background-color: white;
}
:deep(.page-content) {
    overflow-x: hidden !important;
}
.camera-group {
    overflow-x: hidden;
    max-height: calc(100vh - 447px);
}
.full-screen {
    position: relative;
    margin-left: auto;
    color: black;
    right: 0;
    width: 40px;
    &:hover {
        cursor: pointer;
    }
    .grid-icon {
        padding: 7px;
    }
}
.active-icon {
    border: 0px !important;
    filter: invert(13%) sepia(97%) saturate(2982%) hue-rotate(225deg) brightness(99%)
        contrast(121%);
}
.grid-icon {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 50%;
    text-align: center;
    border: 1px solid #efefef;
    left: 50%;
    transform: translate(-50%, -50%);
    &:hover {
        border: 0px !important;
        filter: invert(13%) sepia(97%) saturate(2982%) hue-rotate(225deg) brightness(99%)
            contrast(121%);
    }
}

.grid-container {
    display: grid;
    grid-column-gap: 10px;
    grid-template-areas: 'main right';
}
.camera-grid {
    display: grid;
    grid-gap: 5px;
}
.search-input {
    flex-grow: 1;
}
.camera-detail {
    display: flex;
    align-items: center;
    height: 40px;
    color: #303e67;
    margin-bottom: 5px;
    border: 1px solid #f1f5fa;
    padding-left: 20px;
    background: #fff;

    &:hover {
        background-color: #f5f7fa;
        cursor: pointer;
    }
}
.camera-content-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    padding-left: 20px;
}
.dropzone > .camera-detail {
    border-radius: 4px;
}
.liveview-detail {
    z-index: map-get($map: $zIndex, $key: fullscreen);
    margin-bottom: 0;
}
.camera-item {
    min-width: 200px;
    z-index: map-get($map: $zIndex, $key: fullscreen) + 1;
}
.filter-form {
    height: 100%;
}
</style>
