<template>
    <div class="mb-5 text-message">
        {{ messageResult }}
    </div>
    <div class="form-group mb-0 row">
        <div class="col-12">
            <button
                class="btn btn-primary w-100 waves-effect waves-light"
                type="button"
                @click="goToLoginPage"
            >
                {{ this.$t('auth.auth.label.goToLoginPage')
                }}<i class="fas fa-sign-in-alt ms-1"></i>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import router from '@/router';
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export default class MessageResult extends Vue {
    @Prop({ default: null }) readonly messageResult!: string | null;

    goToLoginPage(): void {
        router.push('/');
    }
}
</script>
<style scoped>
.text-message {
    text-align: center;
    font-size: 20px;
}
</style>
