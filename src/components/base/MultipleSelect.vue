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
                :placeholder="selectedValue?.length > 0 ? '' : placeholder"
                :filterable="filterable"
                multiple
                :fit-input-width="true"
                :collapse-tags="collapseTags"
                :disabled="isDisabled"
                :teleported="teleported"
                popper-class="select-options"
                @keyup="onKeyUp"
                @change="change"
                @focus="onFocus"
                ref="multipleSelect"
            >
                <template v-for="option in options" :key="option.value">
                    <el-option
                        :label="option.label"
                        :value="option.value"
                        :id="`option_${option.value}`"
                        :style="optionStyle"
                    />
                </template>
            </el-select>
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ISelectForm } from '@/modules/common/types';
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class MultipleSelect extends Vue {
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: true }) readonly collapseTags!: boolean;
    @Prop({ default: false }) readonly filterable!: boolean;
    @Prop({ default: () => [] }) readonly options!: Record<string, unknown>[];
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: true }) readonly teleported!: boolean;

    @Model('value', { type: Array as () => string[] | number[] })
    readonly selectedValue!: string[] | number[];

    optionStyle: Record<string, string> = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: 'auto',
    };

    get selectedRef(): unknown {
        return this.$refs.multipleSelect;
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.keyCode === 13) {
            this.$emit('onEnter');
            (this.$refs.multipleSelect as ISelectForm).blur();
        }
    }

    onFocus(): void {
        const clientWidth = (this.selectedRef as ISelectForm)?.selectWrapper?.clientWidth;
        this.optionStyle = {
            ...this.optionStyle,
            maxWidth: `${clientWidth}px`,
        };
    }

    change(): void {
        this.$nextTick(() => {
            this.$emit('change');
        });
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
:deep .el-select {
    width: 100% !important;
}
:deep(.el-input) {
    .el-icon-arrow-up:before {
        content: '\e78f';
    }
}
:deep .popper__arrow {
    display: none !important;
}
.mark-required {
    color: #de2b2b;
}
::v-deep .el-input__inner {
    height: 36px !important;
}
::v-deep .el-select-dropdown__list {
    padding: 0px !important;
}
:deep(.el-select__input) {
    cursor: pointer !important;
}
:deep(.el-select__tags) {
    max-width: unset !important;
}
</style>
