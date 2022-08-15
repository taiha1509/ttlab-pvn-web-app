<template>
    <BaseDialogLayout
        v-model:value="isShowDialog"
        width="550px"
        customClass="schedule-form-layout"
        @open="onOpenDialog"
        @before-close="onCloseDialog"
        :title="
            !!this.selectedScheduleId
                ? $t(`camera.cameraConfig.schedule.updateTitle`)
                : $t(`camera.cameraConfig.schedule.createTitle`)
        "
    >
        <template #sub-title>
            <h5 :style="textOptions">
                {{ $t('camera.cameraConfig.cameraName') }}: {{ selectedCamera.name }}
            </h5>
        </template>
        <template #content>
            <div class="row">
                <div class="col">
                    <BaseDatePicker
                        v-model:value="form.data.startDate"
                        :label="$t('camera.cameraConfig.schedule.startDate')"
                        :placeholder="
                            $t('camera.cameraConfig.schedule.startDatePlaceholder')
                        "
                        :error="translateYupError(form.error.startDate)"
                        :minDate="minStartDate"
                        :maxDate="maxStartDate"
                    />
                </div>
                <div class="col">
                    <BaseDatePicker
                        v-model:value="form.data.endDate"
                        :label="$t('camera.cameraConfig.schedule.endDate')"
                        :placeholder="
                            $t('camera.cameraConfig.schedule.endDatePlaceholder')
                        "
                        :error="translateYupError(form.error.endDate)"
                        :minDate="minEndDate"
                        :maxDate="maxEndDate"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <BaseTimePicker
                        v-model:value="form.data.startTime"
                        :error="translateYupError(form.error.startTime)"
                        :isRequired="true"
                        :label="$t('camera.cameraConfig.schedule.startTime')"
                        :placeholder="
                            $t('camera.cameraConfig.schedule.startTimePlaceholder')
                        "
                        :disabled="disabled"
                        :minTime="minStartTime"
                        :maxTime="maxStartTime"
                        index="0"
                    />
                </div>
                <div class="col">
                    <BaseTimePicker
                        v-model:value="form.data.endTime"
                        :error="endTimeError || translateYupError(form.error.endTime)"
                        :isRequired="true"
                        :label="$t('camera.cameraConfig.schedule.endTime')"
                        :placeholder="
                            $t('camera.cameraConfig.schedule.endTimePlaceholder')
                        "
                        :disabled="disabled"
                        :minTime="minEndTime"
                        index="1"
                    />
                </div>
            </div>
            <BaseSingleSelect
                v-model:value="form.data.repeatType"
                :error="translateYupError(form.error.repeatType)"
                :label="$t('camera.cameraConfig.schedule.repeatType')"
                :placeholder="$t('camera.cameraConfig.schedule.repeatTypePlaceholder')"
                :options="repeatOptions"
                :isRequired="true"
                :teleported="true"
            />
            <BaseCheckboxGroup
                v-show="isCustomRepeat"
                v-model:value="form.data.repeatDays"
                :isRequired="true"
                :error="translateYupError(form.error.repeatDays)"
                :label="$t('camera.cameraConfig.schedule.repeatOn')"
                :options="weekdayOptions"
                class="weekday-checkbox"
            />
            <BaseRadio
                :isRequired="true"
                v-model:value="form.data.recordAtServer"
                :label="$t('camera.cameraConfig.recording.recordAtServer')"
                :error="form.error.hasAudio"
                :options="recordPlaceOptions"
            />
        </template>
        <template #footer>
            <div class="button-group">
                <el-button class="button-back" @click="onCloseDialog">{{
                    $t('camera.cameraConfig.button.back')
                }}</el-button>
                <el-button
                    :disabled="isDisabledSaveButton"
                    class="button-save"
                    type="primary"
                    @click="save"
                    >{{
                        selectedScheduleId
                            ? $t('camera.cameraConfig.button.update')
                            : $t('camera.cameraConfig.button.create')
                    }}</el-button
                >
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { mixins, setup } from 'vue-class-component';
import { Options, Watch } from 'vue-property-decorator';
import { cameraConfigModule } from '../../store/camera.config.store';
import {
    ConfigurationAttribute,
    DEFAULT_SCHEDULE_TIME_SEPARATION,
    POPUP_NAME,
    ScheduleRepeatType,
    Weekday,
} from '../../constants';
import moment from 'moment';
import { initScheduleRepetitionForm } from '../../composition/cameraConfig.form';
import {
    ICameraDetail,
    ICreateScheduleConfigurationBody,
    IScheduleConfiguration,
    IUpdateScheduleConfigurationBody,
} from '../../types';
import { UtilMixins } from '@/mixins/utilMixins';
import { cameraService } from '../../services/api.service';
import { ElLoading } from 'element-plus';
import { DATE_TIME_FORMAT } from '@/modules/common/constants';
import { cameraListModule } from '../../store/camera.list.store';
import { ISelectOptions } from '@/modules/common/types';

@Options({})
export default class ScheduleFormPopup extends mixins(UtilMixins) {
    form = setup(() => initScheduleRepetitionForm());
    isDisabledSaveButton = false;

    // check selected camera's models has memory card or not
    get recordPlaceOptions(): ISelectOptions[] {
        return [
            {
                label: this.$t('camera.cameraConfig.recording.recordAtServer'),
                value: true,
            },
            {
                label: this.$t('camera.cameraConfig.recording.recordAtCamera'),
                value: false,
            },
        ];
    }

    get isShowDialog(): boolean {
        return cameraListModule.displayCameraPopups[
            POPUP_NAME.SCHEDULE_FORM_CONFIGURATION_POPUP
        ];
    }

    get hasMemoryCard(): boolean {
        const index = cameraListModule.cameraModels.findIndex(
            (cameraModel) => cameraModel?.name === this.selectedCamera?.model,
        );
        const cameraConfiguration = cameraListModule.cameraModels[index].configurations;
        return cameraConfiguration.includes(ConfigurationAttribute.HAS_MEMORY_CARD);
    }

    get selectedScheduleId(): string {
        return cameraConfigModule.selectedScheduleId || '';
    }

    get selectedCamera(): ICameraDetail {
        return cameraConfigModule.selectedCamera || {};
    }

    get scheduleDetail(): IScheduleConfiguration {
        return cameraConfigModule.scheduleConfigurationDetail || {};
    }

    get textOptions(): Record<string, string> {
        return {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '560px !important',
        };
    }

    // START-DATE
    get minStartDate(): string {
        return moment(
            moment(this.form.data.startTime, DATE_TIME_FORMAT.HH_mm_COLON).toString(),
        ).isBefore(moment())
            ? moment().fmFullTimeString()
            : moment().subtract(1, 'days').fmFullTimeString();
    }

    get maxStartDate(): string | null {
        return this.form.data?.endDate || null;
    }

    get maxEndDate(): string | null {
        return this.form.data?.startDate
            ? moment(this.form.data?.startDate).add(1, 'years').fmFullTimeString()
            : moment(new Date()).add(1, 'years').fmFullTimeString();
    }

    // END-DATE
    get minEndDate(): string {
        const isBefore = moment(
            moment(this.form.data.startTime, DATE_TIME_FORMAT.HH_mm_COLON).toString(),
        ).isAfter(
            moment(
                moment(this.form.data.endTime, DATE_TIME_FORMAT.HH_mm_COLON).toString(),
            ),
            'hour',
        );
        const minDate = this.form.data.startDate
            ? moment(this.form.data.startDate as string).fmFullTimeString()
            : moment().fmFullTimeString();
        return isBefore ? moment(minDate).add(1, 'days').fmFullTimeString() : minDate;
    }

    // START-TIME
    get minStartTime(): string | null {
        if (
            this.form.data.startDate &&
            moment().isSame(this.form.data.startDate, 'day')
        ) {
            return moment().fmHM();
        }
        return null;
    }

    get maxStartTime(): string | null {
        return this.form.data?.endTime
            ? moment(this.form.data.endTime, DATE_TIME_FORMAT.HH_mm_COLON)
                  .subtract(15, 'minutes')
                  .fmHM()
            : null;
    }

    // END-TIME
    get minEndTime(): string | null {
        const isSame =
            this.form.data?.startDate && this.form.data?.endDate
                ? moment(this.form.data.startDate).isSame(moment(this.form.data.endDate))
                : false;
        if (isSame)
            return moment(this.form.data?.startTime, DATE_TIME_FORMAT.HH_mm_COLON)
                .add(DEFAULT_SCHEDULE_TIME_SEPARATION, 'minutes')
                .fmHM();
        if (
            !this.form.data?.startDate ||
            this.form.data?.startTime === '' ||
            !this.form.data?.startTime
        )
            return moment().add(DEFAULT_SCHEDULE_TIME_SEPARATION, 'minutes').fmHM();
        return null;
    }

    // Options
    get repeatOptions(): Record<string, string>[] {
        return Object.values(ScheduleRepeatType).map((value) => ({
            value,
            label: this.$t(`camera.cameraConfig.repeatType.${value}`),
        }));
    }

    get weekdayOptions(): Record<string, string>[] {
        return Object.values(Weekday).map((value) => ({
            value,
            label: this.$t(`camera.cameraConfig.weekday.${value}`),
        }));
    }

    get isCustomRepeat(): boolean {
        return this.form.data.repeatType === ScheduleRepeatType.CUSTOM;
    }

    get canSetEndDate(): string {
        return '';
    }

    onCloseDialog(): void {
        this.endTimeError = '';
        this.form.resetData();
        cameraListModule.closeCameraPopup(POPUP_NAME.SCHEDULE_FORM_CONFIGURATION_POPUP);
        cameraConfigModule.SET_SELECTED_SCHEDULE_CONFIGURATION_ID('');
    }

    created(): void {
        this.getCameraModels();
    }

    async getCameraModels(): Promise<void> {
        await cameraListModule.getCameraModels();
    }

    async onOpenDialog(): Promise<void> {
        if (this.selectedScheduleId) {
            const response = await cameraConfigModule.getScheduleConfigurationDetail({
                cameraId: this.selectedCamera._id,
                scheduleId: this.selectedScheduleId,
            });
            if (response.success) {
                const data = response.data || {};
                this.form.resetForm({
                    values: {
                        _id: data._id,
                        startDate: moment(data.initStartAt).fmDayString(),
                        endDate: moment(data.repeatEndDate).fmDayString(),
                        timeRange: {
                            start: moment(data.initStartAt).fmHM(),
                            end: moment(data.initEndAt).fmHM(),
                        },
                        repeatType: data.repeatType,
                        repeatDays: data.repeatDays,
                        recordAtServer: data.recordAtServer,
                    },
                });
            } else if (!response.isRequestError) {
                this.showErrorNotification(response.message);
                this.onCloseDialog();
            }
        }
    }

    makeBody(
        isUpdate: boolean,
    ): ICreateScheduleConfigurationBody | IUpdateScheduleConfigurationBody {
        const { startDate, endDate, startTime, endTime, repeatType, repeatDays } =
            this.form.data;
        const isAfter = moment(
            moment(startTime, DATE_TIME_FORMAT.HH_mm_COLON).toString(),
        ).isAfter(
            moment(moment(endTime, DATE_TIME_FORMAT.HH_mm_COLON).toString()),
            'hour',
        );
        const mmStartDate = moment(startDate).isValid() ? moment(startDate) : moment();
        const mmEndDate =
            endDate && moment(endDate).isValid()
                ? moment(endDate)
                : mmStartDate.clone().add(1, 'years');
        const mnEndDate = isAfter ? mmStartDate.clone().add(1, 'day') : mmStartDate;
        const initStartAt = `${mmStartDate.fmDayString()} ${startTime}:00`;
        const initEndAt = `${mnEndDate.fmDayString()} ${endTime}:00`;
        const body = {
            initStartAt: moment(initStartAt).utc().fmFullTimeString(),
            initEndAt: moment(initEndAt).utc().fmFullTimeString(),
            repeatEndDate: mmEndDate.endOfDay().utc().fmFullTimeString(),
            repeatType: repeatType || ScheduleRepeatType.ONCE,
            repeatDays: repeatDays || [],
            recordAtServer: this.form.data.recordAtServer,
        };
        return isUpdate ? { ...body, cameraId: this.selectedCamera._id } : body;
    }

    endTimeError = '';

    @Watch('form.data.endTime')
    onChangeEndTime(): void {
        this.isDisabledSaveButton = false;
        this.endTimeError = '';
    }

    @Watch('form.data.startTime')
    onChangeStartTime(): void {
        this.isDisabledSaveButton = false;
        this.endTimeError = '';
    }

    async save(): Promise<void> {
        this.isDisabledSaveButton = true;
        const isUpdate = !!this.selectedScheduleId;
        const body = this.makeBody(isUpdate);
        if (
            moment(body.initEndAt).isAfter(moment(body.repeatEndDate)) ||
            moment(body.initEndAt).isSame(moment(body.initStartAt))
        ) {
            this.endTimeError = this.$t('camera.cameraConfig.error.dateTime');
            this.isDisabledSaveButton = false;
            return;
        } else if (
            moment(body.initEndAt).isBefore(moment().utc().fmFullTimeString()) ||
            moment(body.initStartAt).isBefore(moment().utc().fmFullTimeString())
        ) {
            this.endTimeError = this.$t('camera.cameraConfig.error.past');
            this.isDisabledSaveButton = false;
            return;
        }
        const { valid } = await this.form.validate();
        if (!valid) {
            this.isDisabledSaveButton = false;
            return;
        }
        const loading = ElLoading.service({
            target: '.schedule-form-layout',
        });
        const response = isUpdate
            ? await cameraService.updateScheduleConfiguration(
                  this.selectedScheduleId,
                  body as IUpdateScheduleConfigurationBody,
              )
            : await cameraService.createScheduleConfiguration(
                  this.selectedCamera?._id,
                  body as ICreateScheduleConfigurationBody,
              );
        loading.close();
        if (response?.success) {
            const message = isUpdate
                ? this.$t('camera.cameraConfig.success.updateSchedule')
                : this.$t('camera.cameraConfig.success.createSchedule');
            this.showSuccessNotification(message);
            this.onCloseDialog();
        } else if (!response.isRequestError) {
            this.showErrorNotification(response.message);
        }
        this.endTimeError = '';
        this.isDisabledSaveButton = false;
    }
}
</script>

<style lang="scss" scoped>
.button-group {
    width: auto;
}
.weekday-checkbox {
    :deep(.el-checkbox) {
        margin-right: 30px;
    }
}
</style>
