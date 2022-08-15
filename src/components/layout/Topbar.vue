<template>
    <div class="topbar">
        <!-- Navbar -->
        <nav class="navbar-custom">
            <ul class="list-unstyled topbar-nav float-end mb-0">
                <li class="dropdown hide-phone">
                    <a
                        class="nav-link dropdown-toggle arrow-none waves-light waves-effect"
                        data-bs-toggle="dropdown"
                        href="#"
                        role="button"
                        aria-haspopup="false"
                        aria-expanded="false"
                        @click="toggleSidebar"
                    >
                    </a>
                </li>
                <li class="dropdown">
                    <HeaderMenuLanguage />
                </li>
                <li class="dropdown">
                    <HeaderMenuAccount />
                </li>
            </ul>
            <!--end topbar-nav-->

            <ul class="list-unstyled topbar-nav mb-0">
                <li>
                    <button class="nav-link button-menu-mobile" @click="toggleSidebar">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-menu align-self-center topbar-icon"
                        >
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
        <!-- end navbar-->
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Topbar extends Vue {
    toggleSidebar(): void {
        if (document.body.classList.contains('enlarge-menu')) {
            document.body.classList.remove('enlarge-menu');
        } else {
            document.body.classList.add('enlarge-menu');
        }
    }
}
</script>

<style lang="scss" scoped>
.button-menu-mobile {
    color: #3c61e0;
    padding-left: 0px;
}
</style>
