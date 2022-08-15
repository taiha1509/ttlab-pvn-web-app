<template>
    <div class="left-sidenav">
        <!-- LOGO -->
        <div class="brand">
            <a href="/" class="logo">
                <span>
                    <img
                        :src="require('@/assets/images/logo.png')"
                        alt="logo-small"
                        class="logo-sm"
                    />
                </span>
            </a>
        </div>
        <!--end logo-->
        <div class="sidebar-inner">
            <el-menu :default-openeds="openedMenus" :unique-opened="uniqueOpened">
                <div v-for="(submenu, index) in menus.submenu" :key="index">
                    <SidebarItem :item="submenu" :index="index" />
                </div>
            </el-menu>
        </div>
    </div>
</template>

<script lang="ts">
import { SIDEBAR_XL } from '@/modules/common/constants';
import { IMenuGroup } from '@/modules/common/types';
import { Options, Vue } from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';
import { menus } from './menu';

import SidebarItem from './sidebar/SidebarItem.vue';
@Options({
    components: { SidebarItem },
})
export default class Sidebar extends Vue {
    @Prop({ default: false }) uniqueOpened!: boolean;

    windowWidth = 0;

    mounted(): void {
        this.windowWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
        });
        if (this.windowWidth < SIDEBAR_XL) {
            if (!document.body.classList.contains('enlarge-menu'))
                document.body.classList.add('enlarge-menu');
        } else {
            if (document.body.classList.contains('enlarge-menu')) {
                document.body.classList.remove('enlarge-menu');
            }
        }
    }

    @Watch('windowWidth')
    onChangeWidthofWindow(newValue: number): void {
        if (newValue < SIDEBAR_XL) {
            document.body.classList.add('enlarge-menu');
        } else {
            if (document.body.classList.contains('enlarge-menu')) {
                document.body.classList.remove('enlarge-menu');
            }
        }
    }

    get menus(): IMenuGroup {
        return { ...menus };
    }

    get openedMenus(): string[] {
        return this.menus.submenu.map((_, index) => `d-${index}`);
    }
}
</script>

<style lang="scss" scoped>
.brand {
    height: 53px !important;
    border-bottom: 1px solid rgb(227, 235, 246);
}
.left-sidenav {
    z-index: map-get($map: $zIndex, $key: sidebar) !important;
}
.sidebar {
    background-color: #ffffff;
    overflow: hidden;
    border-right: 1px solid #e0e0e0;
    bottom: 0;
    left: 0;
    margin-top: 0;
    position: fixed;
    top: 64px;
    transition: unset;
    width: 260px;
    height: auto;
    @media only screen and (max-width: 991.98px) {
        margin-left: -260px;
    }
}
.sidebar-inner {
    display: flex;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    flex-direction: column;
    height: calc(97vh - 98px);
    transition: all 0.2s ease-in-out 0s;
    .el-menu {
        border: none;
        padding-top: 20px;
        height: 100%;
        :deep(.el-sub-menu__title) {
            font-size: 13px;
            height: 35px;
            line-height: 35px;
            border-radius: 8px;
            color: #68728c;
            padding-left: 16px !important;
            &:hover {
                background-color: transparent;
                color: #1761fd;
            }
        }
        :deep(.menu-icon) {
            margin-right: 8px;
        }
        :deep(.el-sub-menu__icon-arrow) {
            transform: rotate(-90deg);
        }
        :deep(.is-opened .el-sub-menu__icon-arrow) {
            transform: rotate(0);
        }
        :deep(.el-sub-menu__icon-arrow svg path) {
            fill: #303e67;
        }
        :deep(.is-opened .el-sub-menu__title) {
            color: #303e67;
        }
    }
    .menu-item {
        &:not(:last-child) {
            margin-bottom: 5px;
        }
    }
}
.el-menu-item,
:deep(.el-sub-menu) {
    &.active-menu {
        color: #1761fd;
        border-radius: 8px;
        &.is-opened {
            background-color: transparent;
        }
    }
}
:deep(.el-menu) {
    .el-menu-item {
        font-size: 13px;
        height: 35px;
        line-height: 35px;
        border-radius: 8px;
        &.active-menu {
            color: #1761fd;
            background-color: transparent;
        }
        &.active-menu .circle {
            border-color: #1761fd;
        }
        &:hover {
            color: #1761fd;
            background-color: transparent;
        }
        &:hover .circle {
            border-color: #1761fd;
        }
        &:not(:last-child) {
            margin-bottom: 5px;
        }
    }
    ul {
        .el-menu-item {
            color: #68728c;
            padding-left: 45px !important;
            padding-right: 0;
        }
    }
}
</style>
