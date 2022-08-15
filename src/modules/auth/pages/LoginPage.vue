<template>
    <MainContent :title="$t('auth.auth.title.login')" :widthCard="350">
        <template v-slot:form>
            <form class="form-horizontal auth-form" action="/">
                <BaseInputText
                    :label="$t('auth.auth.label.username')"
                    v-model:value="form.credential"
                    :isLabelRight="false"
                    :placeholder="$t('auth.auth.placeholder.username')"
                    :error="translateYupError(form.errors.credential)"
                    @onEnter="form.onSubmit"
                />
                <BaseInputText
                    :label="$t('auth.auth.label.password')"
                    v-model:value="form.password"
                    :placeholder="$t('auth.auth.placeholder.password')"
                    type="password"
                    :isLabelRight="false"
                    :error="translateYupError(form.errors.password)"
                    @onEnter="form.onSubmit"
                />
                <div class="form-group row my-2">
                    <div class="col-sm-6">
                        <div
                            class="custom-control custom-switch switch-success"
                            v-show="false"
                        >
                            <input
                                type="checkbox"
                                class="custom-control-input"
                                id="customSwitchSuccess"
                            />
                            <label
                                class="form-label text-muted"
                                for="customSwitchSuccess"
                                >{{ $t('auth.auth.label.rememberMe') }}</label
                            >
                        </div>
                    </div>
                    <div class="col-sm-6 text-end text-muted font-13 forgot-password">
                        <span @click="forgotPassword" class="text-title">{{
                            $t('auth.auth.label.forgotPassword')
                        }}</span>
                    </div>
                </div>
                <!--end form-group-->

                <div class="form-group mb-0 row">
                    <div class="col-12">
                        <button
                            class="btn btn-primary w-100 waves-effect waves-light"
                            type="button"
                            @click="form.onSubmit"
                        >
                            {{ $t('auth.auth.label.login')
                            }}<i class="fas fa-sign-in-alt ms-1"></i>
                        </button>
                    </div>
                    <!--end col-->
                </div>
                <!--end form-group-->
            </form>
            <!--end form-->
        </template>
    </MainContent>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { appModule } from '@/store/app';
import { Options, setup } from 'vue-class-component';
import { initData } from '../composition/loginForm';
import router from '@/router';
import { PageName } from '@/modules/common/constants';
import MainContent from '@/components/layout/login-layout/MainContent.vue';
@Options({
    components: {
        MainContent,
    },
})
export default class LoginPage extends UtilMixins {
    msg!: string;

    get lang(): string {
        return appModule.selectedLanguage;
    }

    form = setup(() => initData());

    resetErrorMessage(): void {
        this.form.setErrors({});
    }

    forgotPassword(): void {
        router.push({ name: PageName.FORGOT_PASSWORD_PAGE });
    }
}
</script>

<style lang="scss" scoped>
.forgot-password {
    .text-title:hover {
        cursor: pointer;
        color: #1761fd !important;
    }
}
</style>
