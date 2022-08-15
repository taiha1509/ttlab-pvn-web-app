<template>
    <div class="main-wrapper">
        <LayoutSidebar />
        <ChangePassFirstLoginPopup />
        <!-- Page Wrapper -->
        <div class="page-wrapper">
            <!-- Page Content -->
            <LayoutTopbar />
            <div class="page-content">
                <div class="container-fluid">
                    <router-view v-slot="{ Component }">
                        <transition name="fade-transform" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </div>
                <footer class="footer text-center text-sm-start">
                    © 2021 Pavana
                    <span class="text-muted d-none d-sm-inline-block float-end"
                        >Crafted with <i class="mdi mdi-heart text-danger"></i> by Tokyo
                        Tech Lab</span
                    >
                </footer>
                <!--end footer-->
            </div>
            <!-- /Page Content -->
        </div>
        <!-- /Page Wrapper -->
    </div>
</template>

<script lang="ts">
import { authModule } from '@/modules/auth/store';
import { appModule } from '@/store/app';
import { Options, Vue } from 'vue-class-component';
import ChangePassFirstLoginPopup from '../modules/auth/components/ChangePassFirstLoginPopup.vue';

@Options({
    components: {
        ChangePassFirstLoginPopup,
    },
})
export default class MainLayout extends Vue {
    async created(): Promise<void> {
        const className = ['main_body'];
        if (appModule.isMiniSidebar) {
            className.push('mini-sidebar');
            if (appModule.isExpandMenu) {
                className.push('expand-menu');
            }
        }
        className.forEach((name) => {
            document.body.classList.add(name);
        });
        await authModule.getProfile();
    }
}
</script>

<style lang="scss" scoped></style>
