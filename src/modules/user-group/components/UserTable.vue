<template>
    <div class="user-table">
        <BaseTableLayout
            :data="tableData"
            v-if="!loadingUserTable"
            @onSort="onSort"
            :scrollHeight="maxHeight"
        >
            <template #table-columns>
                <el-table-column type="index" align="center" :label="'#'" />
                <el-table-column
                    sortable
                    prop="username"
                    :label="$t('user.userForm.table.username')"
                    min-width="150px"
                />
                <el-table-column
                    sortable
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
            </template>
        </BaseTableLayout>
    </div>
</template>

<script lang="ts">
import { Options, mixins } from 'vue-class-component';
import { UtilMixins } from '@/mixins/utilMixins';
import { Prop } from 'vue-property-decorator';
import { IUserDetailReponse } from '@/modules/user/types';
import { IPropSortTable } from '@/modules/common/types';
import { groupUserModule } from '../store';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_SIZE_PER_PAGE,
    OrderDirection,
    HEIGHT_HEADER_FOOTER_PAGINATION_AND_HEADER,
    ElTableOrderDirection,
    HEIGHT_PAGINATION,
} from '@/modules/common/constants';
import { ElLoading } from 'element-plus';

@Options({})
export default class UserTable extends mixins(UtilMixins) {
    @Prop({ default: null }) readonly tableData!: IUserDetailReponse[];
    @Prop({ default: true }) readonly loadingUserTable!: boolean;

    get maxHeight(): number {
        const height = window.innerHeight;
        return height - HEIGHT_HEADER_FOOTER_PAGINATION_AND_HEADER - HEIGHT_PAGINATION;
    }

    beforeUnmount(): void {
        groupUserModule.setUserQueryString({
            limit: DEFAULT_SIZE_PER_PAGE,
            page: DEFAULT_FIRST_PAGE,
            orderBy: DEFAULT_ORDER_BY,
            orderDirection: OrderDirection.DESC,
        });
    }

    async onSort(scoped: IPropSortTable): Promise<void> {
        const loading = ElLoading.service({ target: '.page-content' });
        groupUserModule.setUserQueryString({
            ...groupUserModule.userQueryString,
            orderBy: scoped.prop || DEFAULT_ORDER_BY,
            orderDirection:
                scoped.order === ElTableOrderDirection.ASCENDING
                    ? OrderDirection.ASC
                    : OrderDirection.DESC,
        });
        await groupUserModule.getUsers([groupUserModule.group.id]);
        loading.close();
    }

    getRoleNames(user: IUserDetailReponse): string {
        return user?.roles?.map((role) => role.name).join(', ');
    }
}
</script>

<style scoped lang="scss">
.user-table {
    overflow: auto;
}
</style>
