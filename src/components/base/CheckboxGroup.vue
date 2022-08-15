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
            <el-checkbox-group v-model="currentData">
                <el-checkbox
                    v-for="(option, index) in options"
                    :key="index"
                    :label="option[itemValue]"
                    :size="size"
                    :disabled="isDisabled"
                >
                    {{ option[itemLabel] }}
                </el-checkbox>
            </el-checkbox-group>
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class CheckboxGroup extends Vue {
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly size!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: () => [] }) readonly options!: Record<string, string | number>[];
    @Prop({ default: 'label' }) readonly itemLabel!: string;
    @Prop({ default: 'value' }) readonly itemValue!: string;
    @Prop({ default: false }) readonly isHorizontal!: boolean;

    @Model('value', { default: () => [] })
    readonly currentData!: string[] | number[];
}
</script>

<style lang="scss" scoped>
.vms-form-item {
    display: flex;
    margin-bottom: 15px;
}
.vms-form-label {
    font-size: 13px;
    color: #656d9a;
}
.el-select {
    width: 100% !important;
}
:deep .el-input {
    .el-icon-arrow-up:before {
        content: '\e78f';
    }
}
.mark-required {
    color: #de2b2b;
}
::v-deep .el-input__inner {
    height: 36px !important;
}
</style>
