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
            <el-input-number
                v-model="inputData"
                :placeholder="placeholder"
                :readonly="isReadonly"
                :disabled="isDisabled"
                :error="true"
                :controls="false"
                :min="min"
                :max="max"
                :size="size"
                @change="onChange"
            />
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class InputNumber extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: 'default' }) readonly size!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: NaN }) readonly min!: number;
    @Prop({ default: NaN }) readonly max!: number;
    @Prop({ default: false }) readonly isHorizontal!: boolean;

    @Model('number', { type: Number })
    readonly inputData!: number;

    isFocus = false;

    onChange(): void {
        this.isFocus = false;
        this.$emit('change');
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
.mark-required {
    color: #de2b2b;
}
</style>
