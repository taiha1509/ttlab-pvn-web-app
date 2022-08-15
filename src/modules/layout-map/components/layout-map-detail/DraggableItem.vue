<template>
    <Drag
        v-show="!isDragging"
        class="draggable-camera on-map"
        :data="camera"
        @click="viewCameraLive(camera)"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
    >
        <div class="camera-content">
            <img
                :src="require('@/assets/images/icons/camera-location.svg')"
                class="camera-content-icon"
            />
            <div class="camera-info-item d-flex align-items-center">
                <span class="camera-content-name"> {{ camera.name }}</span>
                <el-icon :size="20" :class="getClassConnectionStatus(camera)">
                    <CircleCheckFilled />
                </el-icon>
            </div>
        </div>
    </Drag>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import { ILayoutMapCamera } from '../../types';
import { Drag } from '@/plugins/dragEasy';
import { Prop } from 'vue-property-decorator';
import { UtilMixins } from '@/mixins/utilMixins';
import { layoutMapModule } from '../../store/layoutMap.store';
import { CircleCheckFilled, Camera } from '@element-plus/icons-vue';
import { ICameraDetail } from '@/modules/camera/types';
import { ConnectionStatus } from '@/modules/camera/constants';

@Options({
    components: { Drag, CircleCheckFilled, Camera },
})
export default class DraggableItem extends mixins(UtilMixins) {
    @Prop({ default: () => ({}) }) private readonly camera!: ILayoutMapCamera;
    isDragging = false;

    get originalCameras(): ILayoutMapCamera[] {
        return layoutMapModule.layoutMapForm.originalData.cameras || [];
    }

    get cameras(): ILayoutMapCamera[] {
        return layoutMapModule.layoutMapForm.data.cameras || [];
    }

    getClassConnectionStatus(camera: ICameraDetail): string {
        if (camera?.connectionStatus === ConnectionStatus.ONLINE) return 'is-online';
        return 'is-offline';
    }

    onDragStart(): void {
        this.isDragging = true;
    }

    onDragEnd(): void {
        this.isDragging = false;
    }

    cameraHasChanged(): boolean {
        for (let i = 0; i < this.originalCameras.length; i++) {
            const originalCamera = this.originalCameras[i];
            const camera = this.cameras[i];
            const coordinateChanged =
                originalCamera.x !== camera.x || originalCamera.y !== camera.y;
            if (coordinateChanged) return coordinateChanged;
        }
        return false;
    }

    async viewCameraLive(camera: ILayoutMapCamera): Promise<void> {
        if (this.cameraHasChanged()) {
            const message = this.$t('layoutMap.layoutMap.liveView.message');
            const title = this.$t('layoutMap.layoutMap.liveView.title');
            const confirm = await this.showConfirmPopUp(message, title);
            if (!confirm) return;
        }
        this.$router.push(
            `liveview?cameraGroupId=${layoutMapModule.selectedCameraGroupId}&cameraId=${camera?._id}`,
        );
    }
}
</script>

<style lang="scss" scoped>
.draggable-camera.on-map {
    background-color: #9aa5c55e;
    border-radius: 50%;
    border: unset;
    cursor: pointer;
}
.camera-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    &-icon {
        width: 55px;
        height: auto;
        transform: translateY(-8px);
    }
    &-name {
        display: flex;
        justify-content: center;
        word-break: break-all;
        transform: translateY(-12px);
        white-space: nowrap;
        font-weight: 550;
    }
}
.is-online {
    color: green !important;
}
.is-offline {
    color: red;
}
.camera-content-name {
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.camera-info-item {
    max-width: 85px;
    .el-icon {
        padding-bottom: 40px;
        padding-left: 5px;
    }
}
</style>
