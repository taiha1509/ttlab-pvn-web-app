<template>
    <LayoutMainContent :breadcrumbs="breadcrumbs" :isShowSubSideBar="false">
        <template #filter-form>
            <FilterForm />
        </template>
        <template #content>
            <BasePagination
                v-model:onChangePage="currentPage"
                :isShowPagination="true"
                :totalItems="totalItems"
                :pageSize="pageSize"
                @changePageSize="handleChangeSizes"
                @handlePaginate="handlePaginate"
            />
            <UserTable />
            <UserFormPopup />
            <DetailPopup />
        </template>
    </LayoutMainContent>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import FilterForm from '../components/FilterForm.vue';
import UserTable from '../components/UserTable.vue';
import { userModule } from '../store';
import UserFormPopup from '../components/FormPopup.vue';
import DetailPopup from '../components/DetailPopup.vue';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_SIZE_PER_PAGE,
    OrderDirection,
} from '@/modules/common/constants';
import { ElLoading } from 'element-plus';
import { groupUserModule } from '@/modules/user-group/store';
import { UtilMixins } from '@/mixins/utilMixins';
import { IBreadcrumb } from '@/modules/common/types';
@Options({
    components: {
        FilterForm,
        UserTable,
        UserFormPopup,
        DetailPopup,
    },
})
export default class UserListPage extends mixins(UtilMixins) {
    get currentPage(): number {
        return userModule.paginationParams.currentPage as number;
    }

    set currentPage(value: number) {
        userModule.setPaginationParams({
            ...userModule.paginationParams,
            currentPage: value,
        });
    }

    get totalItems(): number {
        return userModule.paginationParams.totalItems as number;
    }

    get pageSize(): number {
        return userModule.paginationParams.itemsPerPage;
    }

    created(): void {
        this.resetQuery();
        this.fetchData();
    }

    resetQuery(): void {
        userModule.setPaginationParams({
            ...userModule.paginationParams,
            itemsPerPage: DEFAULT_SIZE_PER_PAGE,
            currentPage: DEFAULT_FIRST_PAGE,
        });
        userModule.setQueryString({
            ...userModule.queryString,
            keyword: '',
            orderBy: DEFAULT_ORDER_BY,
            orderDirection: OrderDirection.DESC,
            roleIds: [],
            groupIds: [],
            statuses: [],
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
        });
    }

    async fetchData(): Promise<void> {
        const loading = ElLoading.service({ target: '.page-content' });
        userModule.setLoadingUserTable(true);
        const [, userListResponse] = await Promise.all([
            groupUserModule.getGroups(),
            userModule.getUsers(),
            userModule.getDropdownUserGroup(),
            userModule.getRoles(),
        ]);
        userModule.setLoadingUserTable(false);

        if (!userListResponse.success && !userListResponse?.isRequestError) {
            this.showErrorNotification(userListResponse.message);
        }

        loading.close();
    }

    async handleChangeSizes(size: number): Promise<void> {
        const loading = ElLoading.service({ target: '.page-content' });
        userModule.setPaginationParams({
            ...userModule.paginationParams,
            currentPage: DEFAULT_FIRST_PAGE,
            itemsPerPage: size,
        });
        await userModule.getUsers();
        loading.close();
    }

    async handlePaginate(page: number): Promise<void> {
        const loading = ElLoading.service({ target: '.page-content' });
        userModule.setPaginationParams({
            ...userModule.paginationParams,
            currentPage: page,
        });
        await userModule.getUsers();
        loading.close();
    }

    get breadcrumbs(): IBreadcrumb[] {
        return [
            {
                title: this.$t('common.app.sidebar.user'),
            },
            {
                title: this.$t('common.app.sidebar.userManagement'),
                isActive: true,
            },
        ];
    }
}
</script>

<style lang="scss" scoped></style>
