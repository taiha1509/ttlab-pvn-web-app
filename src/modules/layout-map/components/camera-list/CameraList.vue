<template>
    <div class="camera-list">
        <BaseInputText
            v-model:value="keyword"
            :placeholder="$t('layoutMap.layoutMap.filterForm.cameraKeywordPlaceholder')"
        >
        </BaseInputText>
        <Drop class="unassigned-camera-list" @drop="onDropCamera">
            <template v-if="filteredUnassignedCameras.length">
                <DraggableCamera
                    v-for="camera in filteredUnassignedCameras"
                    :key="camera._id"
                    :camera="camera"
                />
            </template>
            <template v-else>
                <el-empty />
            </template>
            <!-- Customize drag image when overing camera list -->
            <template v-slot:drag-image="{ data }">
                <DraggableCamera class="mouse-center" :camera="data" />
            </template>
        </Drop>
    </div>
</template>

<script lang="ts">
import { ICameraDetail } from '@/modules/camera/types';
import DraggableCamera from '../camera-list/DraggableCamera.vue';
import { Drop } from '@/plugins/dragEasy';
import get from 'lodash/get';
import { Options, Vue } from 'vue-class-component';
import { layoutMapModule } from '../../store/layoutMap.store';
import { IDnDLayoutMapEvent, ILayoutMapCamera, ILayoutMapDetail } from '../../types';
import { Prop } from 'vue-property-decorator';
import { Search } from '@element-plus/icons-vue';

@Options({
    components: { DraggableCamera, Search, Drop },
})
export default class CameraList extends Vue {
    @Prop({ default: '' }) draggingCameraId!: string;
    @Prop({ default: false }) isDraggingOverLayoutMap!: boolean;
    keyword = '';

    get selectedCameraGroupId(): string {
        return layoutMapModule.selectedCameraGroupId || '';
    }

    get layoutMapDetail(): ILayoutMapDetail {
        return layoutMapModule.layoutMapDetail;
    }

    get cameras(): ILayoutMapCamera[] {
        return layoutMapModule.cameras || [];
    }

    get unassignedCameras(): ILayoutMapCamera[] {
        return layoutMapModule.unassignedCameras || [];
    }

    get filteredUnassignedCameras(): ICameraDetail[] {
        return this.unassignedCameras.filter((camera) =>
            this.isValidCameraByKeyword(camera),
        );
    }

    isValidCameraByKeyword(camera: ICameraDetail): boolean {
        const keywords = ['name'];
        return keywords.some((key) =>
            new RegExp(this.keyword, 'i').test(get(camera, key, '')),
        );
    }

    onDropCamera(e: IDnDLayoutMapEvent): void {
        const cameraId = e.data?._id;
        const foundCamera = this.cameras.find((camera) => camera._id === cameraId);
        if (foundCamera) {
            foundCamera.isAssigned = false;
            delete foundCamera.x;
            delete foundCamera.y;
            layoutMapModule.SET_LAYOUT_MAP_FORM({ data: { cameras: [...this.cameras] } });
        }
    }
}
</script>

<style lang="scss" scoped>
.unassigned-camera-list {
    overflow-y: auto;
    min-height: 190px;
    max-height: calc(100vh - 457px);
    .draggable-camera:not(:last-child) {
        margin-bottom: 5px;
    }
}

.mouse-center {
    transform: translate(-50%, -50%);
}
</style>
