<template>
    <BaseFilterForm
        @search="search"
        @create="createCamera"
        :isShowCreateButton="canCreate"
    >
        <template #filter-title>
            <h5 class="filter-title">
                {{ $t('common.app.filterForm.searchBy') }}
            </h5>
        </template>
        <slot>
            <div class="row">
                <div class="col-xl-4 col-md-6 col-12 mb-sm-2">
                    <BaseInputText
                        v-model:value="form.keyword"
                        :placeholder="$t('camera.cameraForm.filterForm.name.placeholder')"
                        @keypress.enter="search"
                    />
                </div>
                <div class="col-xl-4 col-md-6 col-12 mb-sm-2">
                    <BaseInputText
                        v-model:value="form.uid"
                        :placeholder="$t('camera.cameraForm.filterForm.uid.placeholder')"
                        @keypress.enter="search"
                    />
                </div>
                <div class="col-xl-4 col-md-6 col-12 mb-sm-2">
                    <BaseMultipleSelect
                        v-model:value="form.connection"
                        :placeholder="
                            $t('camera.cameraForm.fields.connection.placeholder')
                        "
                        :options="Options"
                        :teleported="true"
                        @onEnter="search"
                    />
                </div>
            </div>
        </slot>
    </BaseFilterForm>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { cameraListModule } from '../../store/camera.list.store';
import { ElLoading } from 'element-plus';
import i18n from '@/plugins/vue-i18n';
import { ConnectionStatus, POPUP_NAME } from '../../constants';
import { PermissionActions } from '@/modules/role/role.constant';

@Options({})
export default class FilterForm extends Vue {
    form = {
        keyword: null,
        uid: null,
        connection: null,
    };

    // TODO add connection type of camera
    Options = [
        {
            label: i18n.global.t('camera.cameraForm.connection.online'),
            value: ConnectionStatus.ONLINE,
        },
        {
            label: i18n.global.t('camera.cameraForm.connection.offline'),
            value: ConnectionStatus.OFFLINE,
        },
    ];

    async search(): Promise<void> {
        const loading = await ElLoading.service({
            target: '.page-content',
        });
        cameraListModule.setFilterForm({
            ...this.form,
        });
        cameraListModule.setLimit(cameraListModule.queryString?.limit);
        cameraListModule.setPage(cameraListModule.queryString?.page);
        await cameraListModule.getCameraList();
        loading.close();
    }

    createCamera(): void {
        cameraListModule.openCameraPopup(POPUP_NAME.CREATE_FORM_POPUP);
    }

    get canCreate(): boolean {
        return cameraListModule.userPermissions.includes(PermissionActions.CREATE);
    }
}
</script>

<style lang="scss" scoped>
.filter-title {
    font-weight: bold;
    margin-bottom: 8px;
}
::v-deep .form-group {
    margin-bottom: 0 !important;
}
::v-deep label {
    font-size: 13px;
}
</style>
