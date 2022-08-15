<template>
    <div class="language-select">
        <el-dropdown trigger="click">
            <a class="nav-link" data-toggle="dropdown" href="#" role="button">
                <img
                    v-if="lang === 'en'"
                    src="@/assets/images/flags/en.png"
                    class="language-icon"
                    alt="en"
                />
                <img
                    v-else
                    src="@/assets/images/flags/vn.png"
                    class="language-icon"
                    alt="vi"
                />
                <span class="language-color">
                    {{ $t('common.app.menuLanguage.title') }}
                </span>
            </a>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="setLocale('en')">
                        <img
                            src="@/assets/images/flags/en.png"
                            alt=""
                            height="16"
                            class="language-icon-option"
                        />
                        {{ $t('common.app.menuLanguage.english') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="setLocale('vi')">
                        <img
                            src="@/assets/images/flags/vn.png"
                            alt=""
                            height="16"
                            class="language-icon-option"
                        />
                        {{ $t('common.app.menuLanguage.vietnamese') }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { appService } from '@/utils/app';
import i18n from '@/plugins/vue-i18n';
import { setLocale } from '@vee-validate/i18n';
import { appModule } from '@/store/app';
import { SupportLanguage } from '@/modules/common/constants';

@Options({})
export default class MenuLanguage extends Vue {
    lang = appService.currentAppLang;

    setLocale(lang: SupportLanguage): void {
        this.lang = lang;
        appService.setLang(lang);
        appModule.setLanguage(lang);
        // set language to i18n
        i18n.global.locale = lang;
        setLocale(lang);
    }
}
</script>

<style lang="scss" scoped>
.language-select {
    background-color: transparent;
    display: flex;
    align-items: center;
    height: 100%;
    width: 135px;
    .language-color {
        color: #212121;
        @media only screen and (max-width: 991.98px) {
            display: none;
        }
    }
    .language-icon {
        width: 25px;
        padding-bottom: 3px;
        margin-right: 5px;
        @media only screen and (max-width: 991.98px) {
            margin-right: 0px;
            width: 25px;
        }
    }
    .nav-link {
        padding: 0 12px;
        line-height: 52px;
        @media only screen and (max-width: 991.98px) {
            width: 25px;
            align-items: center;
        }
        &:hover {
            background: #ededed;
        }
    }
    .el-dropdown {
        width: 100%;
    }
}
.el-dropdown-menu {
    padding: 0px !important;
    width: 135px !important;
}

.language-icon-option {
    margin: 0px 5px 0px 2px;
}
</style>
