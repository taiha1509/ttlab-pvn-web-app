<template>
    <BaseDialogLayout
        v-model:value="isShow"
        width="40%"
        customClass="user-group-layout"
        @open="openPopup"
        @before-close="closePopup"
        :title="
            isCreate
                ? $t('userGroup.group.popup.create.title')
                : $t('userGroup.group.popup.update.title')
        "
    >
        <template #content>
            <div class="row main-info">
                <div class="col-12">
                    <BaseInputText
                        v-model:value="form.name"
                        :isRequired="true"
                        :isHorizontal="true"
                        :label="$t('userGroup.group.popup.label')"
                        :placeholder="$t('userGroup.group.popup.placeholder')"
                        :error="translateYupError(form.errors.name)"
                    />
                </div>
            </div>
        </template>

        <template #footer>
            <div
                class="col-md-4 col-sm-6 d-flex justify-content-md-center justify-content-center"
            >
                <el-button type="primary" @click="form.onSubmit">
                    {{ $t('common.app.buttons.confirm') }}
                </el-button>
                <el-button @click="closePopup">
                    {{ $t('common.app.buttons.cancel') }}
                </el-button>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { HttpStatus } from '@/modules/common/constants';
import { ElLoading } from 'element-plus';
import { mixins, setup } from 'vue-class-component';
import { initGroupUserForm } from '../compositions/group';
import { groupUserModule } from '../store';
import { IGroupUser } from '../types';

export default class GroupUserPopup extends mixins(UtilMixins) {
    get isCreate(): boolean {
        return groupUserModule.popupParams.isCreate;
    }

    get isShow(): boolean {
        return groupUserModule.popupParams.isShow;
    }

    set isShow(value: boolean) {
        groupUserModule.setPopupParams({ ...groupUserModule.popupParams, isShow: value });
    }

    get group(): IGroupUser {
        return groupUserModule.group;
    }

    closePopup(): void {
        this.form.closePopup();
    }

    async openPopup(): Promise<void> {
        if (groupUserModule.popupParams.isCreate) {
            this.form.resetForm({ values: { name: '', parentId: null } });
        } else {
            const loading = ElLoading.service({ target: '.user-group-layout' });
            const response = await groupUserModule.getGroup(this.group.id);
            if (!response.success && !response?.isRequestError) {
                this.showErrorNotification(response.message);
                if (response?.code === HttpStatus.ITEM_NOT_EXISTED) {
                    await groupUserModule.getGroups();
                    groupUserModule.setPopupParams({
                        ...groupUserModule.popupParams,
                        isShow: false,
                    });
                }
            }
            this.form.resetForm({
                values: { name: this.group.name, parentId: this.group.parentId },
            });
            loading.close();
        }
    }

    form = setup(() => initGroupUserForm());
}
</script>
<style scoped lang="scss"></style>
