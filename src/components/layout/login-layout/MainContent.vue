<template>
    <el-card :body-style="{ padding: 0 }" class="custom-card" :style="styleWidthCard">
        <template #header>
            <div class="text-center p-3">
                <a href="/" class="logo logo-admin">
                    <img
                        :src="require('@/assets/images/logo.png')"
                        height="50"
                        alt="logo"
                        class="auth-logo"
                    />
                </a>
                <h4 class="mt-3 mb-1 fw-semibold text-white upper-case font-18">
                    {{ title }}
                </h4>
            </div>
        </template>
        <div class="custom-card-content">
            <div class="lang-wrapper" v-if="isShowMenuLanguage">
                <HeaderMenuLanguage />
            </div>
            <div class="p-3">
                <slot name="form"></slot>
            </div>
            <div class="footer-card text-center">
                <span>{{ $t('auth.auth.title.pavana') }}{{ currentYear }}</span>
            </div>
        </div>
    </el-card>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Options({
    components: {},
})
export default class MainContent extends Vue {
    @Prop({ default: '' }) readonly title!: string;
    @Prop({ default: 300 }) readonly widthCard!: number;
    @Prop({ default: true }) readonly isShowMenuLanguage!: boolean;

    get styleWidthCard(): string {
        return `width: ${this.widthCard}px !important`;
    }

    get currentYear(): string {
        const currentYear = new Date().getFullYear();
        return ` ©  ${currentYear}`;
    }
}
</script>

<style lang="scss" scoped>
.custom-card {
    ::v-deep .el-card__header {
        background-color: #0c213a;
    }
}
.form-group {
    text-align: left;
}

.lang-wrapper {
    display: flex;
    justify-content: flex-end;
}
.custom-control-input {
    margin-right: 5px;
}
.invalid-feedback {
    margin-bottom: 10px;
}
.upper-case {
    text-transform: uppercase;
}
.footer-card {
    color: #303e67;
    padding-bottom: 12px;
    font-size: 12px;
}
</style>
