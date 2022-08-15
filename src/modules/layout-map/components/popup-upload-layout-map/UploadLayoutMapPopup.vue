<template>
    <BaseDialogLayout
        v-model:value="isShowDialog"
        width="500px"
        customClass="upload-layoutmap-dialog"
        @before-close="onCloseDialog"
        @open="openPopup"
        :title="
            layoutMapDetail?._id
                ? $t('layoutMap.layoutMap.form.uploadTitle')
                : $t('layoutMap.layoutMap.form.title')
        "
    >
        <template #content>
            <BaseInputText
                v-model:value="form.data.name"
                :error="translateYupError(form.error.name)"
                :isLabelRight="false"
                :isRequired="true"
                :label="$t('layoutMap.layoutMap.form.name')"
                :placeholder="$t('layoutMap.layoutMap.form.namePlaceholder')"
            />
            <UploadLayoutMapFile
                :file="file"
                :error="translateYupError(form.error.fileName)"
                :isRequired="true"
                :label="$t('layoutMap.layoutMap.form.path')"
                :placeholder="$t('layoutMap.layoutMap.form.pathPlaceholder')"
                @upload:file="onUploadFile"
            />
        </template>
        <template #footer>
            <div class="d-flex justify-content-center">
                <el-button type="primary" @click="create">
                    {{ $t('layoutMap.layoutMap.button.save') }}
                </el-button>
                <el-button @click="onCloseDialog">
                    {{ $t('layoutMap.layoutMap.button.cancel') }}
                </el-button>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { mixins, Options, setup } from 'vue-class-component';
import { layoutMapModule } from '../../store/layoutMap.store';
import { initLayoutMapUploadForm } from '../../composition/uploadLayoutMap';
import { ElLoading } from 'element-plus';
import { FilePath } from '@/modules/common/constants';
import UploadLayoutMapFile from './UploadLayoutMapFile.vue';
import { Watch } from 'vue-property-decorator';
import { UtilMixins } from '@/mixins/utilMixins';
import last from 'lodash/last';
import { fileService } from '@/modules/common/service/uploadFile.service';
import {
    ICameraCoordinate,
    ICreateLayoutMapBody,
    ILayoutMapDetail,
    ILayoutMapFile,
    IUpdateLayoutMapBody,
} from '../../types';

@Options({
    components: { UploadLayoutMapFile },
})
export default class UploadLayoutMapPopup extends mixins(UtilMixins) {
    form = setup(() => initLayoutMapUploadForm());
    fileEbob?: File;
    file = {
        size: 0,
        originalName: '',
        extension: '',
        mimetype: '',
    };

    get isShowDialog(): boolean {
        return layoutMapModule.isShowUploadLayoutMapPopup;
    }

    async onCloseDialog(): Promise<void> {
        layoutMapModule.SHOW_UPLOAD_LAYOUT_MAP_POPUP(false);
        this.form.resetForm({
            values: {
                name: '',
                fileName: '',
            },
        });
        this.file = {
            size: 0,
            originalName: '',
            extension: '',
            mimetype: '',
        };
        this.fileEbob = undefined;
    }

    async create(): Promise<void> {
        const { valid } = await this.form.validate();
        if (!valid) return;
        const loading = ElLoading.service({
            target: '.upload-layoutmap-dialog',
        });
        const fileName = this.fileEbob
            ? await this.uploadLayoutMapFileToS3()
            : this.layoutMapDetail?.file?.fileName;
        if (!fileName) {
            loading.close();
            this.showErrorNotification(
                this.$t('layoutMap.layoutMap.error.uploadLayoutMapFile'),
            );
            return;
        }
        const isCreate = !!this.layoutMapDetail?._id;
        const body = this.layoutMapDetail?._id
            ? this.makeUpdateBody(fileName)
            : this.makeCreateBody(fileName);
        const response = this.layoutMapDetail?._id
            ? await layoutMapModule.updateLayoutMap({
                  id: this.layoutMapDetail?._id,
                  body: body as IUpdateLayoutMapBody,
              })
            : await layoutMapModule.createLayoutMap(body as ICreateLayoutMapBody);
        loading.close();
        if (response.success) {
            this.showSuccessNotification(
                isCreate
                    ? this.$t('layoutMap.layoutMap.success.update')
                    : this.$t('layoutMap.layoutMap.success.create'),
            );
            this.onCloseDialog();
        } else if (!response?.isRequestError) {
            this.showErrorNotification(response.message);
        }
    }

    async uploadLayoutMapFileToS3(): Promise<string | null> {
        if (!this.fileEbob) return null;
        const getS3PreSignedUrlResponse = await fileService.getPreSignedUrl(
            FilePath.CVM,
            this.file.originalName,
        );

        if (!getS3PreSignedUrlResponse.success) return null;
        const { fileName, presignedUrl } = getS3PreSignedUrlResponse.data;

        const uploadToS3Response = await fileService.uploadFileToS3(
            this.fileEbob,
            presignedUrl,
        );
        if (!uploadToS3Response.success) return null;
        return fileName;
    }

    get layoutMapDetail(): ILayoutMapDetail {
        return layoutMapModule.layoutMapDetail;
    }

    openPopup(): void {
        if (this.layoutMapDetail?._id)
            this.form.resetForm({
                values: {
                    name: this.layoutMapDetail?.name,
                    fileName: this.layoutMapDetail?.file?.fileName,
                },
            });
    }

    onUploadFile(file: File): void {
        this.fileEbob = file || null;
        const originalName = (file?.name || '') as string;
        this.file = {
            originalName,
            extension: last(originalName.split('.')) || '',
            mimetype: file?.name,
            size: file?.size,
        };
    }

    makeCreateBody(fileName: string): ICreateLayoutMapBody {
        return {
            cameraGroupId: layoutMapModule.selectedCameraGroupId,
            name: (this.form.data.name || '') as string,
            file: {
                originalName: this.file.originalName,
                fileName,
                extension: this.file.extension,
                mimetype: this.file.mimetype,
                size: this.file.size || null,
            },
        };
    }

    makeUpdateBody(fileName: string): IUpdateLayoutMapBody {
        if (this.layoutMapDetail?.cameraCoordinates)
            this.layoutMapDetail.cameraCoordinates.map((cameraCoordinate) => {
                delete cameraCoordinate.camera;
            });
        const file = this.layoutMapDetail?.file;
        return {
            name: (this.form.data.name || '') as string,
            cameraCoordinates: this.layoutMapDetail
                ?.cameraCoordinates as ICameraCoordinate[],
            file: this.fileEbob
                ? {
                      originalName: this.file.originalName,
                      fileName,
                      extension: this.file.extension,
                      mimetype: this.file.mimetype,
                      size: this.file.size || null,
                  }
                : ({
                      originalName: file?.originalName,
                      fileName,
                      extension: file?.extension,
                      mimetype: file?.mimetype,
                      size: file?.size || null,
                  } as ILayoutMapFile),
        };
    }

    @Watch('file.originalName')
    onFileNameChange(name: string): void {
        this.form.data.fileName = name;
    }
}
</script>

<style></style>
