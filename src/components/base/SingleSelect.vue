<template>
    <div class="vms-form-item" :class="{ 'flex-column': !isHorizontal }">
        <label
            v-if="label"
            class="vms-form-label"
            :class="{
                'w-100 mb-2': !isHorizontal,
                'w-25 pt-2 text-right': isHorizontal,
            }"
        >
            {{ label }}
            <span v-if="isRequired" class="mark-required">*</span>
        </label>
        <div
            class="vms-form-content"
            :class="{ 'w-100': !isHorizontal, 'w-75': isHorizontal }"
        >
            <el-select
                v-model="selectedValue"
                :placeholder="placeholder"
                :filterable="filterable"
                :teleported="teleported"
                popper-class="select-options"
                :size="size"
                :fit-input-width="true"
                @change="onChange"
                :disabled="isDisabled"
                @focus="onFocus"
                :clearable="clearable"
                ref="singleSelect"
            >
                <template v-for="option in options" :key="option.value">
                    <el-option
                        id="option"
                        :label="option.label"
                        :value="option.value"
                        :style="optionStyle"
                    />
                </template>
            </el-select>
            <div class="invalid-feedback text-start d-block" v-show="error">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ICommonOption, ISelectForm } from '@/modules/common/types';
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class SingleSelect extends Vue {
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly size!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: () => [] }) readonly options!: ICommonOption[];
    @Prop({ default: false }) readonly filterable!: boolean;
    @Prop({ default: true }) readonly clearable!: boolean;
    @Prop({ default: true }) readonly teleported!: boolean;
    @Prop({ default: false }) readonly isHorizontal!: boolean;

    @Model('value', { type: [String, Number] })
    readonly selectedValue!: string;

    optionStyle: Record<string, string> = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: 'auto',
    };

    get selectedRef(): unknown {
        return this.$refs.singleSelect;
    }

    onFocus(): void {
        const clientWidth = (this.selectedRef as ISelectForm)?.selectWrapper?.clientWidth;
        this.optionStyle = {
            ...this.optionStyle,
            maxWidth: `${clientWidth}px`,
        };
    }

    onChange(): void {
        this.$emit('change');
    }
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
::v-deep .single-option {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    text-align: left;
    left: 0px !important;
    top: 36px !important;
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
