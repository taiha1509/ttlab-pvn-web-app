<template>
    <BaseDialogLayout
        v-model:value="isShowDialog"
        width="600px"
        customClass="schedule-layout"
        @open="onOpenDialog"
        @before-close="onCloseDialog"
        :title="title"
    >
        <template #sub-title>
            <h5 :style="textOptions">
                {{ $t('camera.cameraConfig.cameraName') }}: {{ selectedCamera.name }}
            </h5>
        </template>
        <template #content>
            <template v-if="scheduleConfigurations.length">
                <template v-for="item in scheduleConfigurations" :key="item._id">
                    <ScheduleConfigurationItem :scheduleConfiguration="item">
                        <EditIcon
                            class="icon-edit"
                            v-show="canConfig"
                            @click="openScheduleFormPopup(item._id)"
                        />
                        <DeleteIcon
                            class="icon-delete"
                            v-show="canConfig"
                            @click="deleteScheduleConfiguration(item._id)"
                        />
                    </ScheduleConfigurationItem>
                    <el-divider class="schedule-divider"></el-divider>
                </template>
            </template>
            <template v-else>
                <el-empty></el-empty>
            </template>
        </template>
        <template #footer>
            <div class="button-group">
                <el-button class="button-back" @click="onCloseDialog">
                    {{ $t('camera.cameraConfig.button.back') }}
                </el-button>
                <el-button
                    class="button-save"
                    type="primary"
                    v-if="canConfig"
                    @click="openScheduleFormPopup()"
                >
                    {{ $t('camera.cameraConfig.button.create') }}
                </el-button>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { Options, mixins } from 'vue-property-decorator';
import ScheduleConfigurationItem from './ScheduleConfigurationItem.vue';
import { Edit as EditIcon, Delete as DeleteIcon } from '@element-plus/icons-vue';

import { cameraConfigModule } from '../../store/camera.config.store';
import { ElLoading } from 'element-plus';
import { UtilMixins } from '@/mixins/utilMixins';
import { ICameraDetail, IScheduleConfiguration } from '../../types';
import { cameraService } from '../../services/api.service';
import { cameraListModule } from '../../store/camera.list.store';
import { PermissionActions } from '@/modules/role/role.constant';
import { POPUP_NAME } from '../../constants';

@Options({ components: { ScheduleConfigurationItem, EditIcon, DeleteIcon } })
export default class ScheduleConfigurationPopup extends mixins(UtilMixins) {
    get title(): string {
        return this.$t('camera.cameraConfig.typeTitle', {
            type: this.$t(`camera.cameraConfig.configType.schedules`),
        });
    }

    get canConfig(): boolean {
        return cameraListModule.userPermissions.includes(PermissionActions.CONFIG);
    }

    get isShowDialog(): boolean {
        return cameraListModule.displayCameraPopups[
            POPUP_NAME.SCHEDULE_LIST_CONFIGURATION_POPUP
        ];
    }

    get selectedCamera(): ICameraDetail {
        return cameraConfigModule.selectedCamera;
    }

    get scheduleConfigurations(): IScheduleConfiguration[] {
        return cameraConfigModule.scheduleConfigurations || [];
    }

    get textOptions(): Record<string, string> {
        return {
            maxWidth: '560px !important',
            wordBreak: 'break-all',
        };
    }

    async onOpenDialog(): Promise<void> {
        const loading = ElLoading.service({
            target: '.schedule-layout',
        });
        const response = await cameraConfigModule.getScheduleConfigurations(
            this.selectedCamera?._id,
        );
        loading.close();
        if (!response.success && !response.isRequestError) {
            this.showErrorNotification(response.message);
            cameraListModule.closeCameraPopup(
                POPUP_NAME.SCHEDULE_LIST_CONFIGURATION_POPUP,
            );
            await cameraListModule.getCameraList();
        }
    }

    onCloseDialog(): void {
        cameraListModule.closeCameraPopup(POPUP_NAME.SCHEDULE_LIST_CONFIGURATION_POPUP);
    }

    async openScheduleFormPopup(scheduleId?: string): Promise<void> {
        cameraConfigModule.SET_SELECTED_SCHEDULE_CONFIGURATION_ID(scheduleId || '');
        cameraListModule.openCameraPopup(POPUP_NAME.SCHEDULE_FORM_CONFIGURATION_POPUP);
    }

    async deleteScheduleConfiguration(scheduleId: string): Promise<void> {
        const confirm = await this.showConfirmPopUp(
            this.$t('camera.cameraConfig.confirm.deleteSchedule'),
            this.$t('camera.cameraConfig.confirm.deleteScheduleTitle'),
        );
        if (!confirm) return;
        const loading = ElLoading.service({
            target: '.schedule-layout',
        });
        const response = await cameraService.deleteScheduleConfiguration(scheduleId);
        loading.close();
        if (response.success) {
            this.showSuccessNotification(
                this.$t('camera.cameraConfig.success.deleteSchedule'),
            );
            // sync schedule configuration list
            const newScheduleConfigurations = this.scheduleConfigurations.filter(
                (item) => item._id !== scheduleId,
            );
            cameraConfigModule.SET_SCHEDULE_CONFIGURATION_LIST(newScheduleConfigurations);
        } else if (!response.isRequestError) {
            this.showErrorNotification(response.message);
        }
    }
}
</script>

<style lang="scss" scoped>
.schedule-divider {
    margin-top: 0;
}
.icon-delete,
.icon-edit {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.icon-delete {
    color: var(--bs-dark);
}

.icon-edit {
    margin-left: auto;
    margin-right: 12px;
}
.button-group {
    width: auto;
}
</style>
