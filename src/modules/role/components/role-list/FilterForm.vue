<template>
    <div class="heading">
        <div class="d-flex align-items-center">
            <BaseInputText
                :hasError="false"
                class="search-input"
                v-model:value="keyword"
                :placeholder="$t('common.app.filterForm.search')"
            >
            </BaseInputText>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Search, Edit, Delete, CirclePlus } from '@element-plus/icons-vue';
import { Model } from 'vue-property-decorator';
import { roleModule } from '../../store';
import { PermissionActions } from '../../role.constant';

@Options({
    components: {
        Search,
        Edit,
        Delete,
        CirclePlus,
    },
})
export default class FilterForm extends Vue {
    @Model('value')
    keyword!: string;

    get canCreate(): boolean {
        return roleModule.userPermissions.includes(PermissionActions.CREATE);
    }
}
</script>

<style lang="scss" scoped>
.search-input {
    flex-grow: 1;
}

:deep(.el-input__suffix) {
    right: 0px !important;
}
.el-input__suffix-inner {
    button {
        padding-right: 7px !important;
        padding-left: 7px !important;
    }
}
:deep(.btn-add-role) {
    background: #f1f5fa !important;
    border-left: 1px solid #e3ebf6 !important;
    margin: 1px;
    margin-top: 2px;
    .el-icon {
        font-size: 16px !important;
    }
    &:hover {
        color: #3e61c0 !important;
    }
}
:deep(.el-button--primary.is-plain) {
    border: 0px solid;
}
:deep(.el-button--primary.is-plain) {
    background: transparent;
    color: #7081b9;
    .el-icon {
        font-size: 18px;
        font-weight: 600;
    }
    &:hover {
        border-color: #3c61e0;
        color: #3c61e0;
        background: transparent;
    }
    &:focus {
        background: transparent;
        color: #3c61e0 !important;
    }
}
</style>
