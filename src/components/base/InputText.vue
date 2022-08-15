<template>
    <div class="vms-form-item" :class="{ 'flex-column': !isHorizontal }">
        <label
            v-if="label"
            class="vms-form-label"
            :class="{
                'w-100 mb-2': !isHorizontal,
                'w-25 pt-2': isHorizontal,
                'text-right': isLabelRight,
                'text-left': !isLabelRight,
            }"
        >
            {{ label }}
            <span v-if="isRequired" class="mark-required">*</span>
        </label>
        <div
            class="vms-form-content"
            :class="{ 'w-100': !isHorizontal, 'w-75': isHorizontal }"
        >
            <el-input
                v-model="inputData"
                :placeholder="placeholder"
                :type="type"
                :readonly="isReadonly"
                :disabled="isDisabled"
                :error="true"
                :size="size"
                :show-password="showPassword"
                :maxlength="maxLength"
                :minlength="minLength"
                @keyup.enter="$emit('onEnter')"
                @input="$emit('input')"
            >
                <template #suffix>
                    <slot name="suffix" />
                </template>
            </el-input>
            <div
                class="invalid-feedback text-start d-block"
                v-show="error"
                v-if="hasError"
            >
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { TEXTAREA_MIN_LENGTH, TEXT_MAX_LENGTH } from '@/modules/common/constants';
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class InputText extends Vue {
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: 'default' }) readonly size!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: true }) readonly hasError!: boolean;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: true }) readonly isLabelRight!: string;
    @Prop({ default: false }) readonly showPassword!: string;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: null }) readonly cleaveOptions!: Record<string, unknown>;
    @Prop({ default: TEXT_MAX_LENGTH }) readonly maxLength!: number;
    @Prop({ default: TEXTAREA_MIN_LENGTH }) readonly minLength!: number;

    @Model('value', { type: [String, Number] })
    readonly inputData!: string;
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
.mark-required {
    color: #de2b2b;
}

:deep .el-input.is-disabled .el-input__inner {
    color: #646464;
}
:deep .el-input.is-disabled .el-input__inner::placeholder {
    color: #646464;
}

.invalid-feedback {
    height: auto;
    min-height: 19px;
}
</style>
