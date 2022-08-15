<template>
    <LayoutMainContent
        class="user-group-list-page"
        :breadcrumbs="breadcrumbs"
        :isShowSubSideBar="true"
    >
        <template #sub-side-bar>
            <div class="card">
                <div class="card-header d-flex">
                    <h4 class="my-0 align-self-center">
                        {{ $t('userGroup.group.tree.title') }}
                    </h4>
                    <el-tooltip
                        effect="dark"
                        :content="$t('common.app.tooltip.addRoot')"
                        placement="top"
                        :hide-after="0"
                        v-if="canCreate"
                        :visible-arrow="false"
                    >
                        <el-button
                            type="primary"
                            plain
                            size="small"
                            class="btn-add-group"
                            @click="addRoot"
                        >
                            <el-icon>
                                <CirclePlusFilled />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                </div>
                <div class="card-body" style="padding-top: 9px">
                    <BaseTreeView
                        :hasFilterError="false"
                        :loading="loadingTree"
                        ref="treeView"
                        :treeData="treeView"
                        nodeKey="id"
                        @addNode="addNode"
                        @editNode="onClickButtonEdit"
                        @deleteNode="deleteNode"
                        @onClickNode="onClickNode"
                        :currentNodeKey="firstNodeId"
                        v-model:value="selectedNode"
                        :isShowBtnAddNode="canCreate"
                        :isShowBtnUpdateNode="canUpdate"
                        :isShowBtnDeleteNode="canDelete"
                    />
                </div>
            </div>
        </template>
        <template #content>
            <div class="card">
                <div class="card-header d-flex">
                    <h4 class="my-0 align-self-center">
                        {{ $t('userGroup.group.tableHeader.title') }}
                    </h4>
                </div>
                <div class="card-body">
                    <div class="camera-group pb-2">
                        <span class="fw-bold text-start item-label">
                            {{ $t('userGroup.group.fields.name') }}
                        </span>
                        <span>{{ groupName }}</span>
                    </div>
                    <div class="group-user">
                        <div class="item-label col-8 fw-bold text-start">
                            {{ $t('userGroup.group.table.name') }}
                        </div>
                        <BasePagination
                            v-model:onChangePage="currentPage"
                            :isShowPagination="true"
                            :totalItems="totalItems"
                            :pageSize="pageSize"
                            @changePageSize="handleChangeSizes"
                            @handlePaginate="handlePaginate"
                        />
                        <UserTable :tableData="users" :loadingUserTable="loadingUser" />
                    </div>
                </div>
            </div>
        </template>
        <GroupUserPopup />
    </LayoutMainContent>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import { groupUserModule } from '@/modules/user-group/store';
import { IGroupUser } from '../types';
import { ElLoading } from 'element-plus';
import { UtilMixins } from '@/mixins/utilMixins';
import { groupUserService } from '../services/api.service';
import { IUserDetailReponse } from '@/modules/user/types';
import GroupUserPopup from '../components/GroupUserPopup.vue';
import UserTable from '../components/UserTable.vue';
import { IBreadcrumb, ITreeNode } from '@/modules/common/types';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { DEFAULT_FIRST_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/modules/common/constants';
import { PermissionActions } from '@/modules/role/role.constant';

@Options({
    components: {
        GroupUserPopup,
        UserTable,
        CirclePlusFilled,
    },
})
export default class GroupUserListPage extends mixins(UtilMixins) {
    loadingUser = true;
    currentPage = DEFAULT_FIRST_PAGE;
    groupName = '';
    selectedNode: ITreeNode = {
        name: '',
        level: 0,
        children: [],
    };

    get loadingTree(): boolean {
        return groupUserModule.loadingTree;
    }

    set loadingTree(value: boolean) {
        groupUserModule.setLoadingTree(value);
    }

    get breadcrumbs(): IBreadcrumb[] {
        return [
            {
                title: this.$t('common.app.sidebar.user'),
            },
            {
                title: this.$t('common.app.sidebar.groupUser'),
                isActive: true,
            },
        ];
    }

    get canCreate(): boolean {
        return groupUserModule.userPermissions.includes(PermissionActions.CREATE);
    }

    get canUpdate(): boolean {
        return groupUserModule.userPermissions.includes(PermissionActions.UPDATE);
    }

    get canDelete(): boolean {
        return groupUserModule.userPermissions.includes(PermissionActions.DELETE);
    }

    get users(): IUserDetailReponse[] {
        return groupUserModule.users;
    }

    get treeView(): IGroupUser[] {
        return groupUserModule.groups;
    }

    get firstNodeId(): number | undefined {
        return groupUserModule.groups[0]?.id;
    }

    get pageSize(): number {
        return groupUserModule?.userQueryString?.limit;
    }

    get totalItems(): number {
        return groupUserModule.totalUsers;
    }

    async handlePaginate(page: number): Promise<void> {
        groupUserModule.setPage(page);
        const loading = await ElLoading.service({
            target: '.page-content',
        });
        await groupUserModule.getUsers([this.selectedNode?.id as number]);
        loading.close();
    }

    async handleChangeSizes(size: number): Promise<void> {
        groupUserModule.setLimit(size);
        const loading = await ElLoading.service({
            target: '.page-content',
        });
        await groupUserModule.getUsers([this.selectedNode?.id as number]);
        loading.close();
    }

    async getListUserByFirstGroup(): Promise<void> {
        const firstNode = groupUserModule.groups?.[0];
        if (firstNode) {
            await this.getUserByGroup(firstNode);
            this.selectedNode = {
                name: firstNode.name,
                level: firstNode.level,
                id: firstNode.id,
                children: firstNode.children,
            };
        } else {
            groupUserModule.setTotalUsers(0);
            groupUserModule.setUsers([]);
        }
        this.groupName = firstNode?.name || '';
    }

    async fetchData(): Promise<void> {
        groupUserModule.setGroups([]);
        const loading = ElLoading.service({ target: '.page-content' });
        await groupUserModule.getGroups();
        await this.getListUserByFirstGroup();
        loading.close();
        this.loadingTree = false;
        this.loadingUser = false;
    }

    created(): void {
        groupUserModule.resetQuery();
        this.fetchData();
    }

    addNode(data: IGroupUser): void {
        groupUserModule.setPopupParams({
            ...groupUserModule.popupParams,
            isCreate: true,
            isShow: true,
        });
        groupUserModule.setParentId(data.id);
    }

    async onClickButtonEdit(data: IGroupUser): Promise<void> {
        groupUserModule.setPopupParams({
            ...groupUserModule.popupParams,
            isCreate: false,
            isShow: true,
        });
        groupUserModule.setGroup({ ...data });
    }

    async deleteNode(data: IGroupUser): Promise<void> {
        const confirmation = await this.showConfirmPopUp(
            this.$t('userGroup.group.errors.delete.message', {
                group: data.name as string,
            }),
            this.$t('userGroup.group.errors.delete.title'),
        );
        if (confirmation) {
            this.loadingTree = true;
            this.loadingUser = true;
            const loading = ElLoading.service({ target: '.page-content' });
            const response = await groupUserService.deleteGroup(data.id);
            if (response.success) {
                this.showSuccessNotification(
                    this.$t('userGroup.group.popup.delete.success'),
                );
            } else if (!response?.isRequestError) {
                this.showErrorNotification(response.message);
            }
            groupUserModule.setQueryParams({ keyword: '' });
            await groupUserModule.getGroups();
            await this.getListUserByFirstGroup();
            loading.close();
            this.loadingTree = false;
            this.loadingUser = false;
        }
    }

    async getUserByGroup(data: IGroupUser): Promise<void> {
        groupUserModule.setGroup({ ...data });
        const response = await groupUserModule.getUsers([data.id]);
        if (!response.success && !response?.isRequestError) {
            this.showErrorNotification(response.message);
        }
    }

    async onClickNode(data: IGroupUser): Promise<void> {
        groupUserModule.resetQuery();
        this.currentPage = DEFAULT_FIRST_PAGE;
        this.loadingUser = true;
        const loading = ElLoading.service({ target: '.page-content' });
        await this.getUserByGroup(data);
        this.groupName = groupUserModule.group?.name || '';
        groupUserModule.setPage(DEFAULT_FIRST_PAGE);
        groupUserModule.setLimit(DEFAULT_SIZE_PER_PAGE);
        loading.close();
        this.loadingUser = false;
    }

    addRoot(): void {
        groupUserModule.setPopupParams({
            ...groupUserModule.popupParams,
            isCreate: true,
            isShow: true,
        });
        groupUserModule.setParentId(null);
    }
}
</script>

<style lang="scss" scoped>
.user-group-list-page {
    .card {
        margin-bottom: 0;
        height: 100%;
        height: calc(100vh - 192px);
    }
}
:deep(.el-tree) {
    height: calc(100vh - 370px);
}
.tree-view {
    width: 350px;
    max-height: calc(100vh - 151px);
    overflow: auto;
}
.table-layout {
    @media (max-width: 1316.98px) {
        min-width: calc(100vw - 370px);
    }
    margin: 10px;
    min-width: calc(100vw - 620px);
    height: calc(100vh - 171px);
    border-left: 1px solid #efefef;
}
.item-label {
    color: #303e67;
}
.btn-add-group {
    margin-left: 2px;
    margin-top: 4px !important;
    padding: 0 !important;
    width: 18px !important;
    height: 22px !important;
    background: transparent;
    border: 0px;
    .el-icon {
        font-size: 18px !important;
    }
    &:hover {
        background: transparent !important;
        color: #3c61e0 !important;
    }
}
.card-header {
    h4 {
        margin-right: auto !important;
    }
}
</style>
