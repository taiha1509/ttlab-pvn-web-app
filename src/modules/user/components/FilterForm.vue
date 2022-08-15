<template>
    <BaseFilterForm @search="search" @create="createUser" :isShowCreateButton="canCreate">
        <template #filter-title>
            <h5 class="filter-title">
                {{ $t('common.app.filterForm.searchBy') }}
            </h5>
        </template>
        <slot>
            <div class="row">
                <div class="col-xl-3 col-md-6 col-12">
                    <BaseInputText
                        v-model:value="filterData.keyword"
                        :placeholder="$t('user.userList.filterForm.placeholder.keyword')"
                        @keypress.enter="search"
                    />
                </div>
                <div class="col-xl-3 col-md-6 col-12">
                    <BaseMultipleSelectTreeView
                        :placeholder="$t('user.userList.filterForm.placeholder.group')"
                        v-model:value="filterData.groupIds"
                        :treeData="groupTreeOptions"
                        :filterable="true"
                        nodeKey="id"
                        :clearable="true"
                        @onEnter="search"
                    />
                </div>
                <div class="col-xl-3 col-md-6 col-12">
                    <BaseMultipleSelect
                        v-model:value="filterData.statuses"
                        :placeholder="$t('user.userList.filterForm.placeholder.status')"
                        :options="statusOptions"
                        :teleported="false"
                        @onEnter="search"
                    />
                </div>
                <div class="col-xl-3 col-md-6 col-12">
                    <BaseMultipleSelect
                        v-model:value="filterData.roleIds"
                        :placeholder="$t('user.userList.filterForm.placeholder.role')"
                        :options="roleOptions"
                        :filterable="true"
                        :clearable="true"
                        :teleported="true"
                        @onEnter="search"
                    />
                </div>
            </div>
        </slot>
    </BaseFilterForm>
</template>

<script lang="ts">
import { ISelectOptions, ITreeNode } from '@/modules/common/types';
import { PermissionActions } from '@/modules/role/role.constant';
import { Options, setup, Vue } from 'vue-class-component';
import { action } from '../composition/userList';
import { UserStatus } from '../constant';
import { userModule } from '../store';
import { IUserFilterForm } from '../types';
@Options({})
export default class FilterForm extends Vue {
    filterData: IUserFilterForm = {
        keyword: '',
        roleIds: [],
        groupIds: [],
        statuses: [],
    };

    get canCreate(): boolean {
        return userModule.userPermissions.includes(PermissionActions.CREATE);
    }

    get roleOptions(): ISelectOptions[] {
        return userModule.roles.map((role) => ({
            label: role.name,
            value: role.id,
        }));
    }

    get groupTreeOptions(): ITreeNode[] {
        return userModule.userGroupTree;
    }

    get statusOptions(): ISelectOptions[] {
        const keys = Object.keys(UserStatus);
        return keys.map((key) => {
            const value = UserStatus[key as keyof typeof UserStatus];
            return {
                label: this.$t(`user.userForm.status.${value}`),
                value: value,
            };
        });
    }

    createUser(): void {
        this.action.openPopupCreate();
    }

    action = setup(() => action());

    search(): void {
        this.action.onSearch(this.filterData);
    }
}
</script>

<style lang="scss" scoped>
.filter-title {
    font-weight: bold;
    margin-bottom: 8px;
}
::v-deep .form-group {
    margin-bottom: 0 !important;
}
::v-deep label {
    font-size: 13px;
}
::v-deep .base-custom-filter-form {
    margin-top: 10px;
}
</style>
