<template>
    <div class="menu-item">
        <template v-if="!item.childs && showChild(item)">
            <AppLink :to="item.to">
                <el-menu-item
                    :index="['d', index, Date.now()].join('-')"
                    :class="{
                        'active-menu': isActiveMenu(item),
                    }"
                >
                    <img v-if="item.icon" :src="item.icon" class="menu-icon" />
                    <span v-else-if="!item.icon" class="circle" />
                    <span>{{ $t(item.name) }}</span>
                </el-menu-item>
            </AppLink>
        </template>

        <el-sub-menu
            v-if="item.childs && showParent(item)"
            ref="subMenu"
            :index="['d', index].join('-')"
            popper-append-to-body
            :class="{
                'active-menu': isActiveParentMenu(item),
            }"
        >
            <template #title>
                <img v-if="item.icon" :src="item.icon" class="menu-icon" />
                <span>{{ $t(item.name) }}</span>
            </template>
            <SidebarItem
                v-for="(child, itemIndex) in item.childs"
                :key="itemIndex"
                :item="child"
                class="nest-menu"
            />
        </el-sub-menu>
    </div>
</template>

<script lang="ts">
import { Prop, Vue } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import { IMenu, ISubMenu } from '@/modules/common/types';
import AppLink from './AppLink.vue';
import { hasPermissionToAccessRoute } from '@/utils/commonFunction';

@Options({
    components: { AppLink },
})
export default class SidebarItem extends Vue {
    @Prop({ default: () => ({}) }) item!: IMenu;
    @Prop({ default: 0 }) index!: number;

    isActiveMenu(value: ISubMenu): boolean {
        return value.highlightMenu === this.$router.currentRoute?.value?.meta.name;
    }

    isActiveParentMenu(items: ISubMenu): boolean | undefined {
        const isActive = items?.childs
            ?.map((item: ISubMenu) => item.to)
            .includes(this.$route.path);
        return isActive;
    }

    showParent(item: IMenu): boolean {
        if (item.childs) {
            for (const child of item.childs as ISubMenu[]) {
                if (this.showChild(child)) return true;
            }
        }
        return false;
    }

    showChild(item: ISubMenu): boolean {
        return hasPermissionToAccessRoute(item.requiredPermissions as string[]);
    }
}
</script>

<style scoped>
.menu-icon {
    width: 20px;
    height: 20px;
}
.circle {
    height: 6px;
    width: 6px;
    border-radius: 50%;
    border: 1px solid #7081b9;
    padding-right: 3px;
    margin-right: 16px;
    display: block;
}
</style>
