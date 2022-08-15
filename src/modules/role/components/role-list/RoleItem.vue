<template>
    <div
        class="d-flex align-items-center click-area"
        @click="(role) => $emit('onClickRole', role)"
    >
        <img src="@/assets/images/icons/permission-icon.png" alt="" class="role-icon" />
        <div class="role-name">{{ role.name }}</div>
    </div>
    <div class="action-group" v-if="canDelete">
        <el-tooltip
            effect="dark"
            :content="$t('common.app.tooltip.delete')"
            placement="right"
            :hide-after="0"
            :visible-arrow="false"
        >
            <el-button
                type="primary"
                size="small"
                circle
                plain
                @click="action.deleteRole(role)"
            >
                <el-icon>
                    <Delete />
                </el-icon>
            </el-button>
        </el-tooltip>
    </div>
</template>

<script lang="ts">
import { Options, setup, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { roleAction } from '../../compositions/roleList';
import { PermissionActions } from '../../role.constant';
import { roleModule } from '../../store';
import { IRole } from '../../type';
import { Edit, Delete } from '@element-plus/icons-vue';

@Options({
    components: {
        Edit,
        Delete,
    },
})
export default class RoleItem extends Vue {
    @Prop({})
    readonly role!: IRole;

    get canDelete(): boolean {
        return roleModule.userPermissions.includes(PermissionActions.DELETE);
    }

    action = setup(() => roleAction());
}
</script>
<style lang="scss" scoped>
.role-icon {
    width: 20px;
}

.role-name {
    padding-left: 20px;
    color: #303e67;
    word-break: break-all;
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
.action-group {
    margin-left: auto;
    display: flex !important;
    justify-content: flex-end;
    min-width: 64px;
}
:deep(.el-button--primary.is-plain) {
    border: 0px solid;
}

.click-area {
    flex-grow: 1;
    padding-left: 20px;
}
</style>
