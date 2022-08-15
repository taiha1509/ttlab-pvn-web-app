<template>
    <MainContent
        :title="$t('auth.auth.forgotPassword.resetPassword')"
        :widthCard="550"
        :isShowMenuLanguage="!errorVerifyToken"
    >
        <template v-slot:form>
            <div v-if="errorVerifyToken">
                <MessageResult :messageResult="errorVerifyToken" />
            </div>

            <div v-if="isResetPasswordSuccess">
                <MessageResult
                    :messageResult="$t('auth.auth.forgotPassword.textGuideResetPassword')"
                />
            </div>
            <div v-if="!errorVerifyToken && !isResetPasswordSuccess">
                <div class="text-guide mb-5">
                    <div>{{ $t('auth.auth.forgotPassword.textGiude') }}</div>
                    <ul>
                        <li>{{ $t('auth.auth.forgotPassword.subTextGiude1') }}</li>
                    </ul>
                </div>
                <BaseInputText
                    :label="$t('auth.auth.forgotPassword.newPassword')"
                    v-model:value="form.newPassword"
                    :isLabelRight="false"
                    isRequired="true"
                    type="password"
                    :placeholder="$t('auth.auth.forgotPassword.newPassword')"
                    :error="translateYupError(form.errors.newPassword)"
                    @onEnter="submitForm"
                />
                <BaseInputText
                    :label="$t('auth.auth.forgotPassword.confirmPassword')"
                    v-model:value="form.confirmPassword"
                    :isLabelRight="false"
                    isRequired="true"
                    type="password"
                    :placeholder="$t('auth.auth.forgotPassword.confirmPassword')"
                    :error="translateYupError(form.errors.confirmPassword)"
                    @onEnter="submitForm"
                />
                <div class="form-group mb-0 row">
                    <div class="col-12">
                        <button
                            class="btn btn-primary w-100 waves-effect waves-light"
                            type="button"
                            @click="submitForm"
                        >
                            {{ this.$t('auth.auth.label.confirm')
                            }}<i class="fas fa-sign-in-alt ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </MainContent>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { showErrorNotificationFunction } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { Options, setup } from 'vue-class-component';
import { initData } from '../composition/resetPassword';
import { authModule } from '../store';
import MainContent from '@/components/layout/login-layout/MainContent.vue';
import { TokenType } from '../constants';
import MessageResult from '../components/MessageResult.vue';
import { IVerifyToken } from '../types';
import { HttpStatus } from '@/modules/common/constants';

@Options({
    components: { MainContent, MessageResult },
})
export default class ResetPasswordPage extends UtilMixins {
    isResetPasswordSuccess = false;
    errorVerifyToken: string | null = null;
    form = setup(() => initData());

    created(): void {
        this.verifyToken();
    }

    async verifyToken(): Promise<void> {
        const params = {
            token: this.$route?.query?.token || '',
            type: TokenType.FORGOT_PASSWORD,
        };
        const loading = ElLoading.service({});
        const response = await authModule.verifyToken(params as IVerifyToken);
        if (!response.success) {
            this.errorVerifyToken = response?.message as string;
        }
        loading.close();
    }

    async submitForm(): Promise<void> {
        this.errorVerifyToken = '';
        const { valid } = await this.form.validate();
        if (!valid) return;
        const loading = ElLoading.service({});
        const params = {
            password: this.form.confirmPassword,
            token: this.$route?.query?.token || '',
        };
        const response = await authModule.resetPassword(params as Record<string, string>);
        if (response.success) {
            this.isResetPasswordSuccess = true;
        }
        // check in case click submit but token is invalid
        else if (response?.code === HttpStatus.TOKEN_INVALID) {
            this.errorVerifyToken = response?.message as string;
        } else if (!response?.isRequestError) {
            showErrorNotificationFunction(response?.message as string);
        }

        loading.close();
    }
}
</script>

<style lang="scss" scoped>
.text-message {
    text-align: center;
    font-size: 20px;
}
</style>
