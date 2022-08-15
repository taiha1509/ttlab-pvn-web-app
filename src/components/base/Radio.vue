<template>
    <div class="vms-form-item" :class="{ 'flex-column': !isHorizontal }">
        <label
            v-if="label"
            class="vms-form-label"
            :class="{
                'w-100 mb-2': !isHorizontal,
                'w-25 text-right': isHorizontal,
            }"
        >
            {{ label }}
            <span v-if="isRequired" class="mark-required">*</span>
        </label>
        <div
            class="vms-form-content d-flex"
            :class="{ 'w-100': !isHorizontal, 'w-75': isHorizontal }"
        >
            <div v-for="option in options" :key="option">
                <el-radio
                    class="w-25 radio-button"
                    v-model="radio"
                    :label="option.value"
                    size="large"
                    >{{ option.label }}</el-radio
                >
            </div>
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ISelectOptions } from '@/modules/common/types';
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class Switch extends Vue {
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: [] }) readonly options!: ISelectOptions[];

    @Model('value', { type: Boolean })
    readonly radio!: boolean;

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
.mark-required {
    color: #de2b2b;
}
.radio-button {
    margin-right: 15px;
}
</style>
