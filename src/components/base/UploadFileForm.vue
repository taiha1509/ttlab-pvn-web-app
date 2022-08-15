<template>
    <div class="vms-form-item" :class="{ 'flex-column': !isHorizontal }">
        <label
            v-if="label"
            class="vms-form-label"
            :class="{
                'w-100 mb-2': !isHorizontal,
                'w-25 pt-2': isHorizontal,
            }"
        >
            {{ label }}
            <span v-if="isRequired" class="mark-required">*</span>
        </label>
        <div
            class="vms-form-content"
            :class="{ 'w-100': !isHorizontal, 'w-75': isHorizontal, disabled }"
        >
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
                </div>
            </div>
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
    <BaseUploadFileResult
        v-for="(file, index) in fileList"
        :key="`file${index}`"
        :file="file"
        :index="index"
        :maxSizeFile="maxSizeFile"
        :isShowDeleteButton="isShowDeleteButton"
        @deleteFile="deleteFile"
        @acceptFileTypes="acceptFileTypes"
    />
</template>

<script lang="ts">
import { Options, Prop, Vue, Model, mixins } from 'vue-property-decorator';
import { AcceptFileTypes, FilePath, MAX_SIZE_FILE } from '@/modules/common/constants';
import {
    IFormatFile,
    IUploadFileToS3Response,
    uploadFile,
} from '@/modules/common/service/uploadFile.service';
import get from 'lodash/get';
import { ElLoading } from 'element-plus';
import last from 'lodash/last';
import { UtilMixins } from '@/mixins/utilMixins';

type VFile = Vue & { files: File[] };

@Options({})
export default class UploadFileForm extends mixins(UtilMixins) {
    @Prop({ required: true }) path!: FilePath;
    @Prop({ default: true }) isShowDeleteButton!: boolean;
    @Prop({ default: true }) private isShowUploadIcon!: boolean;
    @Prop({ default: '' }) private label!: string;
    @Prop({ default: false }) private isShowFileSize!: boolean;
    @Prop({ default: () => [] }) value!: IFormatFile[];
    @Prop({ default: MAX_SIZE_FILE }) maxSizeFile!: number;
    @Prop({ default: 1 }) maxFileCnt!: number;
    @Prop({ default: AcceptFileTypes.ALL }) acceptFileTypes!: string;
    @Prop({ default: true }) showUploadFile!: boolean;
    @Prop({ default: false }) private isDisabled!: boolean;
    @Prop({ default: '' }) private error!: string;

    @Model('value', { default: () => [] }) fileList!: IFormatFile[];

    get disabled(): boolean {
        return this.isDisabled || this.fileList.length >= this.maxFileCnt;
    }

    async handleFileUpload(): Promise<void> {
        const file = this.$refs.file as VFile;
        const { files } = file;

        const valid = await this.validateCountFile(files);
        if (!valid) return;

        const newFileList = this.parseFiles(files);

        const loading = ElLoading.service({
            target: '.page-content',
        });
        const uploadResponse = await this.uploadFiles(newFileList);
        loading.close();

        newFileList.forEach((fileItem, index) => {
            fileItem = {
                ...fileItem,
                ...uploadResponse[index],
            };
        });

        this.fileList = [...this.fileList, ...newFileList] as IFormatFile[];
        // reset file input to allow upload same files
        Object.assign(this.$refs.file, {
            value: null,
        });
    }

    parseFiles(files: File[]): IFormatFile[] {
        return Object.keys(files)
            .reverse()
            .map((key) => {
                const item = get(files, `${key}`);
                const { isValid: isValidType, errorMessage } = this.validateFileType(
                    item.name,
                    item.type,
                );
                const originalName = (item.name || '') as string;
                const isValidSize = item.size < this.maxSizeFile;
                const isTypeNSizeValid = isValidSize && isValidType;
                const formatedFile: IFormatFile = {
                    originalName,
                    extension: last(originalName.split('.')) || '',
                    size: item.size as number,
                    mimetype: item.type as string,
                    file: item,
                    isValidSize,
                    checkingFileType: {
                        isValid: isValidType,
                        errorMessage,
                    },
                    isTypeNSizeValid,
                };
                return formatedFile;
            });
    }

    // Upload all file correct type and file size valid
    async uploadFiles(fileList: IFormatFile[]): Promise<IUploadFileToS3Response[]> {
        return await Promise.all(
            fileList.reduce((res: Promise<IUploadFileToS3Response>[], fileItem) => {
                if (fileItem.isTypeNSizeValid) {
                    res.push(uploadFile(this.path, fileItem));
                }
                return res;
            }, []),
        );
    }

    validateFileType(
        name: string,
        type: string,
    ): { isValid: boolean; errorMessage: string } {
        const i18Key = 'common.form.fileError';

        const extArray = name.split('.');
        const extension = extArray[extArray.length - 1] || '';
        const isValidType = this.acceptFileTypes
            .split(',')
            .includes(`.${extension.toLowerCase()}`);

        switch (this.acceptFileTypes) {
            case AcceptFileTypes.IMAGE: {
                return {
                    isValid: !!type.startsWith('image'),
                    errorMessage: this.$t(`${i18Key}.imageType`),
                };
            }
            case AcceptFileTypes.LAYOUT_MAP:
                return {
                    isValid: isValidType,
                    errorMessage: this.$t(`${i18Key}.layoutMapType`),
                };
            default:
                return {
                    isValid: true,
                    errorMessage: '',
                };
        }
    }

    validateCountFile(files: File[]): boolean {
        if (files.length > this.maxFileCnt - this.fileList.length) {
            return false;
        }
        return true;
    }

    deleteFile(index: number): void {
        this.fileList.splice(index, 1);
        Object.assign(this.$refs.file, {
            value: null,
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
</style>
