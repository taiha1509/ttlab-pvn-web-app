<template>
    <div class="camera-table">
        <BaseTableLayout
            :data="tableData"
            v-if="!loadingCameraTable"
            :scrollHeight="maxHeight"
            @onSort="onSort"
        >
            <template #table-columns>
                <el-table-column type="index" align="center" :label="'#'" />
                <el-table-column
                    sortable="custom"
                    prop="name"
                    :label="$t('camera.cameraList.table.name')"
                />
                <el-table-column
                    prop="model"
                    :label="$t('camera.cameraList.table.model')"
                />
                <el-table-column
                    prop="serialNumber"
                    :label="$t('camera.cameraList.table.serialNumber')"
                />
                <el-table-column prop="uid" :label="$t('camera.cameraList.table.uid')" />
            </template>
        </BaseTableLayout>
    </div>
</template>

<script lang="ts">
import { Options, mixins } from 'vue-class-component';
import { UtilMixins } from '@/mixins/utilMixins';
import { ICamera } from '@/modules/camera/types';
import { Prop } from 'vue-property-decorator';
import {
    ElTableOrderDirection,
    HEIGHT_HEADER_FOOTER_PAGINATION_AND_HEADER,
} from '@/modules/common/constants';
import { IPropSortTable } from '@/modules/common/types';
import { cameraGroupListModule } from '../store/cameraGroup.store';
import _ from 'lodash';

@Options({})
export default class CameraGroupTable extends mixins(UtilMixins) {
    @Prop({ default: true }) readonly loadingCameraTable!: boolean;
    get tableData(): ICamera[] {
        return cameraGroupListModule.cameras;
    }

    get maxHeight(): number {
        const height = window.innerHeight;
        return height - HEIGHT_HEADER_FOOTER_PAGINATION_AND_HEADER;
    }

    async onSort(scoped: IPropSortTable): Promise<void> {
        const sortedCamera = _.orderBy(
            cameraGroupListModule.cameras,
            ['name'],
            scoped.order === ElTableOrderDirection.ASCENDING ? ['asc'] : ['desc'],
        );
        cameraGroupListModule.setCameras([...sortedCamera]);
    }
}
</script>

<style scoped lang="scss"></style>
