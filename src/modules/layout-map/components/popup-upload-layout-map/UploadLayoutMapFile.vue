<template>
    <div class="vms-form-item">
        <label class="vms-form-label mb-2">
            {{ $t('layoutMap.layoutMap.form.path') }}
            <span v-if="isRequired" class="mark-required">*</span>
        </label>
        <div class="vms-form-content">
            <input
                :disabled="disabled"
                type="file"
                name="file"
                ref="file"
                @change="handleFileUpload"
                multiple
                class="upload-input"
                :accept="acceptFileTypes"
                title=""
            />
            <div class="text-center">
                <img
                    class="upload-icon"
                    :src="require('@/assets/images/icons/upload-filled.svg')"
                    alt="upload filled icon"
                />
                <div class="upload-text">
                    {{ $t('common.form.uploadFile.text1') }}
                    <em>{{ $t('common.form.uploadFile.text2') }}</em>
                    <br />
                    <p class="font-italic">
                        <em style="color: gray; font-size: 12px"
                            >* {{ $t('common.form.uploadFile.text3') }} *</em
                        >
                    </p>
                </div>
            </div>
        </div>
        <div
            class="invalid-feedback text-start"
            :class="{ 'd-block': fileError || error }"
        >
            {{ fileError || error }}
        </div>
        <img v-if="file?.originalName" id="preview-map" class="preview-img" fit="fill" />
    </div>
</template>

<script lang="ts">
import { Options, Prop, mixins } from 'vue-property-decorator';
import { UtilMixins } from '@/mixins/utilMixins';
import { AcceptFileTypes, MAX_SIZE_FILE } from '@/modules/common/constants';
import get from 'lodash/get';
import { getFileSize } from '@/modules/common/helpers';
import { IFormatFile } from '@/modules/common/service/uploadFile.service';
import last from 'lodash/last';

type FileForm = { value: File | null };

@Options({})
export default class UploadLayoutMapFile extends mixins(UtilMixins) {
    @Prop({ default: '' }) private error!: string;
    @Prop({ default: () => ({}) }) private file!: IFormatFile;
    @Prop({ default: false }) private isRequired!: boolean;

    acceptFileTypes = AcceptFileTypes.LAYOUT_MAP;
    fileError = '';

    async handleFileUpload(event: Event): Promise<void> {
        const file = get(event.target, 'files[0]', '') as File;
        const reader = new FileReader() as FileReader;
        reader.onload = () => {
            const dataURL = reader.result;
            const output = document.getElementById('preview-map') as HTMLEmbedElement;
            output.src = dataURL as string;
        };
        reader.readAsDataURL(file);
        if (this.validateFile(file)) {
            this.$emit('upload:file', file);
        } else {
            this.$emit('upload:file', {});
        }
        (this.$refs.file as FileForm).value = null;
    }

    get fileName(): string {
        return (this.file?.originalName || '') as string;
    }

    get size(): string {
        return this.file?.size ? getFileSize(this.file?.size as number) : '';
    }

    validateFile(file: File): boolean {
        const isValidType = this.validateFileType(file.type);
        if (!isValidType) return isValidType;
        const isValidSize = this.validateFileSize(file.size);
        return isValidSize;
    }

    validateFileType(type = ''): boolean {
        const fileType = last(type.split('/'));
        const acceptFileTypes = this.acceptFileTypes.split(',');
        const isValid = acceptFileTypes.includes(`.${fileType}`);
        this.fileError = isValid ? '' : this.$t('common.form.fileError.layoutMapType');
        return isValid;
    }

    validateFileSize(size: number): boolean {
        const isValid = size < MAX_SIZE_FILE;
        this.fileError = isValid ? '' : this.$t('common.form.fileError.fileType');
        return isValid;
    }
}
</script>

<style lang="scss" scoped>
.vms-form-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}
.vms-form-label {
    font-size: 13px;
    color: #656d9a;
}
.mark-required {
    color: #de2b2b;
}
.vms-form-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 180px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;

    &:hover {
        background-size: 30px 30px;
        background-image: linear-gradient(
            -45deg,
            #f1f5fa 25%,
            transparent 25%,
            transparent 50%,
            #f1f5fa 50%,
            #f1f5fa 75%,
            transparent 75%,
            transparent
        );
    }

    &.disabled {
        background-color: var(--el-disabled-bg-color);
        border-color: var(--el-disabled-border-color);
        color: var(--el-disabled-text-color);
        cursor: not-allowed;
        .upload-text em {
            color: var(--el-disabled-text-color);
        }
    }
}
.upload-input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    cursor: pointer;
    opacity: 0;
    z-index: 1;
}
.upload-icon {
    width: 4rem;
    opacity: 0.4;
}
.upload-text em {
    color: var(--el-color-primary-light-1);
}
.preview-img {
    height: 178px;
    margin-top: 15px;
}
</style>
