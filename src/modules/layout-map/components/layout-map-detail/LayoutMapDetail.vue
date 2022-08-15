<template>
    <div class="card layout-map-detail">
        <div class="card-header layout-map-header d-flex">
            <h4 class="my-0 align-self-center">{{ title }}</h4>
        </div>
        <div class="card-body layout-map-body" v-show="!loadingEMap">
            <template v-if="hasLayoutMap">
                <slot name="dropabble-map"></slot>
            </template>
            <template v-else>
                <div class="add-layout-map text-center">
                    <div>
                        <el-empty></el-empty>
                        <el-button
                            type="primary"
                            :disabled="canAddLayoutMap"
                            @click="addLayoutMap"
                        >
                            {{ $t('layoutMap.layoutMap.button.addLayout') }}
                        </el-button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { PermissionActions } from '@/modules/role/role.constant';
import { mixins, Options } from 'vue-class-component';
import { layoutMapModule } from '../../store/layoutMap.store';
import { ILayoutMapDetail } from '../../types';

@Options({
    components: {},
})
export default class LayoutMapDetail extends mixins(UtilMixins) {
    get title(): string {
        return this.layoutMapDetail?.name || '';
    }

    get hasLayoutMap(): boolean {
        return !!this.layoutMapDetail._id;
    }

    get canAddLayoutMap(): boolean {
        return (
            !layoutMapModule.selectedCameraGroupId ||
            !layoutMapModule.userPermissions.includes(PermissionActions.CREATE)
        );
    }

    get layoutMapDetail(): ILayoutMapDetail {
        return layoutMapModule.layoutMapDetail || {};
    }

    get loadingEMap(): boolean {
        return layoutMapModule.loadingEMap;
    }

    addLayoutMap(): void {
        layoutMapModule.SHOW_UPLOAD_LAYOUT_MAP_POPUP(true);
    }
}
</script>

<style lang="scss" scoped>
.layout-map-detail {
    height: calc(100vh - 205px);
    .layout-map-header {
        h4 {
            margin: 0;
        }
    }
    .layout-map-body {
        height: 100%;
        // overflow: auto;
    }
}
.add-layout-map {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
