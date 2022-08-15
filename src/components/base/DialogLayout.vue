<template>
    <el-dialog
        :width="width"
        append-to-body
        :top="top"
        :custom-class="customClass"
        v-model="isShowDialog"
        :before-close="beforeCloseDialog"
        @close="closeDialog"
        @open="openDialog"
    >
        <template #title>
            <h3 class="text-left">
                {{ title }}
            </h3>
            <slot name="sub-title" />
        </template>
        <slot name="content" />
        <template #footer>
            <span class="dialog-footer">
                <div class="row justify-content-center">
                    <slot name="footer" />
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Prop, Model } from 'vue-property-decorator';
export default class DialogLayout extends Vue {
    @Prop({ default: '' }) readonly title!: string;
    @Prop({ default: '50%' }) readonly width!: string;
    @Prop({ default: '10vh' }) readonly top!: string;
    @Prop({ default: '' }) readonly customClass!: string;

    @Model('value', { type: Boolean })
    readonly isShowDialog!: boolean;

    openDialog(): void {
        this.$emit('openDialog');
    }

    beforeCloseDialog(): void {
        this.$emit('before-close');
    }

    closeDialog(): void {
        this.$emit('close');
    }
}
</script>
<style lang="scss" scoped>
@media (max-width: 1199.98px) {
    :deep .el-dialog {
        width: 80%;
    }
}
.text-left {
    text-align: left;
}
</style>
