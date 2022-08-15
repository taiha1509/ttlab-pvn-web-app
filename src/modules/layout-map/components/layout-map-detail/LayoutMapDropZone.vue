<template>
    <Drop class="droppable-map" @drop="onDropOnMap">
        <DraggableItem
            class="draggable-camera"
            v-for="camera in assignedCameras"
            :style="getCameraStyle(camera, true)"
            :key="camera._id"
            :camera="camera"
        />
        <template v-slot:drag-image="{ data: camera }">
            <DraggableItem
                class="mouse-center"
                :camera="camera"
                :style="getCameraStyle(camera)"
            />
        </template>
        <el-image class="droppable-map-background" :src="layoutMapFile.url" fit="fill" />
    </Drop>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins, Options } from 'vue-class-component';
import { layoutMapModule } from '../../store/layoutMap.store';
import {
    IDnDLayoutMapEvent,
    ILayoutMapCamera,
    ILayoutMapDetail,
    ILayoutMapFile,
} from '../../types';
import { Drop } from '@/plugins/dragEasy';
import DraggableItem from './DraggableItem.vue';

interface ICameraStyle {
    width: string;
    height: string;
    left?: string;
    top?: string;
}

@Options({
    components: { Drop, DraggableItem },
})
export default class LayoutMapDropZone extends mixins(UtilMixins) {
    private readonly DRAGGABLE_CAMERA_WIDTH = 70;
    private readonly DRAGGABLE_CAMERA_HEIGHT = 70;

    get layoutMapDetail(): ILayoutMapDetail {
        return layoutMapModule.layoutMapDetail || {};
    }

    get layoutMapFile(): ILayoutMapFile {
        return (this.layoutMapDetail.file || {}) as ILayoutMapFile;
    }

    get cameras(): ILayoutMapCamera[] {
        return layoutMapModule.cameras || [];
    }

    get assignedCameras(): ILayoutMapCamera[] {
        return layoutMapModule.assignedCameras || [];
    }

    getCameraStyle(camera: ILayoutMapCamera, hasPosition = false): ICameraStyle {
        const styling: ICameraStyle = {
            width: this.DRAGGABLE_CAMERA_WIDTH + 'px',
            height: this.DRAGGABLE_CAMERA_HEIGHT + 'px',
        };
        if (hasPosition) {
            styling.left = `calc(${camera.x}% - ${this.DRAGGABLE_CAMERA_WIDTH / 2}px)`;
            styling.top = `calc(${camera.y}% - ${this.DRAGGABLE_CAMERA_HEIGHT / 2}px)`;
        }
        return styling;
    }

    getCameraCoordinate(mousePosition: { x: number; y: number }): {
        x: number;
        y: number;
    } {
        const mapPosition = this.$el.getBoundingClientRect();
        const distenceX = mousePosition.x - (mapPosition.x + this.$el.scrollLeft);
        const distenceY = mousePosition.y - (mapPosition.y + this.$el.scrollTop);
        const coordinate = {
            x: (distenceX / this.$el.offsetWidth) * 100,
            y: (distenceY / this.$el.offsetHeight) * 100,
        };
        return coordinate;
    }

    onDropOnMap(e: IDnDLayoutMapEvent): void {
        const cameraId = e.data?._id;
        const foundCamera = this.cameras.find((camera) => camera._id === cameraId);
        if (foundCamera) {
            foundCamera.isAssigned = true;
            const coordinate = this.getCameraCoordinate(e.position);
            foundCamera.x = coordinate.x;
            foundCamera.y = coordinate.y;
            layoutMapModule.SET_LAYOUT_MAP_FORM({ data: { cameras: [...this.cameras] } });
        }
    }
}
</script>

<style lang="scss" scoped>
.droppable-map {
    width: 100%;
    height: 100%;
    position: relative;

    &-background {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .draggable-camera {
        position: absolute;
        z-index: map-get($map: $zIndex, $key: dot);
    }
}
.mouse-center {
    transform: translate(-50%, -50%);
}
</style>
