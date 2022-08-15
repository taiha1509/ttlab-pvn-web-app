<template>
    <div class="vms-form-item" :class="{ 'flex-column': !isHorizontal }">
        <label
            v-if="label"
            class="vms-form-label"
            :class="{
                'w-100 mb-2': !isHorizontal,
                'w-25 pt-2': isHorizontal,
            }"
        >
            {{ label }}
            <span v-if="isRequired" class="mark-required">*</span>
        </label>
        <div
            class="vms-form-content"
            :class="{ 'w-100': !isHorizontal, 'w-75': isHorizontal }"
        >
            <el-time-select
                v-model="startTime"
                class="start-picker"
                :placeholder="startPlaceholder"
                :start="timeStart"
                :end="timeEnd"
                :step="timeStep"
                :size="size"
                :disabled="isDisabled"
                :min-time="minStartTime"
                :max-time="maxStartTime"
            >
            </el-time-select>
            <span class="divider">-</span>
            <el-time-select
                v-model="endTime"
                class="end-picker"
                :placeholder="endPlaceholder"
                :start="timeStart"
                :end="timeEnd"
                :step="timeStep"
                :size="size"
                :disabled="isDisabled"
                :min-time="minEndTime"
                :max-time="maxEndTime"
            >
            </el-time-select>
        </div>
        <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Model } from 'vue-property-decorator';

export default class TimeRangePicker extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: 'default' }) readonly size!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: '00:00' }) readonly timeStart!: string;
    @Prop({ default: '23:59' }) readonly timeEnd!: string;
    @Prop({ default: '00:15' }) readonly timeStep!: string;
    @Prop({ default: null }) readonly minStartTime!: string;
    @Prop({ default: null }) readonly maxStartTime!: string;
    @Prop({ default: null }) readonly minEndTime!: string;
    @Prop({ default: null }) readonly maxEndTime!: string;
    @Prop({ default: '' }) readonly startPlaceholder!: string;
    @Prop({ default: '' }) readonly endPlaceholder!: string;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;

    @Model('value', { required: true }) readonly timeRange!: {
        start: Date | string;
        end: Date | string;
    };

    get startTime(): Date | string {
        return this.timeRange?.start;
    }

    set startTime(start: Date | string) {
        this.$emit('update:value', {
            start,
            end: this.endTime,
        });
    }

    get endTime(): Date | string {
        return this.timeRange?.end;
    }

    set endTime(end: Date | string) {
        this.$emit('update:value', {
            start: this.startTime,
            end,
        });
    }
}
</script>

<style scoped lang="scss">
.vms-form-item {
    display: flex;
    margin-bottom: 15px;
}
.vms-form-label {
    font-size: 13px;
    color: #656d9a;
}
:deep .el-input {
    width: 100% !important;
}
.mark-required {
    color: #de2b2b;
}

.vms-form-content {
    display: flex;
    justify-content: space-between;
    .divider {
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        font-weight: bold;
        margin: 0 0.25rem;
    }
}
</style>
