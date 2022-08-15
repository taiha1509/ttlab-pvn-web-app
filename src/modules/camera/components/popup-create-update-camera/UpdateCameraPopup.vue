<template>
    <BaseDialogLayout
        v-model:value="isShowUpdatePopup"
        width="50%"
        customClass="update-camera-layout"
        @before-close="closeCameraUpdateForm"
        :title="$t('camera.cameraForm.update.title')"
        @open="openUpdateDialog"
    >
        <template #content>
            <div class="row main-info">
                <div class="col-12">
                    <BaseInputText
                        v-model:value="form.name"
                        :isRequired="true"
                        :isHorizontal="true"
                        :label="$t('camera.cameraForm.fields.name.label')"
                        :placeholder="$t('camera.cameraForm.fields.name.placeholder')"
                        :error="translateYupError(form.errors.name)"
                        @onEnter="onClickUpdateButtonCamera"
                    />
                </div>
                <div class="col-12">
                    <BaseMultipleSelectTreeView
                        v-model:value="form.cameraGroups"
                        :isHorizontal="true"
                        :label="$t('camera.cameraForm.fields.cameraGroupId.label')"
                        :placeholder="
                            $t('camera.cameraForm.fields.cameraGroupId.placeholder')
                        "
                        :treeData="cameraGroupsOptions"
                        :filterable="true"
                    />
                </div>
                <div class="col-12">
                    <BaseMultipleSelectTreeView
                        :isHorizontal="true"
                        :label="$t('camera.cameraForm.fields.groupUserIds.label')"
                        :placeholder="
                            $t('camera.cameraForm.fields.groupUserIds.placeholder')
                        "
                        nodeKey="id"
                        v-model:value="form.userGroupIds"
                        :treeData="userGroupsOptions"
                        :filterable="true"
                    />
                </div>
                <div class="col-12">
                    <BaseMultipleSelect
                        v-model:value="form.userIds"
                        :isHorizontal="true"
                        :label="$t('camera.cameraForm.fields.userIds.label')"
                        :placeholder="$t('camera.cameraForm.fields.userIds.placeholder')"
                        :options="usersOptions"
                        :filterable="true"
                        :teleported="true"
                    />
                </div>
                <div class="col-12" v-if="cameraInfo.userName">
                    <div class="vms-form-item">
                        <label class="vms-form-label w-25 text-right onvif-label">
                            {{ $t('camera.cameraForm.fields.requestONVIF') }}
                        </label>
                        <div class="vms-form-content onvif-content">
                            <JsonTreeView
                                :data="JSON.stringify(cameraInfo?.onvifProfile || {})"
                                class="onvif-profile"
                            >
                            </JsonTreeView>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div
                class="col-md-4 col-sm-6 d-flex justify-content-md-center justify-content-center"
            >
                <el-button
                    v-if="cameraInfo?.userName"
                    type="primary"
                    @click="requestOnvifProfile"
                >
                    {{ $t('camera.cameraForm.fields.requestONVIF') }}
                </el-button>
                <el-button type="primary" @click="onClickUpdateButtonCamera">
                    {{ $t('common.app.buttons.confirm') }}
                </el-button>
                <el-button @click="closeCameraUpdateForm">
                    {{ $t('common.app.buttons.cancel') }}
                </el-button>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { initData } from '../../composition/updateForm';
import { mixins, Options, setup } from 'vue-class-component';
import { cameraFormModule } from '../../store/camera.form.store';
import { ICameraDetail, IGetDetailCamera } from '../../types';
import { ElLoading } from 'element-plus';
import Socket from '@/plugins/socket/socket';
import { ICameraGroup } from '@/modules/camera-group/types';
import { ISelectOptions, ITreeNode } from '@/modules/common/types';
import { cameraService } from '../../services/api.service';
import { IBodyResponse } from '@/plugins/axios/types';
import { ConnectionStatus, POPUP_NAME } from '../../constants';
import { cameraListModule } from '../../store/camera.list.store';
import { JsonTreeView } from 'json-tree-view-vue3';
import i18n from '@/plugins/vue-i18n';
import { appService } from '@/utils/app';
import { BaseService } from '@/utils/api';
import service from '@/plugins/axios';

@Options({
    components: { JsonTreeView },
})
export default class UpdateCameraPopup extends mixins(UtilMixins) {
    isWaiting = false;

    get isShowUpdatePopup(): boolean {
        return (
            cameraListModule.displayCameraPopups[POPUP_NAME.UPDATE_FORM_POPUP] || false
        );
    }

    get usersOptions(): ISelectOptions[] {
        return cameraFormModule.users;
    }

    get cameraInfo(): ICameraDetail {
        return cameraFormModule.cameraDetail;
    }

    get cameraGroupsOptions(): ICameraGroup[] {
        return cameraFormModule.cameraGroups;
    }

    get userGroupsOptions(): ITreeNode[] {
        return cameraFormModule.userGroups;
    }

    subscribeReceiveOnvifProfile(): void {
        Socket.subscribeReceiveOnvifProfile((result: Record<string, string | number>) => {
            console.log('subscribeReceiveOnvifProfile receive: ', result);
            this.form.onvifProfile = result;
            setTimeout(() => {
                if (!result) {
                    this.showErrorNotification(
                        i18n.global.t('camera.cameraForm.errors.onvifProfile'),
                    );
                    this.isWaiting = false;
                }
            }, 60000);
            this.isWaiting = false;
        });
    }

    async requestOnvifProfile(): Promise<void> {
        const validate = await this.form.validate();
        if (validate?.valid) {
            this.isWaiting = true;
            this.form.onvifProfile = null;
            const clientSocketRoom = `${Socket.getSocket().id}_${
                appService.getUser().id
            }`;
            const baseService = new BaseService({ baseUrl: '/camera' }, service);
            const loading = ElLoading.service({
                target: '.create-layout',
            });
            const response = (await baseService.client.post(
                `${baseService.baseUrl}/request-onvif-profile`,
                {
                    ...{
                        uid: this.cameraInfo.uid,
                        username: this.cameraInfo.userName,
                        password: this.cameraInfo.password,
                    },
                    clientSocketRoom,
                },
            )) as any;
            if (!response?.success && !response?.isRequestError) {
                this.showErrorNotification(
                    i18n.global.t('camera.cameraForm.errors.onvifProfile'),
                );
                this.isWaiting = false;
            }
            this.isWaiting = false;
            loading.close();
        }
    }

    mounted(): void {
        this.subscribeReceiveOnvifProfile();
    }

    async openUpdateDialog(): Promise<void> {
        const loading = ElLoading.service({});
        const [cameraResponse] = (await Promise.all([
            cameraService.getDetail(cameraFormModule._id),
            cameraFormModule.getCameraGroupList(),
            cameraFormModule.getDropdownUserGroup(),
            cameraFormModule.getDropdownUsers(),
        ])) as IBodyResponse[];
        const cameraDetail = cameraResponse as IGetDetailCamera;
        if (cameraDetail.success) {
            cameraFormModule.setCameraDetail(cameraDetail?.data);
            if (cameraDetail?.data?.cameraGroups) {
                this.form.cameraGroups = cameraDetail.data.cameraGroups.map(
                    (ele) => ele._id,
                );
            }
        } else if (!cameraDetail?.isRequestError) {
            cameraFormModule.setCameraDetail({} as ICameraDetail);
            this.showErrorNotification(cameraResponse.message);
            cameraListModule.closeCameraPopup(POPUP_NAME.UPDATE_FORM_POPUP);
        }
        this.form.initDataPopup();
        loading.close();
    }

    form = setup(() => initData());

    async onClickUpdateButtonCamera(): Promise<void> {
        ((await this.form.onSubmit) as () => Promise<void>)();
    }

    closeCameraUpdateForm(): void {
        this.form.resetForm({
            values: {
                name: '',
                cameraGroups: [] as string[],
                userIds: [] as number[],
                userGroupIds: [] as number[],
            },
        });
        cameraListModule.closeCameraPopup(POPUP_NAME.UPDATE_FORM_POPUP);
        cameraFormModule.setCameraDetail({
            _id: '',
            uid: '',
            model: '',
            serialNumber: '',
            name: '',
            cameraGroups: [],
            userIds: [],
            userGroupIds: [],
            password: '',
            connectionStatus: ConnectionStatus.ONLINE,
        });
    }
}
</script>
<style scoped lang="scss">
.onvif-profile {
    border: 1px solid #7081b9;
    border-radius: 8px;
    padding: 5px;
}
:deep(.value-key) {
    white-space: normal !important;
}
.onvif-content {
    width: calc(75% - 10px);
    display: inline-block;
}
.onvif-label {
    color: #656d9a;
}
</style>
