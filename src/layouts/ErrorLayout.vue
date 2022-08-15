<template>
    <el-container class="error-page background-img">
        <el-card class="error-card">
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
                    <h4 class="mt-3 mb-1 fw-semibold text-white font-18">
                        {{ message }}
                    </h4>
                </div>
            </template>
            <div class="ex-page-content text-center">
                <div class="lang-wrapper"><HeaderMenuLanguage /></div>
                <img
                    :src="require('@/assets/images/error.svg')"
                    alt="0"
                    class=""
                    height="170"
                />
                <h1 class="mt-4 mb-4 warning-text">{{ code }}!</h1>
            </div>
            <a class="btn btn-primary w-100 waves-effect waves-light" href="/"
                >{{ $t('common.app.errorPage.button') }}<i class="fas fa-redo ms-1"></i
            ></a>
        </el-card>
        <router-view />
    </el-container>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class ErrorLayout extends Vue {
    get message(): string {
        return this.$t(this.$route.meta?.message as string);
    }

    get code(): number {
        return this.$route.meta?.code as number;
    }
}
</script>

<style lang="scss" scoped>
.error-page {
    font-size: 0.9375rem;
    color: #1f1f1f;
    background-color: #f7f7f7;
    min-height: 100%;
    overflow-x: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    &.background-img {
        background-image: url('../assets/images/login-bg.jpeg');
        height: 100vh;
        background-position: center;
        background-repeat: no-repeat;
    }
}

.lang-wrapper {
    display: flex;
    justify-content: flex-end;
}
:deep(.el-card__body) {
    padding-top: 0px !important;
}
.error-card {
    ::v-deep .el-card__header {
        background-color: #0c213a;
    }
}
.el-card {
    width: 480px;
    max-width: 90%;
    border: 0px;
}
.text-center {
    padding-bottom: 0px !important;
}
.warning-text {
    font-size: 80px !important;
}
</style>
