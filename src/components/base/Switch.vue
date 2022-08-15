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
            class="vms-form-content"
            :class="{ 'w-100': !isHorizontal, 'w-75': isHorizontal }"
        >
            <el-switch v-model="isActive" :disabled="isDisabled" @change="onChange" />
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class Switch extends Vue {
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isHorizontal!: boolean;

    @Model('value', { type: Boolean })
    readonly isActive!: boolean;

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
    padding-top: 6px;
}
.el-select {
    width: 100% !important;
}
::v-deep .select-options {
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
