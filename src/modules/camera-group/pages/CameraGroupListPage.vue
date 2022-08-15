<template>
    <LayoutMainContent
        class="camera-group-list-page"
        :breadcrumbs="breadcrumbs"
        :isShowSubSideBar="true"
    >
        <template #sub-side-bar>
            <div class="card">
                <div class="card-header d-flex">
                    <h4 class="my-0 align-self-center">
                        {{ $t('cameraGroup.cameraGroup.treeLayout.title') }}
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
                <div class="card-body">
                    <BaseTreeView
                        :loading="loadingTree"
                        :treeData="treeView"
                        @addNode="addNode"
                        @editNode="editNode"
                        @deleteNode="deleteNode"
                        @search="search"
                        @onClickNode="onClickNode"
                        v-model:value="selectedNode"
                        :hasFilterError="false"
                        :isShowBtnDeleteNode="canDelete"
                        :isShowBtnAddNode="canCreate"
                        :isShowBtnUpdateNode="canUpdate"
                    />
                </div>
            </div>
        </template>
        <template #content>
            <div class="card">
                <div class="card-header d-flex">
                    <h4 class="my-0 align-self-center">
                        {{ $t('cameraGroup.cameraGroup.tableHeader.title') }}
                    </h4>
                </div>
                <div class="card-body">
                    <div class="camera-group pb-2">
                        <span class="fw-bold text-start item-label">
                            {{ $t('cameraGroup.cameraGroup.fields.name.label') }}:
                        </span>
                        <span>{{ groupName }}</span>
                    </div>
                    <div class="group-camera">
                        <div class="fw-bold text-start pb-2 item-label">
                            {{ $t('cameraGroup.cameraGroup.tableHeader.label') }}
                        </div>
                        <CameraGroupTable :loadingCameraTable="loadingCameraTable" />
                    </div>
                </div>
            </div>
        </template>
        <CameraGroupPopup />
    </LayoutMainContent>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import { cameraGroupListModule } from '../store/cameraGroup.store';
import CameraGroupTable from '../components/CameraGroupTable.vue';
import { ICameraGroup } from '../types';
import { UtilMixins } from '@/mixins/utilMixins';
import i18n from '@/plugins/vue-i18n';
import { ElLoading } from 'element-plus';
import { cameraGroupService } from '../services/api.service';
import CameraGroupPopup from '../components/CameraGroupPopup.vue';
import { IBreadcrumb, ITreeNode, IBodyResponse } from '@/modules/common/types';
import { PermissionActions } from '@/modules/role/role.constant';
import { CirclePlusFilled } from '@element-plus/icons-vue';

@Options({
    components: {
        CameraGroupTable,
        CameraGroupPopup,
        CirclePlusFilled,
    },
})
export default class CameraGroupListPage extends mixins(UtilMixins) {
    loadingCameraTable = true;

    selectedNode: ITreeNode = {
        name: '',
        level: 0,
        children: [],
    };

    get loadingTree(): boolean {
        return cameraGroupListModule.loadingTree;
    }

    set loadingTree(value: boolean) {
        cameraGroupListModule.setLoadingTree(value);
    }

    get treeView(): ICameraGroup[] {
        return cameraGroupListModule.cameraGroups;
    }

    get canDelete(): boolean {
        return cameraGroupListModule.userPermissions.includes(PermissionActions.DELETE);
    }

    get canUpdate(): boolean {
        return cameraGroupListModule.userPermissions.includes(PermissionActions.UPDATE);
    }

    get canCreate(): boolean {
        return cameraGroupListModule.userPermissions.includes(PermissionActions.CREATE);
    }

    created(): void {
        cameraGroupListModule.clearFilterForm();
        this.fetchData();
    }

    async fetchData(): Promise<void> {
        this.loadingTree = true;
        this.loadingCameraTable = true;
        const loading = ElLoading.service({
            target: '.page-content',
        });
        await cameraGroupListModule.getCameraGroupList();
        if (cameraGroupListModule.cameraGroups.length > 0) {
            const firstCameraGroup = cameraGroupListModule.cameraGroups[0];
            cameraGroupListModule.setCameraGroupTable({
                _id: firstCameraGroup._id,
                name: firstCameraGroup.name,
            });
            await cameraGroupListModule.getCameraListBycameraGroupId();
            this.selectedNode = {
                name: firstCameraGroup.name,
                level: firstCameraGroup.level,
                _id: firstCameraGroup._id,
                children: firstCameraGroup.children,
            };
        }
        loading.close();
        this.loadingTree = false;
        this.loadingCameraTable = false;
    }

    get groupName(): string {
        return cameraGroupListModule.cameraGroupTable.name;
    }

    get breadcrumbs(): IBreadcrumb[] {
        return [
            {
                title: this.$t('common.app.sidebar.camera'),
            },
            {
                title: this.$t('common.app.sidebar.cameraGroupManagement'),
                isActive: true,
            },
        ];
    }

    addNode(data: ICameraGroup): void {
        cameraGroupListModule.setIsCreate(true);
        cameraGroupListModule.setGroupDetail({
            _id: data._id,
            name: '',
        });
        cameraGroupListModule.setIsShowFormPopup(true);
    }

    editNode(data: ICameraGroup): void {
        cameraGroupListModule.setIsCreate(false);
        cameraGroupListModule.setGroupDetail({
            _id: data._id,
            name: '',
        });
        cameraGroupListModule.setIsShowFormPopup(true);
    }

    async getCameraByGroup(data: ICameraGroup): Promise<void> {
        cameraGroupListModule.setCameraGroupTable({
            _id: data._id,
            name: data.name,
        });
        await cameraGroupListModule.getCameraListBycameraGroupId();
    }

    async onClickNode(data: ICameraGroup): Promise<void> {
        this.loadingCameraTable = true;
        const loading = ElLoading.service({
            target: '.page-content',
        });
        await this.getCameraByGroup(data);
        loading.close();
        this.loadingCameraTable = false;
    }

    async deleteNode(data: ICameraGroup): Promise<void> {
        const { _id, name } = data;
        try {
            const result = await this.showConfirmPopUp(
                i18n.global.t('cameraGroup.cameraGroup.confirmPopup.message', {
                    name: name,
                }),
                i18n.global.t('cameraGroup.cameraGroup.confirmPopup.title') as string,
            );
            if (result) {
                this.loadingTree = true;
                const loading = ElLoading.service({
                    target: '.page-content',
                });
                const response = (await cameraGroupService.delete(
                    _id,
                )) as IBodyResponse<string>;
                if (response.success) {
                    this.showSuccessNotification(
                        i18n.global.t(
                            'cameraGroup.cameraGroup.confirmPopup.deleteSuccess',
                        ) as string,
                    );
                    const loading = ElLoading.service({
                        target: '.page-content',
                    });
                    await cameraGroupListModule.getCameraGroupList();
                    if (cameraGroupListModule.cameraGroups.length > 0) {
                        const firstGroup = cameraGroupListModule.cameraGroups[0];
                        await this.getCameraByGroup(firstGroup);
                        this.selectedNode = firstGroup;
                        cameraGroupListModule.setCameraGroupTable({
                            _id: firstGroup._id,
                            name: firstGroup.name,
                        });
                    } else {
                        cameraGroupListModule.setCameraGroupTable({
                            _id: '',
                            name: '',
                        });
                        await cameraGroupListModule.getCameraListBycameraGroupId();
                    }
                    loading.close();
                    this.loadingTree = false;
                } else {
                    this.showErrorNotification(response.message);
                }
                loading.close();
            }
        } catch (error) {
            this.showErrorNotification(
                i18n.global.t('common.app.error.message') as string,
            );
        }
    }

    addRoot(): void {
        cameraGroupListModule.setIsCreate(true);
        cameraGroupListModule.setIsShowFormPopup(true);
    }
}
</script>

<style lang="scss" scoped>
.camera-group-list-page {
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
    max-height: calc(100vh - 251px);
    overflow: auto;
}
.item-label {
    color: #303e67;
}
.table-layout {
    @media (max-width: 1316.98px) {
        min-width: calc(100vw - 380px);
    }
    overflow-y: scroll;
    margin: 10px;
    margin-right: 0px;
    min-width: calc(100vw - 620px);
    height: calc(100vh - 171px);
    border-left: 1px solid #efefef;
}
.grid-container {
    display: grid;
    grid-column-gap: 10px;
    grid-template-areas: 'main right';
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
