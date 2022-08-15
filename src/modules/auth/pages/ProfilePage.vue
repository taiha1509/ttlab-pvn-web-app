<template>
    <LayoutMainContent :breadcrumbs="breadcrumbs" :isShowSubSideBar="false">
        <template #content>
            <div class="card personal-card">
                <div class="card-body">
                    <BaseInputText
                        :label="$t('user.userForm.table.username')"
                        v-model:value="profile.username"
                        :isDisabled="true"
                        :isHorizontal="true"
                    />
                    <BaseInputText
                        :label="$t('user.userForm.table.fullName')"
                        v-model:value="form.fullName"
                        :isHorizontal="true"
                        :error="translateYupError(form.errors.fullName)"
                    />

                    <BaseInputText
                        :label="$t('user.userForm.table.email')"
                        v-model:value="profile.email"
                        :isDisabled="true"
                        :isHorizontal="true"
                    />

                    <BaseInputText
                        :label="$t('user.userForm.table.phoneNumber')"
                        v-model:value="form.phoneNumber"
                        :isHorizontal="true"
                        :error="translateYupError(form.errors.phoneNumber)"
                    />

                    <BaseInputText
                        :label="$t('user.userForm.table.roles')"
                        :placeholder="roleName"
                        :isHorizontal="true"
                        :isDisabled="true"
                    />

                    <BaseInputText
                        :label="$t('user.userForm.table.status')"
                        :placeholder="$t(`user.userForm.status.${profile.status}`)"
                        :isDisabled="true"
                        :isHorizontal="true"
                    />
                    <BaseInputText
                        :label="$t('user.userForm.table.groups')"
                        :placeholder="userGroupNames"
                        :isDisabled="true"
                        :isHorizontal="true"
                    />
                    <div class="button-group">
                        <el-button @click="onClickCancel" size="small">
                            {{ $t('user.userForm.button.cancel') }}
                        </el-button>
                        <el-button type="primary" @click="form.onSubmit" size="small">
                            {{ $t('user.userForm.button.submit') }}
                        </el-button>
                        <el-button
                            type="primary"
                            @click="onClickChangePassword"
                            size="small"
                        >
                            {{ $t('auth.auth.button.changePassword') }}
                        </el-button>
                    </div>
                </div>
            </div>
        </template>
        <PasswordFormPopup />
    </LayoutMainContent>
</template>

<script lang="ts">
import { IBreadcrumb } from '@/modules/common/types';
import { IUserDetailReponse } from '@/modules/user/types';
import { ElLoading } from 'element-plus';
import { Options, setup } from 'vue-class-component';
import { authModule } from '../store';
import PasswordFormPopup from '../components/PasswordFormpopup.vue';
import { PageName } from '@/modules/common/constants';
import { updateProfileAction } from '../composition/updateProfile';
import { UtilMixins } from '@/mixins/utilMixins';

@Options({ components: { PasswordFormPopup } })
export default class ProfilePage extends UtilMixins {
    get breadcrumbs(): IBreadcrumb[] {
        return [
            {
                title: this.$t('auth.auth.title.profile'),
                isActive: true,
            },
        ];
    }

    get profile(): IUserDetailReponse {
        return authModule.profile;
    }

    get userGroup(): string {
        return this.profile?.groups?.map((group) => group.name)?.join(', ');
    }

    get roleName(): string {
        return this.profile?.roles?.map((role) => role.name).join(',');
    }

    get userGroupNames(): string {
        return this.profile?.groups?.map((group) => group.name).join(', ');
    }

    form = setup(() => updateProfileAction());

    async fetchData(): Promise<void> {
        const loading = ElLoading.service({ target: 'page-content' });
        await authModule.getProfile();
        this.form.fullName = authModule.profile.fullName;
        this.form.phoneNumber = authModule.profile.phoneNumber;
        loading.close();
    }

    created(): void {
        this.fetchData();
    }

    onClickChangePassword(): void {
        authModule.setShowPasswordPopup(true);
    }

    onClickCancel(): void {
        this.$router.push({
            name: PageName.CAMERA_PAGE,
        });
    }
}
</script>

<style lang="scss" scoped>
.field-groups {
    padding: 10px 0px;
    border-bottom: solid 1px #f1eeee;
}

.resend-btn {
    align-items: center;
}

.wrapper {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
}
.content {
    padding: 0px 100px;
    margin-top: 100px;
}

.button-group {
    text-align: center;
}

::v-deep {
    .el-input.is-disabled .el-input__inner {
        color: #66686a;
    }
}

.personal-card {
    width: 1000px;
}

.card-body {
    overflow: auto;
    max-height: calc(100vh - 200px);
}
</style>
