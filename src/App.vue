<template>
    <ElConfigProvider :locale="locale">
        <router-view />
    </ElConfigProvider>
</template>
<script lang="ts">
import Socket from './plugins/socket/socket';
import { Options, mixins } from 'vue-class-component';
import { ElConfigProvider } from 'element-plus';
import { appModule } from './store/app';
import { Watch } from 'vue-property-decorator';
import { UtilMixins } from './mixins/utilMixins';
import { appService } from './utils/app';
import en from '@/plugins/element-ui/lang/en';
import vi from '@/plugins/element-ui/lang/vi';
import { SupportLanguage } from './modules/common/constants';
@Options({
    components: {
        ElConfigProvider,
    },
})
export default class App extends mixins(UtilMixins) {
    mounted(): void {
        this.connectSocket();
    }

    connectSocket(): void {
        const user = appService.getUser();
        Socket.connect({
            senderId: user.id as number,
            senderEmail: user.email,
            senderUsername: user.username,
        });
    }

    beforeDestroyed(): void {
        Socket.disconnect();
    }

    get isShowNetworkError(): boolean {
        return appModule.isShowNetworkError;
    }

    get locale(): Record<string, unknown> {
        const i18nLocale = appModule.selectedLanguage;
        if (i18nLocale === SupportLanguage.EN) {
            return en;
        }
        return vi;
    }

    @Watch('isShowNetworkError')
    async onNetWorkError(isError: boolean): Promise<void> {
        if (isError) {
            await this.showAlertMessage(this.$t('common.app.errors.network'));
            appModule.SET_SHOW_NETWORK_ERROR(false);
        }
    }
}
</script>
<style lang="scss">
#app {
    width: 100%;
}
</style>
