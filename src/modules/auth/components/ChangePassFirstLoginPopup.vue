<template>
    <BaseDialogLayout
        width="50%"
        v-model="showResetPasswordForm"
        @before-close="closePopup"
        :title="$t('auth.auth.title.updatePassword')"
    >
        <template #content>
            <div class="row">
                <div class="col-12">
                    <BaseInputText
                        type="password"
                        :isRequired="true"
                        :label="$t('user.userForm.table.password')"
                        :placeholder="$t('auth.auth.placeholder.password')"
                        v-model:value="form.oldPassword"
                        :error="translateYupError(form.errors.oldPassword)"
                        :isHorizontal="true"
                    />
                </div>
                <div class="col-12">
                    <BaseInputText
                        type="password"
                        :isRequired="true"
                        :label="$t('user.userForm.table.newPassword')"
                        :placeholder="$t('auth.auth.placeholder.newPassword')"
                        v-model:value="form.newPassword"
                        :error="translateYupError(form.errors.newPassword)"
                        :isHorizontal="true"
                    />
                </div>
                <div class="col-12">
                    <BaseInputText
                        type="password"
                        :isRequired="true"
                        :label="$t('user.userForm.table.confirmPassword')"
                        :placeholder="$t('auth.auth.placeholder.confirmPassword')"
                        v-model:value="form.confirmPassword"
                        :error="translateYupError(form.errors.confirmPassword)"
                        :isHorizontal="true"
                    />
                </div>
            </div>
        </template>

        <template #footer>
            <div class="row">
                <div class="col-12" style="text-align: center">
                    <el-button @click="closePopup">
                        {{ $t('user.userForm.button.cancel') }}
                    </el-button>
                    <el-button type="primary" @click="form.onSubmit">
                        {{ $t('user.userForm.button.submit') }}
                    </el-button>
                </div>
            </div>
        </template>
    </BaseDialogLayout>
</template>

<script lang="ts">
import { setup } from 'vue-class-component';
import { authModule } from '../store';
import { updatePasswordAction } from '../composition/updatePasswordPopup';
import { UtilMixins } from '@/mixins/utilMixins';

export default class ChangePassFirstLoginPopup extends UtilMixins {
    get showResetPasswordForm(): boolean {
        return authModule.profile?.firstLogin || false;
    }

    set showResetPasswordForm(value: boolean) {
        console.log(value);
    }

    form = setup(() => updatePasswordAction());

    closePopup(): void {
        this.form.resetDefault();
        authModule.setShowPasswordPopup(false);
    }
}
</script>
<style scoped></style>
