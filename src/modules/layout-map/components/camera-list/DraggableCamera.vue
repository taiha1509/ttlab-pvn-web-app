<template>
    <Drag
        v-show="!isDragging"
        class="draggable-camera"
        :data="camera"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
    >
        <el-icon :size="20">
            <Camera />
        </el-icon>
        <span class="draggable-camera-name" style="padding-left: 20px">{{
            camera.name
        }}</span>
    </Drag>
</template>

<script lang="ts">
import { Options } from 'vue-class-component';
import { Camera } from '@element-plus/icons-vue';
import { UtilMixins } from '@/mixins/utilMixins';
import { Prop } from 'vue-property-decorator';
import { ILayoutMapCamera } from '../../types';
import { Drag } from '@/plugins/dragEasy';

@Options({
    components: { Camera, Drag },
})
export default class DraggableCamera extends UtilMixins {
    @Prop({ default: () => ({}) }) private readonly camera!: ILayoutMapCamera;
    isDragging = false;

    onDragStart(): void {
        this.isDragging = true;
    }

    onDragEnd(): void {
        this.isDragging = false;
    }
}
</script>

<style lang="scss" scoped>
.draggable-camera {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 8px;
    border: 1px solid #f1f5fa;
    border-radius: 5px;
    min-width: 190px;
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 40px;
    color: #303e67;
    margin-bottom: 5px;
    border: 1px solid #f1f5fa;
    padding-left: 20px;
    background: #fff;

    &-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
