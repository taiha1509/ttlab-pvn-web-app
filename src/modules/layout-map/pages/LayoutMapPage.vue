<template>
    <LayoutMainContent :breadcrumbs="breadcrumbs">
        <template #title-top-right>
            <LayoutMapButtonGroup
                v-if="layoutMapDetail._id"
                @update-layout-map="updateLayoutMap"
                @delete-layout-map="deleteLayoutMap"
            />
        </template>
        <template #sub-side-bar>
            <FilterForm>
                <template #unassigned-camera-list>
                    <CameraList />
                </template>
            </FilterForm>
        </template>
        <template #content>
            <LayoutMapDetail>
                <template #dropabble-map>
                    <LayoutMapDropZone />
                </template>
            </LayoutMapDetail>
        </template>
        <UploadLayoutMapPopup />
    </LayoutMainContent>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import LayoutMapDetail from '../components/layout-map-detail/LayoutMapDetail.vue';
import UploadLayoutMapPopup from '../components/popup-upload-layout-map/UploadLayoutMapPopup.vue';
import FilterForm from '../components/FilterForm.vue';
import { ElLoading } from 'element-plus';
import { layoutMapModule } from '../store/layoutMap.store';
import CameraList from '../components/camera-list/CameraList.vue';
import LayoutMapDropZone from '../components/layout-map-detail/LayoutMapDropZone.vue';
import LayoutMapButtonGroup from '../components/layout-map-detail/LayoutMapButtonGroup.vue';
import { UtilMixins } from '@/mixins/utilMixins';
import {
    ILayoutMapCamera,
    ILayoutMapDetail,
    ILayoutMapFile,
    IUpdateLayoutMapBody,
} from '../types';
import { IBreadcrumb } from '@/modules/common/types';

@Options({
    components: {
        LayoutMapDetail,
        LayoutMapButtonGroup,
        UploadLayoutMapPopup,
        FilterForm,
        CameraList,
        LayoutMapDropZone,
    },
})
export default class LayoutMapPage extends mixins(UtilMixins) {
    get breadcrumbs(): IBreadcrumb[] {
        return [
            {
                title: this.$t('common.app.sidebar.monitoring'),
            },
            {
                title: this.$t('layoutMap.layoutMap.title'),
                isActive: true,
            },
        ];
    }

    get layoutMapDetail(): ILayoutMapDetail {
        return layoutMapModule.layoutMapDetail || {};
    }

    get cameras(): ILayoutMapCamera[] {
        return layoutMapModule.layoutMapForm?.data?.cameras || [];
    }

    async created(): Promise<void> {
        const loading = ElLoading.service({
            target: '.page-content',
        });
        layoutMapModule.SET_SELECTED_CAMERA_GROUP_ID('');
        layoutMapModule.setLoadingEMap(true);
        await layoutMapModule.getCameraGroupList();
        await layoutMapModule.getCameraList();
        layoutMapModule.setLoadingEMap(false);
        loading.close();
    }

    async deleteLayoutMap(): Promise<void> {
        const i18Key = 'layoutMap.layoutMap';
        const confirm = await this.showConfirmPopUp(
            this.$t(`${i18Key}.confirm.deleteMessage`),
            this.$t(`${i18Key}.confirm.deleteTitle`),
        );
        if (!confirm) return;

        const loading = ElLoading.service({
            target: '.page-content',
        });
        const response = await layoutMapModule.deleteLayoutMap(
            this.layoutMapDetail._id as string,
        );
        loading.close();

        if (response.success) {
            this.showSuccessNotification(this.$t(`${i18Key}.success.delete`));
            await layoutMapModule.getCameraList();
            layoutMapModule.initLayoutMapFormData({});
        } else if (!response?.isRequestError) {
            this.showErrorNotification(
                response.message || this.$t(`${i18Key}.error.delete`),
            );
        }
    }

    async updateLayoutMap(): Promise<void> {
        const i18Key = 'layoutMap.layoutMap';
        const loading = ElLoading.service({
            target: '.page-content',
        });
        const body = this.makeUpdatedBody();
        const response = await layoutMapModule.updateLayoutMap({
            id: this.layoutMapDetail._id as string,
            body,
        });
        loading.close();

        if (response.success) {
            this.showSuccessNotification(this.$t(`${i18Key}.success.update`));
            layoutMapModule.SET_CAN_EDIT_LAYOUT_MAP(false);
        } else if (!response?.isRequestError) {
            this.showErrorNotification(
                response.message || this.$t(`${i18Key}.error.update`),
            );
        }
    }

    makeUpdatedBody(): IUpdateLayoutMapBody {
        const cameraCoordinates = (layoutMapModule.assignedCameras || []).map(
            (camera) => ({
                cameraId: camera._id,
                x: camera.x as number,
                y: camera.y as number,
            }),
        );
        const file = this.layoutMapDetail.file;
        return {
            cameraCoordinates,
            file: {
                originalName: file?.originalName,
                fileName: file?.fileName,
                extension: file?.extension,
                mimetype: file?.mimetype,
                size: file?.size || null,
            } as ILayoutMapFile,
        };
    }
}
</script>

<style lang="scss"></style>
