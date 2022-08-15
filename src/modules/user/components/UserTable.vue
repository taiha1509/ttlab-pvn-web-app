<template>
    <div class="camera-table">
        <BaseTableLayout
            :data="tableData"
            @onSort="onSort"
            :layoutHasFilterForm="true"
            v-show="!loadingUserTable"
        >
            <template #table-columns>
                <el-table-column type="index" align="center" label="#" />
                <el-table-column
                    sortable="custom"
                    prop="username"
                    :label="$t('user.userForm.table.username')"
                    min-width="150px"
                />
                <el-table-column
                    sortable="custom"
                    prop="fullName"
                    :label="$t('user.userForm.table.fullName')"
                    min-width="150px"
                />
                <el-table-column
                    prop="email"
                    :label="$t('user.userForm.table.email')"
                    min-width="150px"
                />
                <el-table-column
                    prop="phoneNumber"
                    :label="$t('user.userForm.table.phoneNumber')"
                    min-width="150px"
                />
                <el-table-column
                    prop="phoneNumber"
                    :label="$t('user.userForm.table.roles')"
                    min-width="150px"
                >
                    <template #default="scope">
                        <div>{{ getRoleNames(scope.row) }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('user.userForm.table.status')"
                    min-width="150px"
                >
                    <template #default="scope">
                        {{ $t(`user.userForm.status.${scope.row.status}`) }}
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('user.userForm.table.firstLogin')"
                    min-width="150px"
                    align="center"
                >
                    <template #default="scope">
                        <el-icon><Check v-if="scope.row.firstLogin" /></el-icon>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('camera.cameraList.table.actions')"
                    fixed="right"
                    width="180"
                    align="center"
                    class-name="action-col"
                >
                    <template #default="scope">
                        <div class="group-button">
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.detail')"
                                placement="right"
                                :visible-arrow="false"
                            >
                                <el-button
                                    size="small"
                                    @click="showDetailUser(scope.row)"
                                    plain
                                >
                                    <el-icon>
                                        <InfoFilled />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.edit')"
                                placement="right"
                                :visible-arrow="false"
                                v-if="hasPermissionUpdate"
                            >
                                <el-button
                                    size="small"
                                    plain
                                    @click="editUser(scope.row)"
                                    :class="{
                                        'visibility-hidden':
                                            isAdmin(scope.row) && !isLoginUser(scope.row),
                                    }"
                                >
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.delete')"
                                placement="left"
                                :visible-arrow="false"
                                v-if="hasPermissionDelete"
                            >
                                <el-button
                                    size="small"
                                    plain
                                    @click="deleteUser(scope.row)"
                                    :class="{
                                        'visibility-hidden':
                                            isAdmin(scope.row) || isLoginUser(scope.row),
                                    }"
                                >
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
            </template>
        </BaseTableLayout>
    </div>
</template>

<script lang="ts">
import { Options, mixins, setup } from 'vue-class-component';
import { UtilMixins } from '@/mixins/utilMixins';
import { userModule } from '../store';
import { IUserDetailReponse } from '../types';
import { action } from '../composition/userList';
import { InfoFilled, Edit, Delete, Check } from '@element-plus/icons-vue';
import { PermissionActions } from '@/modules/role/role.constant';
import { IPropSortTable } from '@/modules/common/types';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_SIZE_PER_PAGE,
    ElTableOrderDirection,
    OrderDirection,
} from '@/modules/common/constants';
import { ElLoading } from 'element-plus';
import { appService } from '@/utils/app';
import { UserTypes } from '../constant';

@Options({
    components: {
        InfoFilled,
        Edit,
        Check,
        Delete,
    },
})
export default class UserTable extends mixins(UtilMixins) {
    get tableData(): IUserDetailReponse[] {
        return userModule.users;
    }

    // Login user can not delete himself, and cannot delete admin
    get hasPermissionDelete(): boolean {
        return userModule.userPermissions.includes(PermissionActions.DELETE);
    }

    get hasPermissionUpdate(): boolean {
        return userModule.userPermissions.includes(PermissionActions.UPDATE);
    }

    get loadingUserTable(): boolean {
        return userModule.loadingUserTabel;
    }

    action = setup(() => action());
    isAdmin(user: IUserDetailReponse): boolean {
        const isAdmin =
            user.types.includes(UserTypes.SYSTEM_ADMIN) ||
            user.types.includes(UserTypes.DEVICE_ADMIN);
        return isAdmin;
    }

    isLoginUser(user: IUserDetailReponse): boolean {
        return user.id === appService.getUser().id;
    }

    getRoleNames(user: IUserDetailReponse): string {
        return user?.roles?.map((role) => role.name).join(', ');
    }

    editUser(user: IUserDetailReponse): void {
        if (userModule.previousDisplayPopup === '')
            userModule.setUser({ ...userModule.initUser });
        userModule.setUser({
            id: user.id as number,
            ...user,
        });
        this.action.openPopupUpdate();
    }

    showDetailUser(user: IUserDetailReponse): void {
        userModule.setUser({
            id: user.id as number,
            ...user,
        });
        this.action.openPopupDetail();
    }

    deleteUser(user: IUserDetailReponse): void {
        this.action.openPopupDelete(user);
    }

    async onSort(scoped: IPropSortTable): Promise<void> {
        const loading = await ElLoading.service({ target: '.page-content' });
        userModule.setQueryString({
            ...userModule.queryString,
            orderBy: scoped.prop,
            orderDirection:
                scoped.order === ElTableOrderDirection.ASCENDING
                    ? OrderDirection.ASC
                    : OrderDirection.DESC,
        });

        await userModule.getUsers();
        loading.close();
    }

    beforeUnmount(): void {
        userModule.setQueryString({
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
            keyword: '',
            orderBy: DEFAULT_ORDER_BY,
            orderDirection: OrderDirection.DESC,
        });
        userModule.setUsers([]);
    }
}
</script>

<style scoped lang="scss">
.camera-table {
    overflow: auto;
}

.group-button {
    text-align: center;
}

.visibility-hidden {
    visibility: hidden;
}
:deep(.action-col) {
    .cell {
        padding: 0px !important;
    }
}
</style>
