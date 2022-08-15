<template>
    <MainContent :title="$t('auth.auth.forgotPassword.forgotPassword')" :widthCard="550">
        <template v-slot:form>
            <div v-if="isConfirm" class="mb-5 text-message">
                {{ $t('auth.auth.forgotPassword.textGuideForgotPassword') }}
            </div>
            <div v-else>
                <BaseInputText
                    :label="$t('auth.auth.forgotPassword.email')"
                    v-model:value="form.email"
                    :isLabelRight="false"
                    isRequired="true"
                    :placeholder="$t('auth.auth.placeholder.forgotPassword')"
                    :error="translateYupError(form.errors.email)"
                    @onEnter="submitForm"
                />
            </div>
            <div class="form-group mb-0 row">
                <div class="col-12">
                    <button
                        class="btn btn-primary w-100 waves-effect waves-light"
                        type="button"
                        @click="submitForm(isConfirm)"
                    >
                        {{ textButton }}<i class="fas fa-sign-in-alt ms-1"></i>
                    </button>
                </div>
            </div>
            <div class="remember-account mt-4 mb-2">
                <div class="text-gray">
                    {{ $t('auth.auth.forgotPassword.rememberIt') }}
                </div>
                <div class="text-blue" @click="goToLoginPage">
                    {{ $t('auth.auth.forgotPassword.signInHere') }}
                </div>
            </div>
        </template>
    </MainContent>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { PageName } from '@/modules/common/constants';
import router from '@/router';
import { showErrorNotificationFunction } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { Options, setup } from 'vue-class-component';
import { initData } from '../composition/forgotPassword';
import MainContent from '@/components/layout/login-layout/MainContent.vue';
import { authModule } from '../store';
@Options({
    components: { MainContent },
})
export default class ForgotPasswordPage extends UtilMixins {
    isConfirm = false;
    form = setup(() => initData());

    get textButton(): string {
        return this.isConfirm
            ? this.$t('auth.auth.label.goToLoginPage')
            : this.$t('auth.auth.label.confirm');
    }

    async submitForm(isConfirm = false): Promise<void> {
        if (isConfirm) {
            router.push({ name: PageName.LOGIN_PAGE });
            return;
        }
        const { valid } = await this.form.validate();
        if (!valid) return;
        const loading = ElLoading.service({});
        const email = ((this.form?.email as string) || '').trim();
        const response = await authModule.forgotPassword(email as string);
        loading.close();
        if (response.success) {
            this.isConfirm = true;
        } else if (!response?.isRequestError) {
            showErrorNotificationFunction(response?.message as string);
        }
    }

    goToLoginPage(): void {
        router.push({ name: PageName.LOGIN_PAGE });
    }
}
</script>

<style lang="scss" scoped>
.remember-account {
    display: flex;
    .text-gray {
        margin-right: 6px;
        font-size: 12px;
        color: #a4abc5;
    }
    .text-blue {
        font-size: 12px;
        cursor: pointer;
    }
}
.text-message {
    text-align: center;
    font-size: 20px;
}
</style>
