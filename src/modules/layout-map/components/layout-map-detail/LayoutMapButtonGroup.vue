<template>
    <div class="layout-map-button-group">
        <el-button size="small" type="primary" @click="editLayoutMap" v-if="canUpdate">
            {{ $t('layoutMap.layoutMap.button.editLayout') }}
        </el-button>
        <el-button size="small" type="primary" @click="updateLayoutMap" v-if="canUpdate">
            {{ $t('layoutMap.layoutMap.button.save') }}
        </el-button>
        <el-button size="small" @click="cancelUpdateLayoutMap" v-if="canUpdate">
            {{ $t('layoutMap.layoutMap.button.cancel') }}
        </el-button>
        <el-button size="small" plain @click="deleteLayoutMap" v-if="canDelete">
            {{ $t('layoutMap.layoutMap.button.deleteLayout') }}
        </el-button>
    </div>
</template>

<script lang="ts">
import { PermissionActions } from '@/modules/role/role.constant';
import cloneDeep from 'lodash/cloneDeep';
import { Options, Vue } from 'vue-class-component';
import { layoutMapModule } from '../../store/layoutMap.store';

@Options({})
export default class LayoutMapButtonGroup extends Vue {
    get canEditLayoutMap(): boolean {
        return layoutMapModule.canEditLayoutMap;
    }

    get canUpdate(): boolean {
        return layoutMapModule.userPermissions.includes(PermissionActions.UPDATE);
    }

    get canDelete(): boolean {
        return layoutMapModule.userPermissions.includes(PermissionActions.DELETE);
    }

    editLayoutMap(): void {
        layoutMapModule.SHOW_UPLOAD_LAYOUT_MAP_POPUP(true);
    }

    cancelUpdateLayoutMap(): void {
        layoutMapModule.SET_LAYOUT_MAP_FORM({
            data: cloneDeep(layoutMapModule.layoutMapForm.originalData),
        });
    }

    updateLayoutMap(): void {
        this.$emit('update-layout-map');
    }

    deleteLayoutMap(): void {
        this.$emit('delete-layout-map');
    }
}
</script>

<style lang="scss" scoped></style>
