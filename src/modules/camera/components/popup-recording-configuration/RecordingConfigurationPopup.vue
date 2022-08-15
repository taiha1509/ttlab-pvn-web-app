<template>
    <BaseDialogLayout
        v-model:value="isShowDialog"
        width="500px"
        customClass="recording-layout"
        @open="onOpenDialog"
        @before-close="onCloseDialog"
        :title="title"
    >
        <template #sub-title>
            <h5 class="camera-name-title">
                {{ $t('camera.cameraConfig.cameraName') }}: {{ selectedCamera.name }}
            </h5>
        </template>
        <template #content>
            <BaseSingleSelect
                v-model:value="form.data.resolution"
                :label="$t('camera.cameraConfig.recording.resolution')"
                :placeholder="$t('camera.cameraConfig.recording.resolutionPlaceholder')"
                :options="resolutionOptions"
                :isHorizontal="true"
                :teleported="true"
                :error="form.error.resolution"
            />
            <BaseSingleSelect
                v-model:value="form.data.encoding"
                :label="$t('camera.cameraConfig.recording.encoding')"
                :placeholder="$t('camera.cameraConfig.recording.encodingPlaceholder')"
                :options="encodingOptions"
                :isHorizontal="true"
                :teleported="true"
                :error="form.error.encoding"
            />
            <BaseSwitch
                v-model:value="form.data.hasAudio"
                :label="$t('camera.cameraConfig.recording.audio')"
                :isHorizontal="true"
                :error="form.error.hasAudio"
            />
            <BaseSwitch
                v-model:value="form.data.gpsLocate"
                :label="$t('camera.cameraConfig.recording.locating')"
                :isHorizontal="true"
                :error="form.error.gpsLocate"
            />
        </template>
        <template #footer>
            <div class="button-group">
                <el-button class="button-back" @click="onCloseDialog">{{
                    $t('camera.cameraConfig.button.back')
                }}</el-button>
                <el-button class="button-save" type="primary" @click="save">{{
                    $t('camera.cameraConfig.button.save')
                }}</el-button>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { Options, mixins } from 'vue-property-decorator';
import { setup } from 'vue-class-component';
import { cameraConfigModule } from '../../store/camera.config.store';
import { Encoding, POPUP_NAME, Resolution } from '../../constants';
import { initRecordingCameraConfigForm } from '../../composition/cameraConfig.form';
import { ICameraDetail } from '../../types';
import { UtilMixins } from '@/mixins/utilMixins';
import { ElLoading } from 'element-plus';
import { cameraService } from '../../services/api.service';
import { IBodyResponse } from '@/modules/common/types';
import { cameraListModule } from '../../store/camera.list.store';

@Options({ components: {} })
export default class RecordingConfigurationPopup extends mixins(UtilMixins) {
    form = setup(() => initRecordingCameraConfigForm());

    get title(): string {
        return this.$t('camera.cameraConfig.typeTitle', {
            type: this.$t(`camera.cameraConfig.configType.recording`),
        });
    }

    get resolutionOptions(): Record<string, string>[] {
        return Object.values(Resolution).map((value) => ({ value, label: value }));
    }

    get encodingOptions(): Record<string, string>[] {
        return Object.values(Encoding).map((value) => ({
            value,
            label: this.$t(`camera.cameraConfig.encodingOption.${value}`),
        }));
    }

    get isShowDialog(): boolean {
        return cameraListModule.displayCameraPopups[
            POPUP_NAME.RECORDING_CONFIGURATION_POPUP
        ];
    }

    get selectedCamera(): ICameraDetail {
        return cameraConfigModule.selectedCamera || {};
    }

    onCloseDialog(): void {
        this.form.resetForm();
        cameraListModule.closeCameraPopup(POPUP_NAME.RECORDING_CONFIGURATION_POPUP);
    }

    async onOpenDialog(): Promise<void> {
        const loading = ElLoading.service({
            target: '.recording-layout',
        });
        const response = (await cameraService.getDetail(
            this.selectedCamera._id,
        )) as IBodyResponse<ICameraDetail>;
        loading.close();
        if (response.success) {
            const data = response.data?.recordingConfiguration;
            this.form.resetForm({
                values: {
                    resolution: data?.resolution || null,
                    encoding: data?.encoding || null,
                    hasAudio: typeof data?.hasAudio === 'boolean' ? data?.hasAudio : true,
                    gpsLocate:
                        typeof data?.gpsLocate === 'boolean' ? data?.gpsLocate : true,
                },
            });
        } else if (!response.isRequestError) {
            this.showErrorNotification(response.message);
            this.onCloseDialog();
            await cameraListModule.getCameraList();
        }
    }

    async save(): Promise<void> {
        const { valid } = await this.form.validate();
        if (!valid) return;
        const loading = ElLoading.service({
            target: '.recording-layout',
        });
        const response = await cameraService.updateRecordingConfiguration(
            this.selectedCamera._id,
            {
                resolution: Object.values(Resolution).includes(this.form.data?.resolution)
                    ? this.form.data?.resolution
                    : null,
                encoding: Object.values(Encoding).includes(this.form.data?.encoding)
                    ? this.form.data?.encoding
                    : null,
                hasAudio: this.form.data?.hasAudio,
                gpsLocate: this.form.data?.gpsLocate,
            },
        );
        loading.close();
        if (response?.success) {
            this.showSuccessNotification(
                this.$t('camera.cameraConfig.success.configRecording'),
            );
            this.onCloseDialog();
        } else if (!response.isRequestError) {
            this.showErrorNotification(response.message);
        }
    }
}
</script>

<style lang="scss" scoped>
.button-group {
    display: flex;
    justify-content: center;
}
.button-back,
.button-save {
    width: auto;
}

.vms-form-label,
.schedule-index {
    font-size: 13px;
    color: #656d9a;
}
.camera-name-title {
    max-width: 460px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
