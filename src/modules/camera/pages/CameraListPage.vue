<template>
    <LayoutMainContent :breadcrumbs="breadcrumbs" :isShowSubSideBar="false">
        <template #filter-form>
            <FilterForm />
        </template>
        <template #content>
            <BasePagination
                v-model:onChangePage="currentPage"
                :isShowPagination="true"
                :totalItems="totalItems"
                :pageSize="pageSize"
                @changePageSize="handleChangeSizes"
                @handlePaginate="handlePaginate"
            />
            <CameraTable v-show="!loadingCameraTable" />
        </template>
        <DetailCameraPopup />
        <UpdateCameraPopup />
        <CreateCameraPopup />
        <RecordingConfigurationPopup />
        <ScheduleConfigurationPopup />
        <ScheduleFormPopup />
    </LayoutMainContent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FilterForm from '../components/camera-list/FilterForm.vue';
import { cameraListModule } from '../store/camera.list.store';
import CameraTable from '../components/camera-list/CameraTable.vue';
import DetailCameraPopup from '../components/popup-detail-camera/DetailCameraPopup.vue';
import UpdateCameraPopup from '../components/popup-create-update-camera/UpdateCameraPopup.vue';
import CreateCameraPopup from '../components/popup-create-update-camera/CreateCameraPopup.vue';
import RecordingConfigurationPopup from '../components/popup-recording-configuration/RecordingConfigurationPopup.vue';
import ScheduleConfigurationPopup from '../components/popup-scheduling-configuration/ScheduleConfigurationPopup.vue';
import ScheduleFormPopup from '../components/popup-scheduling-configuration/ScheduleFormPopup.vue';
import { DEFAULT_FIRST_PAGE } from '@/modules/common/constants';
import { ElLoading } from 'element-plus';
import { IBreadcrumb } from '@/modules/common/types';

@Options({
    components: {
        FilterForm,
        CameraTable,
        DetailCameraPopup,
        UpdateCameraPopup,
        CreateCameraPopup,
        RecordingConfigurationPopup,
        ScheduleConfigurationPopup,
        ScheduleFormPopup,
    },
})
export default class CameraListPage extends Vue {
    currentPage = DEFAULT_FIRST_PAGE;

    get breadcrumbs(): IBreadcrumb[] {
        return [
            {
                title: this.$t('common.app.sidebar.camera'),
            },
            {
                title: this.$t('common.app.sidebar.cameraManagement'),
                isActive: true,
            },
        ];
    }

    async created(): Promise<void> {
        cameraListModule.clearFilterForm();
        await this.initData();
    }

    beforeUnmount(): void {
        cameraListModule.clearFilterForm();
    }

    get loadingCameraTable(): boolean {
        return cameraListModule.loadingCameraTable;
    }

    async initData(): Promise<void> {
        const loading = ElLoading.service({
            target: '.page-content',
        });
        cameraListModule.setLoadingCameraTable(true);
        await Promise.all([
            cameraListModule.getCameraList(),
            cameraListModule.getCameraModels(),
        ]);
        cameraListModule.setLoadingCameraTable(false);
        loading.close();
    }

    get pageSize(): number {
        return cameraListModule.itemsPerPage;
    }

    get totalItems(): number {
        return cameraListModule.totalCameras;
    }

    async handlePaginate(page: number): Promise<void> {
        cameraListModule.setPage(page);
        const loading = await ElLoading.service({
            target: '.page-content',
        });
        await cameraListModule.getCameraList();
        loading.close();
    }

    async handleChangeSizes(size: number): Promise<void> {
        cameraListModule.setLimit(size);
        const loading = await ElLoading.service({
            target: '.page-content',
        });
        cameraListModule.setItemsPerPage(size);
        await cameraListModule.getCameraList();
        loading.close();
    }
}
</script>
