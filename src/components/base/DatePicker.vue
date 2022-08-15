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
            <el-date-picker
                v-model="dateValue"
                :type="type"
                :placeholder="placeholder"
                :format="dateFormat"
                :value-format="valueFormat"
                :disabled-date="disabledDate"
                :size="size"
                :disabled="isDisabled"
                :clearable="clearable"
                @change="changeValue"
            />
            <div class="invalid-feedback text-start d-block" v-show="error">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { DATE_TIME_FORMAT } from '@/modules/common/constants';
import { Vue, Model, Prop } from 'vue-property-decorator';

export default class DatePicker extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: 'default' }) readonly size!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: 'date' }) readonly type!: string;
    @Prop({ default: DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN }) readonly dateFormat!: string;
    @Prop({ default: DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN }) readonly valueFormat!: string;
    @Prop({ default: '' }) readonly minDate!: string | Date;
    @Prop({ default: '' }) readonly maxDate!: string | Date;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: true }) readonly clearable!: boolean;

    @Model('value', { type: String || Array })
    readonly dateValue!: string | Date | string[] | Date[];

    disabledDate(time: Date): boolean {
        const { minDate, maxDate } = this.$props as {
            minDate: Date | string;
            maxDate: Date | string;
        };
        let result = false;
        if (minDate && maxDate) {
            result =
                time.getTime() < new Date(minDate).getTime() ||
                time.getTime() > new Date(maxDate).getTime();
        } else if (minDate) {
            result = time.getTime() < new Date(minDate).getTime();
        } else if (maxDate) {
            result = time.getTime() > new Date(maxDate).getTime();
        }
        return result;
    }

    changeValue(time: Date): void {
        this.$emit('changeValue', time);
    }
}
</script>

<style scoped>
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
</style>
