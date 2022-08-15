<template>
    <BaseDialogLayout
        width="70%"
        v-model:value="isShowUser"
        @before-close="closePopup"
        :title="popupTitle"
        customClass="el-dialog-user-form"
        @open="openPopup"
        @close="closedPopup"
    >
        <template #content>
            <div class="row">
                <div class="col-md-6">
                    <BaseInputText
                        :label="$t('user.userForm.table.username')"
                        v-model:value="form.username"
                        :isRequired="isCreate"
                        :isLabelRight="false"
                        :error="translateYupError(form.errors.username)"
                        :isDisabled="!isCreate"
                        :placeholder="$t('user.userForm.placeholder.username')"
                    />
                </div>
                <div class="col-md-6">
                    <BaseInputText
                        :label="$t('user.userForm.table.fullName')"
                        v-model:value="form.fullName"
                        :isLabelRight="false"
                        :error="translateYupError(form.errors.fullName)"
                        :placeholder="$t('user.userForm.placeholder.fullName')"
                    />
                </div>
                <div class="col-md-6" v-if="isCreate">
                    <BaseInputText
                        type="password"
                        :isRequired="isCreate"
                        :isLabelRight="false"
                        :label="$t('user.userForm.table.password')"
                        v-model:value="form.password"
                        :error="translateYupError(form.errors.password)"
                        :placeholder="$t('user.userForm.placeholder.password')"
                    />
                </div>
                <div class="col-md-6" v-if="isCreate">
                    <BaseInputText
                        type="password"
                        :isLabelRight="false"
                        :isRequired="isCreate"
                        :label="$t('user.userForm.table.confirmPassword')"
                        :placeholder="$t('user.userForm.placeholder.confirmPassword')"
                        v-model:value="form.confirmPassword"
                        :error="translateYupError(form.errors.confirmPassword)"
                    />
                </div>
                <div class="col-md-6">
                    <BaseInputText
                        :label="$t('user.userForm.table.email')"
                        v-model:value="form.email"
                        :isLabelRight="false"
                        :isRequired="true"
                        :isDisabled="!isCreate"
                        :error="translateYupError(form.errors.email)"
                        :placeholder="$t('user.userForm.placeholder.email')"
                    />
                </div>
                <div class="col-md-6">
                    <BaseInputText
                        :label="$t('user.userForm.table.phoneNumber')"
                        v-model:value="form.phoneNumber"
                        :isLabelRight="false"
                        :error="translateYupError(form.errors.phoneNumber)"
                        :placeholder="$t('user.userForm.placeholder.phoneNumber')"
                    />
                </div>
                <div class="col-md-6">
                    <BaseMultipleSelectTreeView
                        :label="$t('user.userForm.table.groups')"
                        v-model:value="form.groupIds"
                        :filterable="true"
                        :nodeKey="'id'"
                        :isDisabled="isDisableUserGroupEdit"
                        :placeholder="$t('user.userForm.placeholder.groupIds')"
                        :error="translateYupError(form.errors.groupIds)"
                        :treeData="groupTreeOptions"
                    />
                </div>
                <div class="col-md-6">
                    <BaseMultipleSelect
                        :label="$t('user.userForm.table.roles')"
                        v-model:value="form.roleIds"
                        :placeholder="$t('user.userForm.placeholder.roleIds')"
                        :isRequired="true"
                        :filterable="true"
                        :error="translateYupError(form.errors.roleIds)"
                        :options="roleOptions"
                        :isDisabled="isDisableRoleEdit"
                    />
                </div>
                <div class="col-md-6">
                    <BaseMultipleSelect
                        :label="$t('user.userForm.table.cameras')"
                        v-model:value="form.cameraIds"
                        :filterable="true"
                        :placeholder="$t('user.userForm.placeholder.cameraIds')"
                        :error="translateYupError(form.errors.groupIds)"
                        :options="cameraOptions"
                        :isDisabled="isDisableCameraEdit"
                    />
                </div>
                <div class="col-md-6">
                    <BaseMultipleSelectTreeView
                        :label="$t('user.userForm.table.cameraGroups')"
                        v-model:value="form.cameraGroupIds"
                        :isDisabled="isDisableCameraGroupEdit"
                        :placeholder="$t('user.userForm.placeholder.cameraGroupIds')"
                        :error="translateYupError(form.errors.cameraGroupIds)"
                        :nodeKey="'_id'"
                        :filterable="true"
                        :treeData="cameraGroupTreeOptions"
                    />
                </div>
            </div>
        </template>

        <template #footer>
            <div class="row">
                <div class="col-6">
                    <el-button @click="closePopup">
                        {{ $t('user.userForm.button.cancel') }}
                    </el-button>
                </div>
                <div class="col-6" style="text-align: left">
                    <el-button type="primary" @click="form.onSubmit">
                        {{ $t('user.userForm.button.submit') }}
                    </el-button>
                </div>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { initData } from '../composition/popup';
import { mixins, setup } from 'vue-class-component';
import { userModule } from '../store';
import { ISelectOptions, ITreeNode } from '@/modules/common/types';
import { IUserDetailReponse } from '../types';
import { POPUP_NAME, UserStatus } from '../constant';
import { ElLoading } from 'element-plus';
import { UtilMixins } from '@/mixins/utilMixins';
import { PermissionActions } from '@/modules/role/role.constant';

export default class UserFormPopup extends mixins(UtilMixins) {
    get isShowUser(): boolean {
        return userModule.displayUsersPopups[POPUP_NAME.FORM_POPUP];
    }

    get isCreate(): boolean {
        return !userModule.user?.id;
    }

    get hasResendBtn(): boolean {
        return userModule.user?.status === UserStatus.REGISTERING;
    }

    get cameraOptions(): ISelectOptions[] {
        return (
            userModule.cameras?.map((camera) => ({
                label: camera.name,
                value: camera._id,
            })) || []
        );
    }

    get cameraGroupTreeOptions(): ITreeNode[] {
        return userModule.cameraGroups;
    }

    get popupTitle(): string {
        if (this.isCreate) {
            return this.$t('user.userForm.popup.titleCreate');
        }
        return this.$t('user.userForm.popup.titleUpdate');
    }

    get roleOptions(): ISelectOptions[] {
        return userModule.roles.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    }

    get groupTreeOptions(): ITreeNode[] {
        return userModule.userGroupTree;
    }

    get isDisableRoleEdit(): boolean {
        return !userModule.rolePermissions.includes(PermissionActions.READ);
    }

    get isDisableUserGroupEdit(): boolean {
        return !userModule.userGroupPermissions.includes(PermissionActions.READ);
    }

    get isDisableCameraGroupEdit(): boolean {
        return !userModule.cameraGroupPermissions.includes(PermissionActions.READ);
    }

    get isDisableCameraEdit(): boolean {
        return !userModule.cameraPermissions.includes(PermissionActions.READ);
    }

    get user(): IUserDetailReponse {
        return userModule.user;
    }

    form = setup(() => initData());

    closePopup(): void {
        userModule.closeUserPopup(POPUP_NAME.FORM_POPUP);
    }

    async openPopup(): Promise<void> {
        this.form.resetUserForm();
        const loading = ElLoading.service({});
        await Promise.all([
            [
                userModule.getCameraGroups(),
                userModule.getCameras(),
                userModule.getDropdownUserGroup(),
            ],
        ]);
        if (!this.isCreate) {
            await userModule.getUser(+(userModule.user.id as number));
        }
        if (!this.isCreate && userModule.user)
            this.form.setInputDataToUpdate(userModule.user);
        loading.close();
    }
}
</script>
<style scoped></style>
