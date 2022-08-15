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
            <span v-if="isRequired" class="mark-required">*</span></label
        >
        <div
            class="vms-form-content"
            :class="{ 'w-100': !isHorizontal, 'w-75': isHorizontal }"
        >
            <el-input
                v-model="inputValue"
                :placeholder="placeholder"
                type="textarea"
                :autosize="{ minRows, maxRows }"
                :rows="rows"
                :maxlength="maxLength"
                :minlength="minLength"
                :show-word-limit="showWordLimit"
            />
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
import {
    TEXTAREA_MAX_LENGTH,
    TEXTAREA_MAX_ROW,
    TEXTAREA_MIN_LENGTH,
    TEXTAREA_MIN_ROW,
    TEXTAREA_DEFAULT_ROWS,
} from '@/modules/common/constants';
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class InputTextArea extends Vue {
    @Prop({ default: 'textarea' }) readonly type!: string;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: true }) readonly hasError!: boolean;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: TEXTAREA_DEFAULT_ROWS }) readonly rows!: number;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: TEXTAREA_MIN_ROW }) readonly minRows!: number;
    @Prop({ default: TEXTAREA_MAX_ROW }) readonly maxRows!: number;
    @Prop({ default: TEXTAREA_MAX_LENGTH }) readonly maxLength!: number;
    @Prop({ default: TEXTAREA_MIN_LENGTH }) readonly minLength!: number;
    @Prop({ default: false }) readonly showWordLimit!: boolean;

    @Model('value', { type: [String, Number] })
    readonly inputValue!: string;
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
</style>
