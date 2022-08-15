<template>
    <MainContent
        :title="$t('auth.auth.title.login')"
        :widthCard="350"
        :isShowMenuLanguage="!errorVerifyToken"
    >
        <template v-slot:form>
            <form class="form-horizontal auth-form" action="/">
                <div v-if="errorVerifyToken">
                    <MessageResult :messageResult="errorVerifyToken" />
                </div>
                <div v-else>
                    <div
                        class="invalid-feedback text-start"
                        :class="{ 'd-block': errorMessage }"
                    >
                        {{ errorMessage }}
                    </div>

                    <div class="form-group mb-0 row">
                        <div class="col-12">
                            <button
                                class="btn btn-primary w-100 waves-effect waves-light"
                                type="button"
                                @click="form.onSubmit"
                            >
                                {{ this.$t('auth.auth.label.confirm')
                                }}<i class="fas fa-sign-in-alt ms-1"></i>
                            </button>
                        </div>
                        <!--end col-->
                    </div>
                </div>
                <!--end form-group-->
            </form>
            <!--end form-->
        </template>
    </MainContent>
</template>

<script lang="ts">
import { Options, setup, Vue } from 'vue-class-component';
import { initData } from '../composition/verifyEmailInvitationForm';
import MainContent from '@/components/layout/login-layout/MainContent.vue';
import { TokenType } from '../constants';
import { authModule } from '../store';
import MessageResult from '../components/MessageResult.vue';
import { IVerifyToken } from '../types';
@Options({
    components: {
        MainContent,
        MessageResult,
    },
})
export default class VerifyEmailInvitationPage extends Vue {
    msg!: string;
    errorVerifyToken: string | null = null;

    form = setup(() => initData());

    async created(): Promise<void> {
        const params = {
            token: this.$route?.query?.token || '',
            type: TokenType.EMAIL_INVITATION,
        };
        const response = await authModule.verifyToken(params as IVerifyToken);
        if (!response.success) {
            this.errorVerifyToken = response?.message as string;
        }
    }
}
</script>

<style lang="scss" scoped>
.text-message {
    text-align: center;
    font-size: 20px;
}
</style>
