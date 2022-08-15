<template>
    <BaseDialogLayout
        v-model:value="isShowDetailCamera"
        width="30%"
        :loading="loading"
        @openDialog="openDetailPopup"
        @before-close="closeCameraDetailPopup"
        :title="$t('camera.cameraForm.cameraDetail.title')"
    >
        <template #content>
            <div class="row main-info">
                <div class="col-12">
                    <div class="row-item row">
                        <div class="item-label col-5 fw-bold text-start">
                            {{ $t('camera.cameraForm.fields.name.label') }}
                        </div>
                        <div class="item-value col-7">{{ cameraInfo.name }}</div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row-item row">
                        <div class="item-label col-5 fw-bold text-start">
                            {{ $t('camera.cameraForm.fields.model.label') }}
                        </div>
                        <div class="item-value col-7">{{ cameraInfo.model }}</div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row-item row">
                        <div class="item-label col-5 fw-bold text-start">
                            {{ $t('camera.cameraForm.fields.serialNumber.label') }}
                        </div>
                        <div class="item-value col-7">{{ cameraInfo.serialNumber }}</div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row-item row">
                        <div class="item-label col-5 fw-bold text-start">
                            {{ $t('camera.cameraForm.fields.uid.label') }}
                        </div>
                        <div class="item-value col-7">{{ cameraInfo.uid }}</div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row-item row">
                        <div class="item-label col-5 fw-bold text-start">
                            {{ $t('camera.cameraForm.fields.cameraGroupId.label') }}
                        </div>
                        <div class="item-value col-7">
                            {{ cameraGroups }}
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row-item row">
                        <div class="item-label col-5 fw-bold text-start">
                            {{ $t('camera.cameraForm.fields.userIds.label') }}
                        </div>
                        <div class="item-value col-7">
                            {{ userNames }}
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row-item row">
                        <div class="item-label col-5 fw-bold text-start">
                            {{ $t('camera.cameraForm.fields.groupUserIds.label') }}
                        </div>
                        <div class="item-value col-7">{{ groupNames }}</div>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div
                class="col-md-4 col-sm-6 d-flex justify-content-md-center justify-content-center"
            >
                <el-button @click="updateCamera" v-if="canUpdate">
                    {{ $t('common.app.action.update') }}
                </el-button>
                <el-button @click="openSettingPopup" v-if="canConfig">
                    {{ $t('camera.cameraForm.button.settings') }}
                </el-button>
                <el-button @click="deleteCamera" v-if="canDelete">
                    {{ $t('common.app.action.delete') }}
                </el-button>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import i18n from '@/plugins/vue-i18n';
import { IBodyResponse } from '@/modules/common/types';
import { ElLoading } from 'element-plus';
import { mixins } from 'vue-class-component';
import { cameraService } from '../../services/api.service';
import { cameraConfigModule } from '../../store/camera.config.store';
import { cameraFormModule } from '../../store/camera.form.store';
import { cameraListModule } from '../../store/camera.list.store';
import {
    ICameraDetail,
    IGetDetailCamera,
    IUserDetail,
    IUserGroupDetail,
} from '../../types';
import { PermissionActions } from '@/modules/role/role.constant';
import { ConnectionStatus, POPUP_NAME } from '../../constants';

export default class DetailCameraPopup extends mixins(UtilMixins) {
    get isShowDetailCamera(): boolean {
        return cameraListModule.displayCameraPopups[POPUP_NAME.DETAIL_FORM_POPUP];
    }

    get cameraInfo(): ICameraDetail {
        return cameraFormModule.cameraDetail;
    }

    get userNames(): string | undefined {
        return this.cameraInfo?.usersInfo
            ?.map((user: IUserDetail) => user.username)
            .join(', ');
    }

    get cameraGroups(): string | undefined {
        return this.cameraInfo.cameraGroups
            ?.map((cameraGroup) => cameraGroup?.name)
            .join(', ');
    }

    get groupNames(): string | undefined {
        return this.cameraInfo?.groupUserInfo
            ?.map((group: IUserGroupDetail) => group.name)
            .join(', ');
    }

    get canUpdate(): boolean {
        return cameraListModule.userPermissions.includes(PermissionActions.UPDATE);
    }

    get canConfig(): boolean {
        return cameraListModule.userPermissions.includes(PermissionActions.CONFIG);
    }

    get canDelete(): boolean {
        return cameraListModule.userPermissions.includes(PermissionActions.DELETE);
    }

    loading = true;

    async openDetailPopup(): Promise<void> {
        const loading = ElLoading.service();
        const response = (await cameraService.getDetail(
            cameraFormModule._id,
        )) as IGetDetailCamera;
        this.loading = false;
        if (response.success) {
            cameraFormModule.setCameraDetail(response.data);
        } else if (!response?.isRequestError) {
            cameraFormModule.setCameraDetail({} as ICameraDetail);
            cameraListModule.closeCameraPopup(POPUP_NAME.DETAIL_FORM_POPUP);
            this.showErrorNotification(response.message);
            await cameraListModule.getCameraList();
        }
        loading.close();
    }

    closeCameraDetailPopup(): void {
        cameraListModule.closeCameraPopup(POPUP_NAME.DETAIL_FORM_POPUP);
        cameraFormModule.setCameraDetail({} as ICameraDetail);
    }

    updateCamera(): void {
        cameraListModule.openCameraPopup(POPUP_NAME.UPDATE_FORM_POPUP);
    }

    openSettingPopup(): void {
        cameraConfigModule.showCameraRecordingConfigurationPopup(this.cameraInfo._id);
    }

    async deleteCamera(): Promise<void> {
        const { _id, name } = cameraFormModule.cameraDetail;
        try {
            const result = await this.showConfirmPopUp(
                i18n.global.t('camera.cameraForm.confirmPopup.message', {
                    name: name,
                }) as string,
                i18n.global.t('camera.cameraForm.confirmPopup.title') as string,
            );
            if (result) {
                cameraFormModule.setCameraDetail({
                    _id: '',
                    uid: '',
                    model: '',
                    serialNumber: '',
                    name: '',
                    cameraGroups: [],
                    userIds: [],
                    password: '',
                    userGroupIds: [],
                    connectionStatus: ConnectionStatus.ONLINE,
                });
                this.closeCameraDetailPopup();
                const loading = ElLoading.service({
                    target: '.page-content',
                });
                const response = (await cameraService.delete(
                    _id,
                )) as IBodyResponse<string>;
                if (response.success) {
                    this.showSuccessNotification(
                        i18n.global.t(
                            'camera.cameraForm.confirmPopup.deleteSuccess',
                        ) as string,
                    );
                } else if (!response?.isRequestError) {
                    this.showErrorNotification(response.message);
                }
                await cameraListModule.getCameraList();
                loading.close();
            }
        } catch (error) {
            this.showErrorNotification(
                i18n.global.t('common.app.error.message') as string,
            );
        }
    }
}
</script>
<style scoped>
.main-info {
    margin-left: 0;
    padding: 0;
}
.item-label {
    width: 40%;
    padding-left: 0px !important;
    padding: 10px;
    text-align: left;
    word-break: break-word;
}
.item-value {
    padding: 10px;
}
.row-item {
    display: flex;
    margin-right: 0px !important;
    border-bottom: 1px solid #eaf0f9;
}

@media only screen and (max-width: 992px) {
    .redundant {
        display: none;
    }
}
</style>
