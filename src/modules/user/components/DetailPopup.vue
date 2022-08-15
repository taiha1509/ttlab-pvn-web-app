<template>
    <BaseDialogLayout
        width="40%"
        v-model="isShowUser"
        :before-close="closePopup"
        :title="$t('user.userForm.popup.titleDetail')"
        @open="openPopup"
        customClass="el-dialog-user-detail"
    >
        <template #content>
            <div class="field-groups row">
                <div class="col-5 fw-bold">{{ $t('user.userForm.table.username') }}</div>
                <div class="col-7">{{ user?.username }}</div>
            </div>
            <div class="field-groups row">
                <div class="col-5 fw-bold">{{ $t('user.userForm.table.fullName') }}</div>
                <div class="col-7">{{ user?.fullName }}</div>
            </div>
            <div class="field-groups row">
                <div class="col-5 fw-bold">{{ $t('user.userForm.table.email') }}</div>
                <div class="col-7">{{ user?.email }}</div>
            </div>
            <div class="field-groups row">
                <div class="col-5 fw-bold">
                    {{ $t('user.userForm.table.phoneNumber') }}
                </div>
                <div class="col-7">{{ user?.phoneNumber }}</div>
            </div>
            <div class="field-groups row">
                <div class="col-5 fw-bold">{{ $t('user.userForm.table.roles') }}</div>
                <div class="col-7">{{ roleNames }}</div>
            </div>
            <div class="field-groups row">
                <div class="col-5 fw-bold">{{ $t('user.userForm.table.groups') }}</div>
                <div class="col-7">{{ userGroups }}</div>
            </div>
            <div class="field-groups row">
                <div class="col-5 fw-bold">{{ $t('user.userForm.table.cameras') }}</div>
                <div class="col-7">{{ cameras }}</div>
            </div>
            <div class="field-groups row">
                <div class="col-5 fw-bold">
                    {{ $t('user.userForm.table.cameraGroups') }}
                </div>
                <div class="col-7">{{ cameraGroups }}</div>
            </div>
            <div class="field-groups row resend-btn" v-if="!hasResendBtn">
                <div class="col-5 fw-bold">{{ $t('user.userForm.table.status') }}</div>
                <div class="col-7">
                    {{ user?.status ? $t(`user.userForm.status.${user?.status}`) : '' }}
                </div>
            </div>
            <div class="field-groups row resend-btn" v-else>
                <div class="col-5 fw-bold">{{ $t('user.userForm.table.status') }}</div>
                <div class="col-5">
                    {{ user?.status ? $t(`user.userForm.status.${user?.status}`) : '' }}
                </div>
                <div class="col-2">
                    <el-button size="small" @click="resendEmailInvitation(user?.id)">
                        {{ $t('user.userForm.button.resend') }}
                    </el-button>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="row">
                <div class="col-2"></div>
                <div class="col-8">
                    <div class="group1 d-flex justify-content-center">
                        <el-button @click="closePopup" plain>
                            {{ $t('user.userForm.button.cancel') }}
                        </el-button>
                        <el-button
                            @click="openUpdatePopup()"
                            v-if="canUpdate(user)"
                            plain
                        >
                            {{ $t('user.userForm.button.update') }}
                        </el-button>
                        <el-button
                            @click="action.openPopupDelete(user)"
                            v-if="canDelete(user)"
                            plain
                        >
                            {{ $t('user.userForm.button.delete') }}
                        </el-button>
                    </div>
                </div>
                <div class="col-2"></div>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { mixins, setup } from 'vue-class-component';
import { userModule } from '../store';
import { IUserDetailReponse } from '../types';
import { POPUP_NAME, UserStatus, UserTypes } from '../constant';
import { action } from '../composition/userList';
import { ElLoading } from 'element-plus';
import { authApiService } from '@/modules/auth/services/api.service';
import { UtilMixins } from '@/mixins/utilMixins';
import { PermissionActions } from '@/modules/role/role.constant';
import { appService } from '@/utils/app';
export default class DetailPopup extends mixins(UtilMixins) {
    get isShowUser(): boolean {
        return userModule.displayUsersPopups[POPUP_NAME.DETAIL_POPUP];
    }

    get hasResendBtn(): boolean {
        return (
            userModule.user?.status === UserStatus.REGISTERING &&
            userModule.userPermissions.includes(PermissionActions.INVITE)
        );
    }

    canUpdate(user: IUserDetailReponse): boolean {
        const isAdmin =
            user.types.includes(UserTypes.SYSTEM_ADMIN) ||
            user.types.includes(UserTypes.DEVICE_ADMIN);
        return userModule.userPermissions.includes(PermissionActions.UPDATE) && !isAdmin;
    }

    canDelete(user: IUserDetailReponse): boolean {
        const isLoginUser = user.id === appService.getUser().id;
        const isAdmin =
            user.types.includes(UserTypes.DEVICE_ADMIN) ||
            user.types.includes(UserTypes.SYSTEM_ADMIN);
        return (
            userModule.userPermissions.includes(PermissionActions.DELETE) &&
            !isLoginUser &&
            !isAdmin
        );
    }

    get user(): IUserDetailReponse {
        return userModule.user;
    }

    get userGroups(): string {
        return this.user?.groups?.map((group) => group.name)?.join(', ');
    }

    get cameras(): string {
        return this.user?.cameras?.map((camera) => camera.name)?.join(', ');
    }

    get cameraGroups(): string {
        return this.user?.cameraGroups
            ?.map((cameraGroup) => cameraGroup.name)
            ?.join(', ');
    }

    get roleNames(): string {
        return this.user?.roles?.map((item) => item.name).join(', ');
    }

    closePopup(): void {
        // reset user in module
        userModule.setUser({ ...userModule.initUser });
        userModule.closeUserPopup(POPUP_NAME.DETAIL_POPUP);
    }

    openUpdatePopup(): void {
        this.action.openPopupUpdate();
    }

    async openPopup(): Promise<void> {
        const loading = await ElLoading.service({});
        await userModule.getUser(+(userModule.user.id as number));
        loading.close();
    }

    async resendEmailInvitation(userId: number): Promise<void> {
        const loading = ElLoading.service();
        const response = await authApiService.resendEmailInvitation(userId);
        if (response.success) {
            this.showSuccessNotification(this.$t('user.userForm.message.resend.success'));
        } else if (!response?.isRequestError) {
            this.showErrorNotification(response.message);
        }
        loading.close();
    }

    action = setup(() => action());
}
</script>
<style scoped lang="scss">
.field-groups {
    padding: 10px 10px 10px 0 !important;
    border-bottom: solid 1px #f1eeee;
}

.resend-btn {
    align-items: center;
}
</style>
