<template>
    <div class="camera-table">
        <BaseTableLayout :data="tableData" :layoutHasFilterForm="true" @onSort="onSort">
            <template #table-columns>
                <el-table-column type="index" align="center" :label="'#'" />
                <el-table-column
                    sortable="custom"
                    prop="name"
                    :label="$t('camera.cameraList.table.name')"
                    min-width="150px"
                >
                    <template #default="scope">
                        <el-icon
                            :class="getClassConnectionStatus(scope.row?.connectionStatus)"
                        >
                            <CircleCheckFilled />
                        </el-icon>
                        {{ scope.row?.name }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="model"
                    :label="$t('camera.cameraList.table.model')"
                    min-width="150px"
                />
                <el-table-column
                    prop="serialNumber"
                    :label="$t('camera.cameraList.table.serialNumber')"
                    min-width="150px"
                />
                <el-table-column
                    prop="uid"
                    :label="$t('camera.cameraList.table.uid')"
                    min-width="150px"
                />
                <el-table-column
                    :label="$t('camera.cameraList.table.actions')"
                    fixed="right"
                    width="350"
                    align="center"
                    class-name="action-col"
                >
                    <template #default="scope">
                        <div class="group-button">
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.detail')"
                                placement="right"
                                :hide-after="0"
                                :visible-arrow="false"
                            >
                                <el-button
                                    size="small"
                                    plain
                                    @click="getDetailCamera(scope.row?._id)"
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
                                :hide-after="0"
                                :visible-arrow="false"
                                v-if="canUpdate"
                            >
                                <el-button
                                    size="small"
                                    plain
                                    @click="editCamera(scope.row?._id)"
                                >
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.settings')"
                                placement="right"
                                :hide-after="0"
                                :visible-arrow="false"
                                v-if="canConfig"
                            >
                                <el-button
                                    size="small"
                                    plain
                                    @click="settingCamera(scope.row?._id)"
                                >
                                    <el-icon>
                                        <Setting />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.schedule')"
                                placement="left"
                                :hide-after="0"
                                :visible-arrow="false"
                            >
                                <el-button
                                    size="small"
                                    plain
                                    @click="settingScheduleCamera(scope.row?._id)"
                                >
                                    <el-icon>
                                        <Calendar />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.delete')"
                                placement="left"
                                :hide-after="0"
                                v-if="canDelete"
                                :visible-arrow="false"
                            >
                                <el-button
                                    size="small"
                                    plain
                                    @click="
                                        confirmDelete(scope.row?._id, scope?.row?.name)
                                    "
                                >
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.refreshStatus')"
                                placement="left"
                                :hide-after="0"
                                v-if="canDelete"
                                :visible-arrow="false"
                            >
                                <el-button
                                    size="small"
                                    plain
                                    v-if="!getConnectionStatusBtnLoading(scope.row)"
                                    @click="refreshConnectionStatus(scope.row)"
                                >
                                    <el-icon>
                                        <Refresh />
                                    </el-icon>
                                </el-button>
                                <el-button
                                    size="small"
                                    plain
                                    :loading-icon="Eleme"
                                    v-else
                                    loading
                                >
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
import { Options, mixins } from 'vue-class-component';
import { cameraFormModule } from '../../store/camera.form.store';
import { cameraListModule } from '../../store/camera.list.store';
import { ICamera } from '../../types';
import i18n from '@/plugins/vue-i18n';
import {
    Eleme,
    InfoFilled,
    Edit,
    Setting,
    Delete,
    Calendar,
    CircleCheckFilled,
    Refresh,
} from '@element-plus/icons-vue';
import { cameraService } from '../../services/api.service';
import { IBodyResponse, IDeleteResponse, IPropSortTable } from '@/modules/common/types';
import { UtilMixins } from '@/mixins/utilMixins';
import { ElLoading } from 'element-plus';
import { cameraConfigModule } from '../../store/camera.config.store';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_SIZE_PER_PAGE,
    ElTableOrderDirection,
    OrderDirection,
} from '@/modules/common/constants';
import { PermissionActions } from '@/modules/role/role.constant';
import { ConnectionStatus, POPUP_NAME } from '../../constants';
import { IUserDetailReponse } from '@/modules/user/types';
import { appService } from '@/utils/app';
import Socket from '@/plugins/socket/socket';

type RefreshConnectionStatusLoading = { _id: string; loading: boolean; uid: string };

@Options({
    components: {
        InfoFilled,
        Edit,
        Setting,
        Delete,
        Refresh,
        Calendar,
        CircleCheckFilled,
        Eleme,
    },
})
export default class CameraTable extends mixins(UtilMixins) {
    refreshConnectionStatusLoading: RefreshConnectionStatusLoading[] = [];
    get canUpdate(): boolean {
        return cameraListModule.userPermissions.includes(PermissionActions.UPDATE);
    }

    get canConfig(): boolean {
        return cameraListModule.userPermissions.includes(PermissionActions.CONFIG);
    }

    get canDelete(): boolean {
        return cameraListModule.userPermissions.includes(PermissionActions.DELETE);
    }

    get tableData(): ICamera[] {
        const cameras = cameraListModule.cameras;
        this.refreshConnectionStatusLoading = cameras.map((camera) => ({
            _id: camera._id,
            loading: false,
            uid: camera.uid,
        }));
        return cameras;
    }

    get loginUser(): IUserDetailReponse {
        return appService.getUser();
    }

    getConnectionStatusBtnLoading(camera: ICamera): boolean {
        return !!this.refreshConnectionStatusLoading.find(
            (item) => item._id === camera._id,
        )?.loading;
    }

    getDetailCamera(id: string): void {
        cameraFormModule.setId(id);
        cameraListModule.openCameraPopup(POPUP_NAME.DETAIL_FORM_POPUP);
    }

    settingCamera(id: string): void {
        cameraConfigModule.showCameraRecordingConfigurationPopup(id);
    }

    settingScheduleCamera(id: string): void {
        cameraConfigModule.showCameraScheduleConfigurationPopup(id);
    }

    editCamera(id: string): void {
        cameraFormModule.setId(id);
        cameraListModule.openCameraPopup(POPUP_NAME.UPDATE_FORM_POPUP);
    }

    mounted(): void {
        this.subcribeEventToReceiveConnectionStatus();
    }

    getClassConnectionStatus(connectionStatus: string): string {
        if (connectionStatus === ConnectionStatus.ONLINE) return 'is-online';
        return 'is-offline';
    }

    subcribeEventToReceiveConnectionStatus(): void {
        Socket.subscribeReceiveCameraStatus((message) => {
            const camera = cameraListModule.cameras.find(
                (camera) => camera.uid === message.uid,
            ) as ICamera;
            camera.connectionStatus = ConnectionStatus.ONLINE;
            const loadingBtn = this.refreshConnectionStatusLoading.find(
                (item) => item._id === camera._id,
            ) as RefreshConnectionStatusLoading;
            loadingBtn.loading = false;
        });
    }

    refreshConnectionStatus(camera: ICamera): void {
        const loadingBtn = this.refreshConnectionStatusLoading.find(
            (item) => item._id === camera._id,
        ) as RefreshConnectionStatusLoading;
        loadingBtn.loading = true;
        setTimeout(() => {
            loadingBtn.loading = false;
        }, 60000);
        const clientId = Socket.getSocket().id;
        const clientSocketRoom = `${clientId}_${this.loginUser?.id}`;
        cameraService.updateConnectionStatus(camera._id, { clientSocketRoom });
    }

    async confirmDelete(id: string, name: string): Promise<void> {
        try {
            const result = await this.showConfirmPopUp(
                i18n.global.t('camera.cameraForm.confirmPopup.message', {
                    name: name,
                }),
                i18n.global.t('camera.cameraForm.confirmPopup.title') as string,
            );
            if (result) {
                const loading = ElLoading.service({
                    target: '.page-content',
                });
                const response = (await cameraService.delete(
                    id,
                )) as IBodyResponse<IDeleteResponse>;
                if (response.success) {
                    this.showSuccessNotification(
                        i18n.global.t(
                            'camera.cameraForm.confirmPopup.deleteSuccess',
                        ) as string,
                    );
                    if (
                        cameraListModule.totalCameras ===
                        DEFAULT_SIZE_PER_PAGE * (cameraListModule.queryString.page - 1) +
                            1
                    ) {
                        cameraListModule.setPage(cameraListModule.queryString.page--);
                    }
                    await cameraListModule.getCameraList();
                } else {
                    this.showErrorNotification(response.message);
                    await cameraListModule.getCameraList();
                }
                loading.close();
            }
        } catch (error) {
            this.showErrorNotification(
                i18n.global.t('common.app.error.message') as string,
            );
        }
    }

    async onSort(scoped: IPropSortTable): Promise<void> {
        const loading = ElLoading.service({ target: 'page-content' });
        cameraListModule.setQueryString({
            ...cameraListModule.queryString,
            orderBy: scoped.prop || DEFAULT_ORDER_BY,
            orderDirection:
                scoped.order === ElTableOrderDirection.ASCENDING
                    ? OrderDirection.ASC
                    : OrderDirection.DESC,
        });
        await cameraListModule.getCameraList();
        loading.close();
    }

    beforeUnmount(): void {
        cameraListModule.setQueryString({
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
            orderBy: DEFAULT_ORDER_BY,
            orderDirection: OrderDirection.DESC,
        });
        cameraListModule.setCameras([]);
    }
}
</script>

<style scoped lang="scss">
.camera-table {
    overflow: auto;
}
.is-online {
    color: green !important;
}
.is-offline {
    color: red;
}
:deep(.action-col) {
    .cell {
        padding: 0px !important;
    }
}
</style>
