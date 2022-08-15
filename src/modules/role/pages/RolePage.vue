<template>
    <LayoutMainContent
        class="role-list-page"
        :breadcrumbs="breadcrumbs"
        :isShowSubSideBar="true"
    >
        <template #title-top-right>
            <div class="group-button" v-if="canDelete || canSubmit">
                <div class="d-flex justify-content-md-center justify-content-center">
                    <el-button
                        size="small"
                        type="primary"
                        @click="onSubmit"
                        v-if="canSubmit"
                    >
                        {{ $t('common.app.buttons.confirm') }}
                    </el-button>
                </div>
            </div>
        </template>
        <template #sub-side-bar>
            <RoleList />
        </template>
        <template #content>
            <RoleForm ref="roleForm" />
        </template>
    </LayoutMainContent>
</template>

<script lang="ts">
import { IBreadcrumb } from '@/modules/common/types';
import { Options, setup, Vue } from 'vue-class-component';
import RoleList from '../components/role-list/RolesList.vue';
import RoleForm from '../components/role-form/RoleForm.vue';
import { ElLoading } from 'element-plus';
import { IRole } from '../type';
import { roleModule } from '../store';
import { PermissionActions } from '../role.constant';
import { roleAction } from '../compositions/roleList';
interface IRoleForm extends Vue {
    form: {
        onSubmit: () => void;
    };
}
@Options({
    components: {
        RoleList,
        RoleForm,
    },
})
export default class RolePage extends Vue {
    get breadcrumbs(): IBreadcrumb[] {
        return [
            {
                title: this.$t('common.app.sidebar.user'),
            },
            {
                title: this.$t('common.app.sidebar.role'),
                isActive: true,
            },
        ];
    }

    get roles(): IRole[] {
        return roleModule.roles;
    }

    get role(): IRole {
        return roleModule.role;
    }

    get canSubmit(): boolean {
        if (!roleModule.role.id)
            return roleModule.userPermissions.includes(PermissionActions.CREATE);
        return roleModule.userPermissions.includes(PermissionActions.UPDATE);
    }

    async fetchData(): Promise<void> {
        const loading = ElLoading.service({ target: '.page-content' });
        await Promise.all([roleModule.getRoles(), roleModule.getPermissionList()]);
        if (roleModule.roles.length > 0) {
            await roleModule.getRole(roleModule.roles[0]?.id as number);
        }
        loading.close();
    }

    onSubmit(): void {
        (this.$refs.roleForm as IRoleForm).form.onSubmit();
    }

    action = setup(() => roleAction());

    created(): void {
        this.fetchData();
    }
}
</script>

<style lang="scss" scoped>
.role-list-page {
    .card {
        margin-bottom: 0;
        height: calc(100vh - 208px);
    }
}
</style>
