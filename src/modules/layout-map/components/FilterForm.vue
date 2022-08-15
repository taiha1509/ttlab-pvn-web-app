<template>
    <div class="card filter-form">
        <div class="card-header d-flex">
            <h4 class="my-0 align-self-center">
                {{ $t('layoutMap.layoutMap.filterForm.cameraGroup') }}
            </h4>
        </div>
        <div class="card-body">
            <BaseSingleSelectTreeView
                v-model:value="cameraGroupId"
                :treeData="cameraGroups"
                :filterable="true"
                :placeholder="$t('layoutMap.layoutMap.filterForm.cameraGroupPlaceholder')"
            />
            <h4>{{ $t('layoutMap.layoutMap.filterForm.cameraList') }}</h4>
            <slot name="unassigned-camera-list"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { ICameraGroup } from '@/modules/camera-group/types';
import { ElLoading } from 'element-plus';
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { layoutMapModule } from '../store/layoutMap.store';

@Options({})
export default class GroupCameraFilter extends Vue {
    get cameraGroupId(): string {
        return layoutMapModule.selectedCameraGroupId;
    }

    set cameraGroupId(id: string) {
        layoutMapModule.SET_SELECTED_CAMERA_GROUP_ID(id);
    }

    get cameraGroups(): ICameraGroup[] {
        return layoutMapModule.cameraGroupList;
    }

    @Watch('cameraGroupId')
    async onChangeCameraGroupId(id: string): Promise<void> {
        if (id) {
            const loading = ElLoading.service({
                target: '.page-content',
            });
            layoutMapModule.SET_SELECTED_CAMERA_GROUP_ID(id);
            await layoutMapModule.getCameraList();
            await layoutMapModule.getLayoutMapDetailByCameraGroupId(id);
            loading.close();
        }
    }
}
</script>

<style lang="scss" scoped>
.filter-form {
    margin: 0;
    height: calc(100vh - 205px);
}
</style>
