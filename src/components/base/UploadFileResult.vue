<template>
    <el-card class="file-item">
        <div class="d-flex file-item-content">
            <div class="file-item-name">{{ file.originalName }}</div>
            <div class="file-item-size">({{ size }})</div>
            <img
                v-if="canDownloadFile"
                class="icon-download"
                :src="require('@/assets/images/icons/download.svg')"
                @click="downloadFileItem"
            />
        </div>
    </el-card>
    <div class="d-flex mt-1">
        <div
            class="invalid-feedback text-start file-error"
            :class="{ 'd-block': errorMessage }"
        >
            {{ errorMessage }}
        </div>
        <img
            class="icon-delete"
            :src="require('@/assets/images/icons/trash.svg')"
            @click="deleteFile"
        />
    </div>
</template>

<script lang="ts">
import { mixins, Options, Prop } from 'vue-property-decorator';
import { AcceptFileTypes } from '@/modules/common/constants';
import { downloadFile, getFileSize } from '@/modules/common/helpers';
import { IFormatFile } from '@/modules/common/service/uploadFile.service';
import { UtilMixins } from '@/mixins/utilMixins';

@Options({})
export default class UploadFileResult extends mixins(UtilMixins) {
    @Prop({ default: true }) isShowDeleteButton!: boolean;
    @Prop({ default: AcceptFileTypes.ALL }) acceptFileTypes!: string;
    @Prop({ required: true }) file!: IFormatFile;
    @Prop({ default: 0 }) index!: number;

    get size(): string {
        return this.file.size ? getFileSize(this.file.size) : '';
    }

    get canDownloadFile(): boolean {
        return !!this.file.url;
    }

    get errorMessage(): string {
        if (!this.file.isValidSize) return this.$t('common.form.fileError.fileType');
        if (!this.file.checkingFileType?.isValid)
            return this.file.checkingFileType?.errorMessage || '';
        if (!this.file.success) return this.$t('common.form.fileError.upload');
        return '';
    }

    get disabled(): boolean {
        return !this.file.isValidSize || !this.file.success;
    }

    async deleteFile(): Promise<void> {
        const message = this.$t('common.form.confirmDeleteFile');
        const title = this.$t('common.form.confirmDeleteFileTitle');

        const confirm = await this.showConfirmPopUp(message, title);
        if (confirm) {
            this.$emit('deleteFile', this.index);
        }
    }

    async downloadFileItem(): Promise<void> {
        const result = await downloadFile(this.file.url, this.file.originalName);
        if (!result) {
            this.showAlertMessage(this.$t('common.form.fileError.download'));
        }
    }
}
</script>

<style lang="scss" scoped>
.file-item {
    :deep(.el-card__body) {
        padding: 8px 14px !important;
    }
}
.file-item-size {
    font-style: italic;
    margin-left: 2px;
}
.file-error {
    margin-top: 0;
}

.icon-download,
.icon-delete {
    width: 18px;
    height: auto;
    margin-left: auto;
    &:hover {
        cursor: pointer;
    }
}
.icon-delete {
    margin-right: 14px;
}
</style>
