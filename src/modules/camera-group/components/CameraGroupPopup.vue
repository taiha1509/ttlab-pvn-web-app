<template>
    <BaseDialogLayout
        v-model:value="isShowCameraGroupPopup"
        width="40%"
        customClass="camera-group-layout"
        @open="openPopup"
        @before-close="closeCameraGroupForm"
        :title="
            isCreated
                ? $t('cameraGroup.cameraGroup.cameraGroupForm.create')
                : $t('cameraGroup.cameraGroup.cameraGroupForm.update')
        "
    >
        <template #content>
            <div class="row main-info">
                <div class="col-12">
                    <BaseInputText
                        v-model:value="form.name"
                        :isRequired="true"
                        :isHorizontal="true"
                        :label="$t('cameraGroup.cameraGroup.fields.name.label')"
                        :placeholder="
                            $t('cameraGroup.cameraGroup.fields.name.placeholder')
                        "
                        :error="translateYupError(form.errors.name)"
                        @onEnter="onClickOkButton"
                    />
                </div>
            </div>
        </template>

        <template #footer>
            <div
                class="col-md-4 col-sm-6 d-flex justify-content-md-center justify-content-center"
            >
                <el-button type="primary" @click="onClickOkButton">
                    {{ $t('common.app.buttons.confirm') }}
                </el-button>
                <el-button @click="closeCameraGroupForm">
                    {{ $t('common.app.buttons.cancel') }}
                </el-button>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { initData } from '../composition/form';
import { mixins, setup } from 'vue-class-component';
import { cameraGroupListModule } from '../store/cameraGroup.store';
import { ICameraGroupDetail, IGetDetailCameraGroup } from '../types';
import { cameraGroupService } from '../services/api.service';
import { ElLoading } from 'element-plus';
import { HttpStatus } from '@/modules/common/constants';

export default class CameraGroupPopup extends mixins(UtilMixins) {
    get isCreated(): boolean {
        return cameraGroupListModule.isCreate;
    }

    get isShowCameraGroupPopup(): boolean {
        return cameraGroupListModule.isShowCameraGroupPopup || false;
    }

    set isShowCameraGroupPopup(val: boolean) {
        cameraGroupListModule.setIsShowFormPopup(val);
    }

    get cameraGroupInfo(): ICameraGroupDetail {
        return cameraGroupListModule.cameraGroupDetail;
    }

    form = setup(() => initData());

    async onClickOkButton(): Promise<void> {
        ((await this.form.onSubmit) as () => Promise<void>)();
    }

    async openPopup(): Promise<void> {
        this.form.resetForm({
            values: {
                name: '',
            },
        });
        if (!this.isCreated) {
            const loading = ElLoading.service({});
            const response = (await cameraGroupService.getDetail(
                cameraGroupListModule.cameraGroupDetail._id,
            )) as IGetDetailCameraGroup;
            if (response.success) {
                cameraGroupListModule.setGroupDetail({
                    _id: response.data._id,
                    name: response.data.name,
                });
                this.form.initDataPopup();
            } else if (!response.isRequestError) {
                cameraGroupListModule.setGroupDetail({} as ICameraGroupDetail);
                this.showErrorNotification(response.message);
                cameraGroupListModule.setIsShowFormPopup(false);
                if (response.code === HttpStatus.ITEM_NOT_EXISTED)
                    await cameraGroupListModule.getCameraGroupList();
            }
            loading.close();
        }
    }

    closeCameraGroupForm(): void {
        cameraGroupListModule.setIsShowFormPopup(false);
    }
}
</script>
<style scoped lang="scss"></style>
