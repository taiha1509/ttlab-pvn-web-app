<template>
    <BaseDialogLayout
        v-model:value="isShowCreateForm"
        width="50%"
        customClass="create-layout"
        @before-close="closeCameraCreateForm"
        @open="openCreateCameraPopup"
        :title="$t('camera.cameraForm.create.title')"
    >
        <template #content>
            <!-- <div class="row">
                <div class="col-md-12 radio">
                    <el-radio
                        @change="handleCheck"
                        v-model="form.connectionType"
                        :label="onvif"
                        >{{ $t('camera.cameraForm.create.ONVIF') }}</el-radio
                    >
                    <el-radio
                        @change="handleCheck"
                        v-model="form.connectionType"
                        :label="p2p"
                        >{{ $t('camera.cameraForm.create.P2P') }}</el-radio
                    >
                </div>
            </div> -->
            <div class="row">
                <div class="col-12">
                    <BaseInputText
                        v-model:value="form.name"
                        :isRequired="true"
                        :isHorizontal="true"
                        :label="$t('camera.cameraForm.fields.name.label')"
                        :placeholder="$t('camera.cameraForm.fields.name.placeholder')"
                        :error="translateYupError(form.errors.name)"
                        @onEnter="onClickCreateCameraButton()"
                    />
                </div>
                <div class="col-12">
                    <BaseSingleSelect
                        v-model:value="form.model"
                        :isHorizontal="true"
                        :isRequired="true"
                        :label="$t('camera.cameraForm.fields.model.label')"
                        :placeholder="$t('camera.cameraForm.fields.model.placeholder')"
                        :options="modelOptions"
                        :filterable="true"
                        :teleported="true"
                        :error="translateYupError(form.errors.model)"
                    />
                </div>
                <div class="col-12">
                    <BaseInputText
                        v-model:value="form.serialNumber"
                        :isHorizontal="true"
                        :isRequired="true"
                        :label="$t('camera.cameraForm.fields.serialNumber.label')"
                        :placeholder="
                            $t('camera.cameraForm.fields.serialNumber.placeholder')
                        "
                        :error="translateYupError(form.errors.serialNumber)"
                        @onEnter="onClickCreateCameraButton()"
                    />
                </div>
                <div class="col-12">
                    <BaseInputText
                        v-model:value="form.uid"
                        :isRequired="true"
                        :isHorizontal="true"
                        :label="$t('camera.cameraForm.fields.uid.label')"
                        :placeholder="$t('camera.cameraForm.fields.uid.placeholder')"
                        :error="translateYupError(form.errors.uid)"
                        @onEnter="onClickCreateCameraButton()"
                    />
                </div>
                <div class="col-12">
                    <BaseInputText
                        v-if="form.connectionType === onvif"
                        v-model:value="form.userName"
                        :isRequired="true"
                        :isHorizontal="true"
                        :label="$t('camera.cameraForm.fields.userName.label')"
                        :placeholder="$t('camera.cameraForm.fields.userName.placeholder')"
                        :error="translateYupError(form.errors.userName)"
                        @onEnter="onClickCreateCameraButton()"
                    />
                </div>
                <div class="col-12">
                    <BaseInputText
                        v-model:value="form.password"
                        :type="'password'"
                        :isRequired="true"
                        :isHorizontal="true"
                        :showPassword="true"
                        :label="$t('camera.cameraForm.fields.password.label')"
                        :placeholder="$t('camera.cameraForm.fields.password.placeholder')"
                        :error="translateYupError(form.errors.password)"
                    />
                </div>
                <div class="col-12">
                    <BaseMultipleSelectTreeView
                        v-if="form.connectionType !== onvif"
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
            </div>
        </template>

        <template #footer>
            <div
                class="col-md-4 col-sm-6 d-flex justify-content-md-center justify-content-center"
            >
                <el-button
                    type="primary"
                    :disabled="isCreatingCamera"
                    @click="onClickCreateCameraButton"
                >
                    {{ $t('common.app.buttons.confirm') }}
                </el-button>
                <el-button @click="closeCameraCreateForm">
                    {{ $t('common.app.buttons.cancel') }}
                </el-button>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { initData } from '../../composition/createForm';
import { mixins, setup } from 'vue-class-component';
import { cameraFormModule } from '../../store/camera.form.store';
import {
    ConfigurationAttribute,
    ConnectionStatus,
    ConnectionType,
    POPUP_NAME,
} from '../../constants';
import { ICameraGroup } from '@/modules/camera-group/types';
import { ICameraDetail } from '../../types';
import { ElLoading } from 'element-plus';
import { cameraListModule } from '../../store/camera.list.store';

export default class CreateCameraPopup extends mixins(UtilMixins) {
    onvif = ConnectionType.ONVIF;
    p2p = ConnectionType.P2P;

    get isShowCreateForm(): boolean {
        return (
            cameraListModule.displayCameraPopups[POPUP_NAME.CREATE_FORM_POPUP] || false
        );
    }

    get cameraGroupsOptions(): ICameraGroup[] {
        return cameraFormModule.cameraGroups;
    }

    get cameraInfo(): ICameraDetail {
        return cameraFormModule.cameraDetail;
    }

    get isCreatingCamera(): boolean {
        return cameraFormModule.isCreatingCamera;
    }

    handleCheck(): void {
        this.form.resetForm({
            values: {
                connectionType: this.form.connectionType as string,
                uid: '',
                model: '',
                serialNumber: '',
                name: '',
                userName: '',
                password: '',
                cameraGroups: [] as string[],
            },
        });
    }

    form = setup(() => initData());

    get modelOptions(): Record<string, string>[] {
        return cameraListModule.cameraModels
            .filter((cameraModel) => {
                if (this.form.connectionType === this.onvif)
                    return cameraModel.configurations.includes(
                        ConfigurationAttribute.ONVIF_CONNECTION,
                    );
                return true;
            })
            .map((item) => ({
                value: item.name,
                label: item.name?.toUpperCase(),
            }));
    }

    async onClickCreateCameraButton(): Promise<void> {
        ((await this.form.onSubmit) as () => Promise<void>)();
    }

    async openCreateCameraPopup(): Promise<void> {
        const loading = ElLoading.service({
            target: '.create-layout',
        });
        await cameraFormModule.getCameraGroupList();
        loading.close();
    }

    closeCameraCreateForm(): void {
        this.form.resetForm({
            values: {
                uid: '',
                model: '',
                serialNumber: '',
                name: '',
                connectionType: ConnectionType.P2P,
                userName: '',
                password: '',
                cameraGroups: [] as string[],
            },
        });
        cameraListModule.closeCameraPopup(POPUP_NAME.CREATE_FORM_POPUP);
        cameraFormModule.setCameraDetail({
            _id: '',
            uid: '',
            model: '',
            serialNumber: '',
            password: '',
            name: '',
            cameraGroups: [],
            connectionStatus: ConnectionStatus.ONLINE,
        });
    }
}
</script>
<style scoped lang="scss">
.radio {
    padding-bottom: 10px;
}
:deep(.el-select__popper) {
    transform: translateY(12px) !important;
}
.vms-form-item {
    display: flex;
    margin-bottom: 15px;
}
.vms-form-label {
    font-size: 13px;
    color: #656d9a;
}
.mark-required {
    color: #de2b2b;
}
</style>
